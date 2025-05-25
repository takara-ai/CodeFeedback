import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}

// Initialize Redis client
const redis = Redis.fromEnv();

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

    // Use Upstash Redis
    const currentScore = (await redis.zscore("leaderboard", cleanName)) || 0;
    const newTotalScore = currentScore + score;

    // Always update with the summed score
    await redis.zadd("leaderboard", {
      score: newTotalScore,
      member: cleanName,
    });
    await redis.hset(`user:${cleanName}`, { timestamp });
    await redis.expire(`user:${cleanName}`, 30 * 24 * 60 * 60);

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
