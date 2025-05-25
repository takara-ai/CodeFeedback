"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

interface CurriculumStep {
  title: string;
  learn: string;
  prompt: string;
  code: string;
}

function CurriculumContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<CurriculumStep[]>([]);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const curriculumData = searchParams.get("curriculum");
    if (curriculumData) {
      try {
        const decodedCurriculum = decodeURIComponent(curriculumData);
        parseCurriculum(decodedCurriculum);
      } catch (error) {
        console.error("Error decoding curriculum:", error);
      }
    }
  }, [searchParams]);

  const parseCurriculum = (content: string) => {
    const lines = content.split("\n");
    let parsedTitle = "";
    let parsedGoal = "";
    const parsedSteps: CurriculumStep[] = [];

    let currentStepData: CurriculumStep | null = null;
    let currentCode = "";

    let inCodeBlock = false;

    for (const line of lines) {
      if (line.startsWith("# Learning Path:")) {
        parsedTitle = line.replace("# Learning Path:", "").trim();
      } else if (line.startsWith("**Goal:**")) {
        parsedGoal = line.replace("**Goal:**", "").trim();
      } else if (line.startsWith("## Step ")) {
        if (currentStepData) {
          currentStepData.code = currentCode.trim();
          parsedSteps.push(currentStepData);
        }
        currentStepData = {
          title: line.replace(/## Step \d+:\s*/, "").trim(),
          learn: "",
          prompt: "",
          code: "",
        };
        currentCode = "";
      } else if (line.startsWith("**Learn:**") && currentStepData) {
        currentStepData.learn = line.replace("**Learn:**", "").trim();
      } else if (line.startsWith("**Prompt:**") && currentStepData) {
        currentStepData.prompt = line.replace("**Prompt:**", "").trim();
      } else if (line.startsWith("```python")) {
        inCodeBlock = true;
      } else if (line.startsWith("```") && inCodeBlock) {
        inCodeBlock = false;
      } else if (inCodeBlock) {
        currentCode += line + "\n";
      }
    }

    if (currentStepData) {
      currentStepData.code = currentCode.trim();
      parsedSteps.push(currentStepData);
    }

    setTitle(parsedTitle);
    setGoal(parsedGoal);
    setSteps(parsedSteps);
  };

  const progressPercentage =
    steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h1 className="text-xl font-bold">
                  {title || "Loading Curriculum..."}
                </h1>
              </div>
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Curriculum Overview */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6 sticky top-8">
              <h2 className="font-semibold mb-4">Learning Path</h2>
              {goal && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Goal
                  </h3>
                  <p className="text-sm">{goal}</p>
                </div>
              )}

              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>
                    {currentStep + 1}/{steps.length}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="space-y-2">
                {steps.map((step, index) => (
                  <Button
                    key={index}
                    variant={index === currentStep ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-shrink-0">
                        {index < currentStep ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        ) : index === currentStep ? (
                          <Play className="w-5 h-5" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted-foreground rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-sm truncate">{step.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Step {index + 1}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {steps.length > 0 && steps[currentStep] && (
              <div className="bg-card rounded-lg border p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-muted-foreground">
                    {steps[currentStep].learn}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      AI Prompt for This Step
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-blue-800 dark:text-blue-200">
                        {steps[currentStep].prompt}
                      </p>
                    </div>
                  </div>

                  {steps[currentStep].code && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Expected Code Example
                      </h3>
                      <pre className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm">
                          {steps[currentStep].code}
                        </code>
                      </pre>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button asChild>
                      <Link
                        href={`/editor?prompt=${encodeURIComponent(
                          steps[currentStep].prompt
                        )}&code=${encodeURIComponent(steps[currentStep].code)}`}
                      >
                        Start Coding in Editor
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/">Try Different Curriculum</Link>
                    </Button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous Step
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentStep(
                        Math.min(steps.length - 1, currentStep + 1)
                      )
                    }
                    disabled={currentStep === steps.length - 1}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CurriculumLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading curriculum...</p>
      </div>
    </div>
  );
}

export default function CurriculumPage() {
  return (
    <Suspense fallback={<CurriculumLoading />}>
      <CurriculumContent />
    </Suspense>
  );
}
