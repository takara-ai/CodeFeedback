"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CodeEditor } from "@/components/code-editor";
import { BookOpen, ArrowLeft, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

interface Step {
  title: string;
  learn: string;
  prompt: string;
  code: string;
}

function CurriculumContent() {
  const [curriculum, setCurriculum] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [currentCode, setCurrentCode] = useState(""); // For CodeEditor
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const searchParams = useSearchParams();

  useEffect(() => {
    const curriculumData = searchParams.get("curriculum");
    if (curriculumData) {
      try {
        const decodedCurriculum = decodeURIComponent(curriculumData);
        setCurriculum(decodedCurriculum);
        parseCurriculum(decodedCurriculum);
      } catch (error) {
        console.error("Error decoding curriculum:", error);
        setCurriculum("Error loading curriculum");
      }
    }
  }, [searchParams]);

  const parseCurriculum = (content: string) => {
    const lines = content.split("\n");
    let parsedTitle = "";
    let parsedGoal = "";
    const parsedSteps: Step[] = [];

    let currentStepData: Partial<Step> | null = null;
    let inCodeBlock = false;
    let tempCode = ""; // Renamed to avoid conflict

    for (const line of lines) {
      if (line.startsWith("# Learning Path:")) {
        parsedTitle = line.replace("# Learning Path:", "").trim();
      } else if (line.startsWith("**Goal:**")) {
        parsedGoal = line.replace("**Goal:**", "").trim();
      } else if (line.startsWith("## Step ")) {
        if (currentStepData) {
          currentStepData.code = tempCode.trim();
          parsedSteps.push(currentStepData as Step);
        }
        currentStepData = {
          title: line.replace(/## Step \d+:\s*/, "").trim(),
          learn: "",
          prompt: "",
          code: "",
        };
        tempCode = "";
      } else if (line.startsWith("**Learn:**") && currentStepData) {
        currentStepData.learn = line.replace("**Learn:**", "").trim();
      } else if (line.startsWith("**Prompt:**") && currentStepData) {
        currentStepData.prompt = line.replace("**Prompt:**", "").trim();
      } else if (line.startsWith("```python")) {
        inCodeBlock = true;
      } else if (line.startsWith("```") && inCodeBlock) {
        inCodeBlock = false;
      } else if (inCodeBlock) {
        tempCode += line + "\n";
      }
    }

    if (currentStepData) {
      currentStepData.code = tempCode.trim();
      parsedSteps.push(currentStepData as Step);
    }

    setTitle(parsedTitle);
    setGoal(parsedGoal);
    setSteps(parsedSteps);

    // Set the initial code for the first step
    if (parsedSteps.length > 0 && parsedSteps[0].code) {
      setCurrentCode(parsedSteps[0].code);
    }
  };

  const progressPercentage =
    steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  // Update current code when step changes
  useEffect(() => {
    if (steps.length > 0 && steps[currentStep] && steps[currentStep].code) {
      setCurrentCode(steps[currentStep].code);
    }
  }, [currentStep, steps]);

  const navigateToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const markStepComplete = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);

    // Check if all steps are completed
    if (newCompleted.size === steps.length) {
      // Navigate to congratulations page
      const curriculumTitle = encodeURIComponent(title);
      window.location.href = `/congratulations?title=${curriculumTitle}&steps=${steps.length}`;
    } else if (currentStep < steps.length - 1) {
      // Auto-advance to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.has(stepIndex);
  };

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
            <div className="bg-card rounded-lg border p-6 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <h2 className="font-semibold mb-4">Learning Path</h2>
              {goal && (
                <div className="mb-6 min-w-0">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Goal
                  </h3>
                  <p className="text-sm break-all whitespace-normal leading-relaxed">
                    {goal}
                  </p>
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
                {steps.map((step: Step, index: number) => (
                  <Button
                    key={index}
                    variant={index === currentStep ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => navigateToStep(index)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-shrink-0">
                        {isStepCompleted(index) ? (
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
                        <div className="font-medium text-sm break-words">
                          {step.title}
                        </div>
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
                  <h2 className="text-2xl font-bold mb-4 break-words">
                    {steps[currentStep].title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Learning Content */}
                  {steps[currentStep].learn && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-blue-600">
                        📚 What You'll Learn
                      </h3>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-blue-800 dark:text-blue-200 break-words whitespace-pre-wrap leading-relaxed">
                          {steps[currentStep].learn}
                        </p>
                      </div>
                    </div>
                  )}

                  {steps[currentStep].prompt && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-orange-600">
                        🤖 AI Prompt for Practice
                      </h3>
                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <p className="text-orange-800 dark:text-orange-200 break-words whitespace-pre-wrap">
                          {steps[currentStep].prompt}
                        </p>
                      </div>
                    </div>
                  )}

                  {steps[currentStep].code && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-600">
                        📝 Example Code
                      </h3>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="h-64">
                          <CodeEditor
                            code={currentCode}
                            setCode={setCurrentCode}
                            output=""
                            language="python"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 flex-wrap">
                    <Button asChild>
                      <Link
                        href={`/editor?prompt=${encodeURIComponent(
                          steps[currentStep].prompt
                        )}`}
                      >
                        Start Coding in Editor
                      </Link>
                    </Button>
                    {!isStepCompleted(currentStep) && (
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={markStepComplete}
                      >
                        ✅ Mark Step Complete
                      </Button>
                    )}
                    {isStepCompleted(currentStep) && (
                      <Badge variant="secondary" className="px-4 py-2">
                        ✅ Completed
                      </Badge>
                    )}
                    <Button variant="outline" asChild>
                      <Link href="/">Try Different Curriculum</Link>
                    </Button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => navigateToStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous Step
                  </Button>
                  <Button
                    onClick={() =>
                      navigateToStep(
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
