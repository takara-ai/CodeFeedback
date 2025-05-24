import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  Circle,
  Lock,
  Play,
  Star,
  TrendingUp,
} from "lucide-react";

const lessons = [
  {
    id: 1,
    title: "Introduction to Prompt Engineering",
    completed: true,
    locked: false,
    promptScore: 85,
    description: "Learn the fundamentals of crafting effective prompts",
  },
  {
    id: 2,
    title: "Writing Clear and Specific Prompts",
    completed: true,
    locked: false,
    promptScore: 78,
    description: "Master clarity and specificity in your instructions",
  },
  {
    id: 3,
    title: "Context and Background Information",
    completed: false,
    locked: false,
    current: true,
    promptScore: null,
    description: "Provide proper context for better code generation",
  },
  {
    id: 4,
    title: "Iterative Refinement Techniques",
    completed: false,
    locked: false,
    promptScore: null,
    description: "Learn to improve prompts through iteration",
  },
  {
    id: 5,
    title: "Advanced Prompt Patterns",
    completed: false,
    locked: false,
    promptScore: null,
    description: "Chain-of-thought, few-shot, and template patterns",
  },
  {
    id: 6,
    title: "Debugging and Error Analysis",
    completed: false,
    locked: true,
    promptScore: null,
    description: "Fix prompts that generate buggy code",
  },
  {
    id: 7,
    title: "Performance Optimization Prompts",
    completed: false,
    locked: true,
    promptScore: null,
    description: "Write prompts for efficient and optimized code",
  },
  {
    id: 8,
    title: "Final Project: Complex Application",
    completed: false,
    locked: true,
    promptScore: null,
    description: "Create a full application using masterful prompts",
  },
];

export function CourseNavigation() {
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  // Calculate average prompt score for completed lessons
  const completedScores = lessons
    .filter((l) => l.completed && l.promptScore)
    .map((l) => l.promptScore!);
  const avgPromptScore =
    completedScores.length > 0
      ? Math.round(
          completedScores.reduce((a, b) => a + b, 0) / completedScores.length
        )
      : 0;

  const handleLessonClick = (lessonId: number) => {
    // In a real app, this would update the current lesson state
    // For now, we'll just show a notification that this lesson would be loaded
    console.log(`Loading lesson ${lessonId}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg mb-2">Prompt Engineering Mastery</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Course Progress</span>
            <span>
              {completedLessons}/{lessons.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {avgPromptScore > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Avg Prompt Quality</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-yellow-600">
                  {avgPromptScore}/100
                </span>
                <TrendingUp className="w-3 h-3 text-green-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lessons List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {lessons.map((lesson) => (
            <Button
              key={lesson.id}
              variant={lesson.current ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 ${
                lesson.locked ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={lesson.locked}
              onClick={() => handleLessonClick(lesson.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 mt-0.5">
                  {lesson.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : lesson.locked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : lesson.current ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{lesson.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {lesson.description}
                  </div>
                  {lesson.promptScore && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600">
                        {lesson.promptScore}/100
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {lesson.current && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Lesson {lesson.id}
                  </span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* End Goal */}
      <div className="p-4 border-t bg-muted/20">
        <div className="text-center">
          <div className="text-sm font-medium mb-1">
            🎯 Goal: Prompt Engineering Expert
          </div>
          <div className="text-xs text-muted-foreground">
            Consistently generate high-quality code with perfect prompts
          </div>
        </div>
      </div>
    </div>
  );
}
