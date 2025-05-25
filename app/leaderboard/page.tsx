"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
            {rank}
          </div>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">Champion</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">Runner-up</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">Third Place</Badge>;
    if (rank <= 10) return <Badge variant="secondary">Top 10</Badge>;
    return null;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto p-6 max-w-4xl">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Loading leaderboard...</p>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold">
                Prompt Engineering Leaderboard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Top prompt engineers ranked by improvement scores
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center mb-8">
            <Button variant="outline" onClick={fetchLeaderboard}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                New Challenge
              </Link>
            </Button>
          </div>

          {/* Leaderboard */}
          {leaderboard.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scores yet!</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to complete a prompt engineering challenge.
                </p>
                <Button asChild>
                  <Link href="/">Start First Challenge</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* 2nd Place */}
                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-300">
                    <CardContent className="p-4 text-center">
                      <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-bold text-lg">
                        {leaderboard[1].name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-600">
                        {leaderboard[1].score}%
                      </p>
                      <Badge className="bg-gray-400 mt-2">2nd</Badge>
                    </CardContent>
                  </Card>

                  {/* 1st Place */}
                  <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-300 transform scale-105">
                    <CardContent className="p-4 text-center">
                      <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                      <h3 className="font-bold text-xl">
                        {leaderboard[0].name}
                      </h3>
                      <p className="text-3xl font-bold text-yellow-600">
                        {leaderboard[0].score}%
                      </p>
                      <Badge className="bg-yellow-500 mt-2">Champion</Badge>
                    </CardContent>
                  </Card>

                  {/* 3rd Place */}
                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-300">
                    <CardContent className="p-4 text-center">
                      <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                      <h3 className="font-bold text-lg">
                        {leaderboard[2].name}
                      </h3>
                      <p className="text-2xl font-bold text-amber-600">
                        {leaderboard[2].score}%
                      </p>
                      <Badge className="bg-amber-600 mt-2">3rd</Badge>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Full Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Full Rankings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {leaderboard.map((entry, index) => {
                      const rank = index + 1;
                      return (
                        <div
                          key={`${entry.name}-${entry.timestamp}`}
                          className={`flex items-center justify-between p-4 border-b last:border-b-0 ${
                            rank <= 3
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {getRankIcon(rank)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg">
                                  {entry.name}
                                </span>
                                {getRankBadge(rank)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(entry.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {entry.score}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              improvement
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
