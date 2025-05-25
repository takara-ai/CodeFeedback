"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, TrendingUp } from "lucide-react";

interface NameInputModalProps {
  isOpen: boolean;
  score: number;
  onSubmit: (name: string) => void;
  onSkip: () => void;
  isSubmitting?: boolean;
}

export function NameInputModal({
  isOpen,
  score,
  onSubmit,
  onSkip,
  isSubmitting = false,
}: NameInputModalProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  const getScoreMessage = (score: number) => {
    if (score > 200) return "🏆 Legendary! You're a prompt engineering master!";
    if (score > 100) return "🎉 Excellent! That's leaderboard material!";
    if (score > 50) return "✨ Great job! You're getting the hang of this!";
    return "💪 Good effort! Keep practicing!";
  };

  const shouldShowLeaderboard = score > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {score > 100 ? (
              <Trophy className="w-12 h-12 text-yellow-500" />
            ) : score > 50 ? (
              <Star className="w-12 h-12 text-blue-500" />
            ) : (
              <TrendingUp className="w-12 h-12 text-green-500" />
            )}
          </div>
          <CardTitle className="text-xl">Challenge Complete!</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {score > 0 ? "+" : ""}
              {score}% improvement
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {getScoreMessage(score)}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {shouldShowLeaderboard && (
            <>
              <div className="text-center">
                <p className="text-sm font-medium mb-3">
                  🎯 Add your name to the leaderboard!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter your name (e.g., Alex, CodeMaster, etc.)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    disabled={isSubmitting}
                    className="text-center"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Max 20 characters, letters and numbers only
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!name.trim() || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Saving..." : "Save to Leaderboard"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onSkip}
                    disabled={isSubmitting}
                  >
                    Skip
                  </Button>
                </div>
              </form>
            </>
          )}

          {!shouldShowLeaderboard && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Keep practicing to improve your score and make the leaderboard!
              </p>
              <Button onClick={onSkip} className="w-full">
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}