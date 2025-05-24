"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { LessonContent } from "@/components/lesson-content";
import { ComparisonView } from "@/components/comparison-view";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Target,
  CheckCircle,
  Clock,
  Lock,
  Trophy,
  Zap,
  TrendingUp,
} from "lucide-react";
import { lessonGenerator, GeneratedLesson } from "@/lib/lesson-generator";
import { ProgressTracker } from "@/lib/progress-tracker";
import { PromptGrade, CodeAssessment } from "@/types/vibe-learning";

interface LessonState {
  id: number;
  status: "locked" | "current" | "completed";
  score?: number;
}

interface ComparisonData {
  promptComparison: {
    original: string;
    final: string;
    improvements: string[];
  };
  codeComparison: {
    originalQuality: number;
    finalQuality: number;
    improvementPercentage: number;
    keyEnhancements: string[];
  };
  learningJourney: {
    lessonsCompleted: number;
    totalImprovements: number;
    biggestWin: string;
  };
}

function CurriculumContent() {
  const [lessons, setLessons] = useState<GeneratedLesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [lessonStates, setLessonStates] = useState<LessonState[]>([]);
  const [progressTracker, setProgressTracker] =
    useState<ProgressTracker | null>(null);
  const [isGeneratingLessons, setIsGeneratingLessons] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null
  );
  const [originalCode, setOriginalCode] = useState("");
  const [finalCode, setFinalCode] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const originalPrompt = searchParams.get("originalPrompt");
    const originalCodeParam = searchParams.get("originalCode");

    if (originalPrompt && originalCodeParam) {
      initializeDynamicCurriculum(originalPrompt, originalCodeParam);
    }
  }, [searchParams]);

  const initializeDynamicCurriculum = async (
    originalPrompt: string,
    originalCode: string
  ) => {
    setIsGeneratingLessons(true);
    setOriginalCode(originalCode);

    try {
      // Initialize progress tracker
      const tracker = new ProgressTracker(originalPrompt, originalCode);
      await tracker.initializeBaseline();
      setProgressTracker(tracker);

      // Generate dynamic lessons based on user's code
      const generatedLessons = await lessonGenerator.generateLessonSequence({
        originalPrompt,
        originalCode,
      });

      setLessons(generatedLessons);

      // Initialize lesson states
      const initialStates: LessonState[] = generatedLessons.map(
        (lesson, index) => ({
          id: lesson.id,
          status: index === 0 ? "current" : "locked",
        })
      );
      setLessonStates(initialStates);
    } catch (error) {
      console.error("Error generating curriculum:", error);
    }

    setIsGeneratingLessons(false);
  };

  const handleLessonCompletion = (
    lessonId: number,
    improvedPrompt: string,
    newCode: string,
    promptGrade: PromptGrade,
    codeAssessment: CodeAssessment,
    improvementNotes: string[]
  ) => {
    if (!progressTracker) return;

    // Record progress
    progressTracker.recordLessonCompletion(
      lessonId,
      improvedPrompt,
      newCode,
      promptGrade,
      codeAssessment,
      improvementNotes
    );

    // Update lesson states
    setLessonStates((prev) =>
      prev.map((state) => {
        if (state.id === lessonId) {
          return {
            ...state,
            status: "completed" as const,
            score: promptGrade.score,
          };
        }
        if (state.id === lessonId + 1) {
          return { ...state, status: "current" as const };
        }
        return state;
      })
    );

    // Save progress
    progressTracker.saveProgress();

    // Check if curriculum is complete
    if (lessonId === lessons.length) {
      // Show final comparison
      const finalComparison = progressTracker.generateFinalComparison();
      setComparisonData(finalComparison);
      setFinalCode(newCode);
      setShowComparison(true);
    } else {
      // Move to next lesson
      setCurrentLessonId(lessonId + 1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "current":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "locked":
        return <Lock className="w-4 h-4 text-gray-400" />;
      default:
        return <Lock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (state: LessonState) => {
    switch (state.status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            {state.score}/100
          </Badge>
        );
      case "current":
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            In Progress
          </Badge>
        );
      case "locked":
        return (
          <Badge variant="secondary" className="text-xs">
            Locked
          </Badge>
        );
      default:
        return null;
    }
  };

  const completedLessons = lessonStates.filter(
    (state) => state.status === "completed"
  ).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  if (showComparison && comparisonData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ComparisonView
          data={comparisonData}
          originalCode={originalCode}
          finalCode={finalCode}
          onStartNew={() => {
            setShowComparison(false);
            setLessons([]);
            setCurrentLessonId(1);
            setLessonStates([]);
            setProgressTracker(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Left Sidebar - Dynamic Course Navigation */}
        <div className="w-80 border-r">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Your Custom Path</h2>
                <p className="text-sm text-muted-foreground">
                  Tailored to your code
                </p>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">
                  {completedLessons}/{lessons.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                {progressTracker && (
                  <span>
                    {progressTracker.getProgressSummary().improvementPercentage}
                    % improvement so far
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Lesson List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {lessons.map((lesson) => {
                const state = lessonStates.find((s) => s.id === lesson.id);
                if (!state) return null;

                return (
                  <Card
                    key={lesson.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      currentLessonId === lesson.id
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : state.status === "locked"
                        ? "opacity-60"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => {
                      if (state.status !== "locked") {
                        setCurrentLessonId(lesson.id);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getStatusIcon(state.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm truncate">
                              {lesson.title}
                            </h3>
                            {getStatusBadge(state)}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {lesson.description}
                          </p>
                          {lesson.targetImprovement && (
                            <div className="mt-2 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-yellow-600 font-medium">
                                {lesson.targetImprovement}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Final Achievement */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm text-purple-800 dark:text-purple-300">
                    Final Comparison
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    See your amazing improvement!
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Dynamic Lesson */}
        <div className="flex-1 overflow-auto">
          {isGeneratingLessons ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">
                  🤖 AI is Analyzing Your Code
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Creating a personalized curriculum based on your specific
                  prompt and code. Each lesson will target areas where your code
                  can be improved through better prompting.
                </p>
              </div>
            </div>
          ) : lessons.length > 0 ? (
            <LessonContent
              lesson={
                lessons.find((l) => l.id === currentLessonId) || lessons[0]
              }
              onLessonComplete={handleLessonCompletion}
              progressTracker={progressTracker}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Code Provided</h2>
                <p className="text-muted-foreground mb-4">
                  Generate some code first to create your personalized
                  curriculum
                </p>
                <Button onClick={() => (window.location.href = "/")}>
                  Go Back to Generator
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CurriculumPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading your personalized curriculum...
              </p>
            </div>
          </div>
        }
      >
        <CurriculumContent />
      </Suspense>
    </ThemeProvider>
  );
}
