"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Star,
  Sparkles,
  ArrowRight,
  Home,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

function CongratulationsContent() {
  const [title, setTitle] = useState("");
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const curriculumTitle = searchParams.get("title");
    const steps = searchParams.get("steps");

    if (curriculumTitle) {
      try {
        setTitle(decodeURIComponent(curriculumTitle));
      } catch (error) {
        setTitle("Your Learning Journey");
      }
    }

    if (steps) {
      setStepsCompleted(parseInt(steps, 10) || 5);
    }

    setIsVisible(true);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Celebration Header */}
          <div
            className={`transform transition-all duration-1000 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
              </div>
              <Trophy className="w-24 h-24 mx-auto text-yellow-500 relative z-10 animate-bounce" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Congratulations! 🎉
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              You've successfully completed your learning journey and mastered
              new programming skills!
            </p>
          </div>

          {/* Achievement Card */}
          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <Card className="mb-8 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                  Learning Achievement
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Curriculum Completed:
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-lg px-4 py-2 bg-purple-100 text-purple-800"
                    >
                      {title || "Learning Path"}
                    </Badge>
                  </div>

                  <div className="flex justify-center items-center gap-8 flex-wrap">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {stepsCompleted}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Steps Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">🧠</div>
                      <div className="text-sm text-muted-foreground">
                        New Skills Learned
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        💻
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Code Written
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Gained */}
          <div
            className={`transform transition-all duration-1000 delay-600 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Skills You've Gained
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      🤖
                    </div>
                    <h4 className="font-semibold mb-2">AI Collaboration</h4>
                    <p className="text-sm text-muted-foreground">
                      Learned to effectively communicate with AI to solve
                      programming problems
                    </p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      💡
                    </div>
                    <h4 className="font-semibold mb-2">Problem Solving</h4>
                    <p className="text-sm text-muted-foreground">
                      Developed systematic approaches to breaking down complex
                      problems
                    </p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      🚀
                    </div>
                    <h4 className="font-semibold mb-2">Python Programming</h4>
                    <p className="text-sm text-muted-foreground">
                      Gained hands-on experience with Python concepts and best
                      practices
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div
            className={`transform transition-all duration-1000 delay-800 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <ArrowRight className="w-6 h-6 text-blue-500" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Continue Learning</h4>
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href="/">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Start New Curriculum
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Link href="/editor">
                          <span className="text-lg mr-2">💻</span>
                          Practice in Editor
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">
                      Share Your Success
                    </h4>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          const text = `Just completed "${title}" on CodeFeedback! 🎉 Learned to program with AI assistance in ${stepsCompleted} steps. The future of coding is conversational! #CodeFeedback #AILearning`;
                          navigator.share?.({ text }) ||
                            navigator.clipboard?.writeText(text);
                        }}
                      >
                        <span className="text-lg mr-2">📱</span>
                        Share Achievement
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => window.print()}
                      >
                        <span className="text-lg mr-2">📄</span>
                        Print Certificate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating confetti effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 ${
              [
                "bg-yellow-400",
                "bg-blue-400",
                "bg-purple-400",
                "bg-green-400",
                "bg-pink-400",
              ][i % 5]
            } rounded-full animate-bounce opacity-70`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CongratulationsLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading celebration...</p>
      </div>
    </div>
  );
}

export default function CongratulationsPage() {
  return (
    <Suspense fallback={<CongratulationsLoading />}>
      <CongratulationsContent />
    </Suspense>
  );
}
