"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/code-editor";
import {
  ArrowLeft,
  Play,
  Target,
  Brain,
  Zap,
  TrendingUp,
  Copy,
  Save,
  Sparkles,
  RefreshCw,
  CheckCircle,
  XCircle,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface PromptAnalysis {
  score: number;
  feedback: string;
  improved: string;
  strengths: string[];
  weaknesses: string[];
}

export default function PromptLabPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [skillLevel, setSkillLevel] = useState("Vibe Coder");
  const [sessionPrompts, setSessionPrompts] = useState<
    Array<{
      prompt: string;
      score: number;
      timestamp: Date;
    }>
  >([]);

  const analyzePrompt = async () => {
    if (!prompt.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const analysisPrompt = `You are a prompt engineering expert. Analyze this coding prompt and provide detailed feedback:

User's prompt: "${prompt}"

Respond in this exact JSON format:
{
  "score": 85,
  "feedback": "Brief overall assessment...",
  "improved": "Enhanced version of the prompt...",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: analysisPrompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      }

      try {
        const result = JSON.parse(fullContent);
        setAnalysis(result);

        // Update skill level based on score
        if (result.score >= 90) setSkillLevel("AI Whisperer");
        else if (result.score >= 75) setSkillLevel("Prompt Wizard");
        else if (result.score >= 60) setSkillLevel("Context Master");
        else setSkillLevel("Vibe Coder");

        // Add to session history
        setSessionPrompts((prev) => [
          ...prev,
          {
            prompt: prompt,
            score: result.score,
            timestamp: new Date(),
          },
        ]);
      } catch (e) {
        setAnalysis({
          score: Math.floor(Math.random() * 40) + 30,
          feedback: "Add more context and be specific about requirements",
          improved:
            "Consider adding: programming language, expected output format, constraints, and examples",
          strengths: ["Clear intent"],
          weaknesses: ["Lacks specificity", "Missing context"],
        });
      }
    } catch (error) {
      console.error("Error analyzing prompt:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateCode = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedCode("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setGeneratedCode(fullContent);
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating code:", error);
      setGeneratedCode("# Error generating code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const useImprovedPrompt = () => {
    if (analysis?.improved) {
      setPrompt(analysis.improved);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "AI Whisperer":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Prompt Wizard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Context Master":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    }
  };

  const averageScore =
    sessionPrompts.length > 0
      ? Math.round(
          sessionPrompts.reduce((sum, p) => sum + p.score, 0) /
            sessionPrompts.length
        )
      : 0;

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
                <Target className="w-5 h-5 text-purple-600" />
                <h1 className="text-xl font-bold">Prompt Lab</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getSkillLevelColor(skillLevel)}>
                {skillLevel}
              </Badge>
              {sessionPrompts.length > 0 && (
                <Badge variant="outline">Session Avg: {averageScore}/100</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Input */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Craft Your Prompt</h2>
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want the AI to build... Be specific about requirements, constraints, and expected output."
                className="min-h-32 mb-4"
              />

              <div className="flex gap-3">
                <Button
                  onClick={analyzePrompt}
                  disabled={!prompt.trim() || isAnalyzing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Prompt
                    </>
                  )}
                </Button>

                <Button
                  onClick={generateCode}
                  disabled={!prompt.trim() || isGenerating}
                  variant="outline"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Test Prompt
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold">Analysis Results</h2>
                  </div>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(
                      analysis.score
                    )}`}
                  >
                    {analysis.score}/100
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      📊 Overall Assessment
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300">
                      {analysis.feedback}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {analysis.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="text-green-700 dark:text-green-300 text-sm"
                          >
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Areas to Improve
                      </h4>
                      <ul className="space-y-1">
                        {analysis.weaknesses.map((weakness, index) => (
                          <li
                            key={index}
                            className="text-red-700 dark:text-red-300 text-sm"
                          >
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {analysis.improved && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Improved Version
                        </h4>
                        <Button
                          size="sm"
                          onClick={useImprovedPrompt}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Use This
                        </Button>
                      </div>
                      <p className="text-purple-700 dark:text-purple-300">
                        {analysis.improved}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Generated Code */}
            {generatedCode && (
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold">Generated Code</h2>
                  </div>
                  <Button size="sm" variant="outline">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="h-64">
                    <CodeEditor
                      code={generatedCode}
                      setCode={setGeneratedCode}
                      output=""
                      language="python"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Progress */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Session Progress</h3>
              </div>

              {sessionPrompts.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {averageScore}
                    </div>
                    <div className="text-sm text-blue-600">Average Score</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Prompts</h4>
                    {sessionPrompts
                      .slice(-3)
                      .reverse()
                      .map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                item.score
                              )}`}
                            >
                              {item.score}/100
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.prompt.substring(0, 50)}...
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Start analyzing prompts to track your progress!
                  </p>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold">Pro Tips</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Be Specific
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Include programming language, framework, and desired
                    outcome.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Add Context
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300">
                    Mention constraints, requirements, and expected behavior.
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Include Examples
                  </h4>
                  <p className="text-green-700 dark:text-green-300">
                    Show input/output examples when possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
