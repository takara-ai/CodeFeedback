"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, RefreshCw, Star, TrendingUp, CheckCircle } from "lucide-react";
import { PromptGrade, CodeAssessment, Lesson } from "@/types/vibe-learning";
import { ProgressTracker } from "@/lib/progress-tracker";
import { cleanAndParseJSON } from "@/lib/json-cleaner";

interface LessonContentProps {
  lesson: Lesson;
  originalPrompt?: string;
  onLessonComplete?: (
    lessonId: number,
    improvedPrompt: string,
    newCode: string,
    promptGrade: PromptGrade,
    codeAssessment: CodeAssessment,
    improvementNotes: string[]
  ) => void;
  progressTracker?: ProgressTracker | null;
}

export function LessonContent({
  lesson,
  originalPrompt: originalPromptProp,
  onLessonComplete,
}: LessonContentProps) {
  const [userPrompt, setUserPrompt] = useState(originalPromptProp || "");
  const [generatedCode, setGeneratedCode] = useState("");
  const [promptGrade, setPromptGrade] = useState<PromptGrade | null>(null);
  const [codeAssessment, setCodeAssessment] = useState<CodeAssessment | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const originalPrompt =
    originalPromptProp || lesson.challenge || "Build an expense tracker";

  // Update user prompt when original prompt prop changes
  useEffect(() => {
    if (originalPromptProp) {
      setUserPrompt(originalPromptProp);
    }
  }, [originalPromptProp]);

  const handleImproveAndGrade = async () => {
    if (!userPrompt.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      // Grade the prompt and generate code in parallel
      const [gradingResponse, codeResponse] = await Promise.all([
        // Grade the improved prompt
        fetch("/api/chat-json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Grade this improved prompt on clarity, specificity, and context (0-100 each). Be very concise.

Original: "${originalPrompt}"
Improved: "${userPrompt}"

{
  "score": 85,
  "clarity": 80,
  "specificity": 90,
  "context": 85,
  "feedback": "Good improvement in specificity. Add more context about error handling.",
  "suggestions": ["Add error handling details", "Specify data validation", "Include edge cases"]
}`,
              },
            ],
          }),
        }),

        // Generate code with improved prompt
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Generate Python code based on this prompt. Return ONLY the Python code:

${userPrompt}`,
              },
            ],
          }),
        }),
      ]);

      // Process grading
      const gradingData = await gradingResponse.json();
      if (gradingData.content) {
        const gradeData = cleanAndParseJSON(gradingData.content);
        setPromptGrade(gradeData);
      }

      // Process code generation
      const reader = codeResponse.body?.getReader();
      const decoder = new TextDecoder();
      let code = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  code += parsed.content;
                  setGeneratedCode(code);
                }
              } catch {
                // Ignore parsing errors
              }
            }
          }
        }
      }

      // Auto-assess the generated code
      setTimeout(() => assessGeneratedCode(code), 1000);
    } catch (error) {
      console.error("Error in improve and grade:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const assessGeneratedCode = async (code: string) => {
    try {
      const response = await fetch("/api/chat-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Assess this code quality briefly (0-100). Be concise.

Prompt: "${userPrompt}"
Code: ${code}

{
  "score": 82,
  "functionality": 85,
  "quality": 80,
  "efficiency": 81,
  "feedback": "Good structure. Consider adding error handling for edge cases."
}`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.content) {
        const assessmentData = cleanAndParseJSON(data.content);
        setCodeAssessment(assessmentData);
      }
    } catch (error) {
      console.error("Error assessing code:", error);
    }
  };

  const handleComplete = () => {
    if (onLessonComplete && promptGrade && codeAssessment) {
      const improvementNotes = (promptGrade.suggestions || []).map((s) => s);
      onLessonComplete(
        lesson.id,
        userPrompt,
        generatedCode,
        promptGrade,
        codeAssessment,
        improvementNotes
      );
    }
  };

  const getGradeBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge className="bg-red-500">Needs Work</Badge>;
  };

  return (
    <div className="h-full grid grid-rows-[auto_1fr_auto] gap-6 p-6">
      {/* Header - Original Prompt */}
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">
                Original Prompt
              </h3>
              <p className="text-gray-900 dark:text-gray-100">
                "{originalPrompt}"
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Baseline
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Left: Improvement Section */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <h2 className="font-semibold text-lg mb-2">{lesson.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(lesson as any).improvementFocus || lesson.description}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Improve your prompt:
                  </label>
                  <Textarea
                    placeholder="Edit and improve your original prompt with the lesson's guidance..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={handleImproveAndGrade}
                  disabled={!userPrompt.trim() || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Improve & Grade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Grade */}
          {promptGrade && (
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">
                      Grade: {promptGrade.score}/100
                    </span>
                  </div>
                  {getGradeBadge(promptGrade.score)}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="text-center">
                    <div className="font-medium">Clarity</div>
                    <div className="text-muted-foreground">
                      {promptGrade.clarity || promptGrade.score}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Specific</div>
                    <div className="text-muted-foreground">
                      {promptGrade.specificity || promptGrade.score}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Context</div>
                    <div className="text-muted-foreground">
                      {promptGrade.context || promptGrade.score}
                    </div>
                  </div>
                </div>

                {promptGrade.feedback && (
                  <p className="text-sm text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    {promptGrade.feedback}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Code & Assessment */}
        <div className="flex flex-col gap-4">
          {generatedCode && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Generated Code
                </h3>
                <div className="bg-gray-900 rounded p-3 overflow-auto max-h-64">
                  <pre className="text-sm text-gray-100">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {codeAssessment && (
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">
                    Code Quality: {codeAssessment.score}/100
                  </span>
                  {getGradeBadge(codeAssessment.score)}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="text-center">
                    <div className="font-medium">Function</div>
                    <div className="text-muted-foreground">
                      {codeAssessment.functionality || codeAssessment.score}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Quality</div>
                    <div className="text-muted-foreground">
                      {codeAssessment.quality || codeAssessment.score}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Efficiency</div>
                    <div className="text-muted-foreground">
                      {codeAssessment.efficiency || codeAssessment.score}
                    </div>
                  </div>
                </div>

                {codeAssessment.feedback && (
                  <p className="text-sm text-green-800 dark:text-green-200 bg-green-50 dark:bg-green-950/20 p-2 rounded">
                    {codeAssessment.feedback}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {promptGrade && codeAssessment && (
        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg">
            Complete Lesson →
          </Button>
        </div>
      )}
    </div>
  );
}
