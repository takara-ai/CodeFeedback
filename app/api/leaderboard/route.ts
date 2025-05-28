import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}

// Initialize Redis client
const redis = Redis.fromEnv();

// Security constants
const MAX_SCORE_PER_SUBMISSION = 1000; // Maximum reasonable score per game
const MAX_NAME_LENGTH = 20;
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 submissions per minute per IP
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Generate a secure session token for game sessions
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Validate session token format
function isValidSessionToken(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}

// Rate limiting check
async function checkRateLimit(identifier: string): Promise<boolean> {
  const key = `rate_limit:${identifier}`;
  const current = (await redis.get(key)) || 0;

  if (Number(current) >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  await redis.setex(key, RATE_LIMIT_WINDOW, Number(current) + 1);
  return true;
}

// Validate and sanitize name input
function sanitizeName(name: string): string | null {
  if (!name || typeof name !== "string") return null;

  // Clean and validate name
  const cleaned = name
    .trim()
    .slice(0, MAX_NAME_LENGTH)
    .replace(/[^\w\s-]/g, "") // Only allow alphanumeric, spaces, and hyphens
    .replace(/\s+/g, " "); // Normalize whitespace

  if (cleaned.length < 1) return null;

  // Prevent common spam/test patterns
  const lowerCased = cleaned.toLowerCase();
  const bannedPatterns = [
    "test",
    "admin",
    "null",
    "undefined",
    "script",
    "eval",
    "hack",
    "bot",
    "spam",
    "www.",
    "http",
    ".com",
    ".net",
  ];

  if (bannedPatterns.some((pattern) => lowerCased.includes(pattern))) {
    return null;
  }

  return cleaned;
}

// Validate score based on game mechanics
function validateScore(score: number, sessionData?: any): boolean {
  if (typeof score !== "number" || !Number.isFinite(score)) return false;
  if (score < 0 || score > MAX_SCORE_PER_SUBMISSION) return false;
  if (score % 1 !== 0) return false; // Must be integer

  // Additional validation based on game session if available
  // This would check if the score is reasonable based on the game played

  return true;
}

export async function GET() {
  try {
    // Use Upstash Redis
    const entries = await redis.zrange("leaderboard", 0, 99, {
      rev: true,
      withScores: true,
    });

    const leaderboard: LeaderboardEntry[] = [];
    for (let i = 0; i < entries.length; i += 2) {
      const name = entries[i] as string;
      const score = entries[i + 1] as number;

      const timestamp =
        (await redis.hget(`user:${name}`, "timestamp")) || Date.now();

      leaderboard.push({
        name,
        score,
        timestamp: Number(timestamp),
      });
    }

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ leaderboard: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting
    if (!(await checkRateLimit(clientIP))) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, score, sessionToken, gameData } = body;

    // Validate session token presence and format
    if (!sessionToken || !isValidSessionToken(sessionToken)) {
      return NextResponse.json(
        { error: "Invalid or missing session token" },
        { status: 401 }
      );
    }

    // Check if session token exists and is valid
    const sessionKey = `session:${sessionToken}`;
    const sessionData = await redis.hgetall(sessionKey);

    if (!sessionData || Object.keys(sessionData).length === 0) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 }
      );
    }

    // Check if session is expired
    const sessionTimestamp = Number(sessionData.timestamp || 0);
    if (Date.now() - sessionTimestamp > SESSION_TIMEOUT) {
      await redis.del(sessionKey);
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Validate and sanitize name
    const cleanName = sanitizeName(name);
    if (!cleanName) {
      return NextResponse.json(
        {
          error:
            "Invalid name. Use only letters, numbers, spaces, and hyphens.",
        },
        { status: 400 }
      );
    }

    // Validate score
    if (!validateScore(score, sessionData)) {
      return NextResponse.json(
        { error: "Invalid score value" },
        { status: 400 }
      );
    }

    // Check if this session has already been used to submit a score
    if (sessionData.used === "true") {
      return NextResponse.json(
        { error: "Score already submitted for this game session" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();

    // Use Upstash Redis
    const currentScore = (await redis.zscore("leaderboard", cleanName)) || 0;
    const newTotalScore = currentScore + score;

    // Update leaderboard
    await redis.zadd("leaderboard", {
      score: newTotalScore,
      member: cleanName,
    });

    // Update user timestamp
    await redis.hset(`user:${cleanName}`, { timestamp });
    await redis.expire(`user:${cleanName}`, 30 * 24 * 60 * 60);

    // Mark session as used to prevent reuse
    await redis.hset(sessionKey, { used: "true" });
    await redis.expire(sessionKey, 3600); // Keep for 1 hour for debugging

    // Log submission for monitoring
    console.log(
      `Score submitted: ${cleanName} (+${score}) = ${newTotalScore} [IP: ${clientIP}]`
    );

    return NextResponse.json({
      success: true,
      updated: true,
      newScore: newTotalScore,
      addedScore: score,
      previousScore: currentScore,
    });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// New endpoint to create game sessions
export async function PUT(request: NextRequest) {
  try {
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limit session creation
    if (!(await checkRateLimit(`session:${clientIP}`))) {
      return NextResponse.json(
        { error: "Too many session requests" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { gameType, originalPrompt, userPrompt } = body;

    // Validate game data
    if (!gameType || !originalPrompt || !userPrompt) {
      return NextResponse.json(
        { error: "Missing required game data" },
        { status: 400 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const sessionKey = `session:${sessionToken}`;

    // Store session data
    await redis.hset(sessionKey, {
      gameType,
      originalPrompt: originalPrompt.slice(0, 500), // Limit length
      userPrompt: userPrompt.slice(0, 1000), // Limit length
      timestamp: Date.now(),
      ip: clientIP,
      used: "false",
    });

    // Set session expiration
    await redis.expire(sessionKey, SESSION_TIMEOUT / 1000);

    return NextResponse.json({
      sessionToken,
      expiresIn: SESSION_TIMEOUT,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
