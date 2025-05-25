import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}

// Fallback in-memory storage for local development
let memoryLeaderboard: LeaderboardEntry[] = [];

// Check if we're in an environment with Upstash Redis
const hasUpstashRedis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

function getRedis() {
    if (hasUpstashRedis) {
        return Redis.fromEnv();
    }
    return null;
}

export async function GET() {
  try {
    const redis = getRedis();

    if (redis) {
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
    } else {
      // Use in-memory storage
      const sortedLeaderboard = [...memoryLeaderboard]
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);

      return NextResponse.json({ leaderboard: sortedLeaderboard });
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ leaderboard: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, score } = await request.json();

    if (!name || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Clean name (max 20 chars, alphanumeric + spaces)
    const cleanName = name
      .trim()
      .slice(0, 20)
      .replace(/[^a-zA-Z0-9\s]/g, "");

    if (!cleanName) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const timestamp = Date.now();
    const redis = getRedis();

    if (redis) {
      // Use Redis
      const currentScore = (await redis.zscore("leaderboard", cleanName)) || 0;

      if (score > currentScore) {
        await redis.zadd("leaderboard", { score, member: cleanName });
        await redis.hset(`user:${cleanName}`, { timestamp });
        await redis.expire(`user:${cleanName}`, 30 * 24 * 60 * 60);
      }

      return NextResponse.json({
        success: true,
        updated: score > currentScore,
        newScore: Math.max(score, currentScore),
      });
    } else {
      // Use in-memory storage
      const existingIndex = memoryLeaderboard.findIndex(
        (entry) => entry.name === cleanName
      );

      if (existingIndex >= 0) {
        const currentScore = memoryLeaderboard[existingIndex].score;
        if (score > currentScore) {
          memoryLeaderboard[existingIndex] = {
            name: cleanName,
            score,
            timestamp,
          };
        }
        return NextResponse.json({
          success: true,
          updated: score > currentScore,
          newScore: Math.max(score, currentScore),
        });
      } else {
        memoryLeaderboard.push({ name: cleanName, score, timestamp });
        return NextResponse.json({
          success: true,
          updated: true,
          newScore: score,
        });
      }
    }
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}