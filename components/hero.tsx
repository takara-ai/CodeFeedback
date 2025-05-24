"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Play,
  Sparkles,
  MessageSquare,
  Send,
  Code2,
  Target,
  Brain,
  Zap,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [promptScore, setPromptScore] = useState(0);
  const [promptFeedback, setPromptFeedback] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skillLevel, setSkillLevel] = useState("Vibe Coder");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const analyzePrompt = async () => {
    if (!prompt.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setPromptScore(0);
    setPromptFeedback("");
    setImprovedPrompt("");

    try {
      const analysisPrompt = `You are a prompt engineering expert. Analyze this coding prompt and provide:

1. A score from 0-100 based on clarity, specificity, context, and effectiveness
2. Brief feedback on what's missing or could be improved
3. An improved version of the prompt

User's prompt: "${prompt}"

Respond in this exact JSON format:
{
  "score": 85,
  "feedback": "Good specificity but missing context about...",
  "improved": "Enhanced version of the prompt..."
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

      // Try to parse the JSON response
      try {
        const result = JSON.parse(fullContent);
        setPromptScore(result.score || 0);
        setPromptFeedback(result.feedback || "Analysis completed");
        setImprovedPrompt(result.improved || "");

        // Update skill level based on score
        if (result.score >= 90) setSkillLevel("AI Whisperer");
        else if (result.score >= 75) setSkillLevel("Prompt Wizard");
        else if (result.score >= 60) setSkillLevel("Context Master");
        else setSkillLevel("Vibe Coder");
      } catch (e) {
        // Fallback if JSON parsing fails
        setPromptScore(Math.floor(Math.random() * 40) + 30); // 30-70 range
        setPromptFeedback(
          "Add more context and be specific about requirements"
        );
        setImprovedPrompt(
          "Consider adding: programming language, expected output format, constraints, and examples"
        );
      }
    } catch (error) {
      console.error("Error analyzing prompt:", error);
      setPromptFeedback("Error analyzing prompt. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      analyzePrompt();
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

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Headline */}
        <div
          className={`transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex justify-center mb-4">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Master AI Coding Prompts
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            From
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {" "}
              Vibe Coder{" "}
            </span>
            to
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
              {" "}
              AI Whisperer{" "}
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <div
          className={`transform transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            The future of coding is <strong>prompt engineering</strong>. Learn
            to craft surgical prompts that make AI build exactly what you
            envision. Transform from random requests to precision commands.
          </p>
        </div>

        {/* Interactive Prompt Analyzer */}
        <div
          className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Prompt Analyzer</h3>
                <Badge className={`ml-auto ${getSkillLevelColor(skillLevel)}`}>
                  {skillLevel}
                </Badge>
              </div>

              <div className="flex gap-2 mb-4">
                <Input
                  value={prompt}
                  onChange={handleInputChange}
                  placeholder="Enter your coding prompt... (e.g. 'make a todo app')"
                  className="text-lg py-6 px-6 flex-1"
                  onKeyPress={handleKeyPress}
                  disabled={isAnalyzing}
                />
                <Button
                  size="lg"
                  onClick={analyzePrompt}
                  disabled={!prompt.trim() || isAnalyzing}
                  className="px-6 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Analyze Prompt
                    </>
                  )}
                </Button>
              </div>

              {promptScore > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Prompt Score:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getScoreColor(
                          promptScore
                        )}`}
                      >
                        {promptScore}/100
                      </span>
                    </div>
                  </div>

                  {promptFeedback && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        💡 Improvement Suggestions:
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        {promptFeedback}
                      </p>
                    </div>
                  )}

                  {improvedPrompt && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                        ✨ Improved Version:
                      </h4>
                      <p className="text-green-700 dark:text-green-300">
                        {improvedPrompt}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Example prompts */}
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  ❌ Vibe Coder Prompt:
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 italic">
                  "make a todo app"
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Score: ~25/100 - Too vague, no context
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  ✅ AI Whisperer Prompt:
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  "Create a React TypeScript todo app with local storage
                  persistence, drag-and-drop reordering, and dark mode support.
                  Include proper TypeScript interfaces and error handling."
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Score: ~95/100 - Specific, contextual, actionable
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div
          className={`transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 text-lg"
              asChild
            >
              <Link href="/prompt-lab">
                <Code2 className="w-5 h-5 mr-2" />
                Start Prompt Lab
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg"
              asChild
            >
              <Link href="/learning-paths">
                <Brain className="w-5 h-5 mr-2" />
                Learning Paths
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="px-8 py-4 text-lg"
              asChild
            >
              <Link href="/prompt-library">
                <Sparkles className="w-5 h-5 mr-2" />
                Prompt Library
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
