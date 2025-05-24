"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mic,
  ArrowUp,
  BookOpen,
  Hammer,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [generatedCurriculum, setGeneratedCurriculum] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<"code" | "curriculum">("curriculum");
  const supriseBuilds: string[] = [
    "Build a pomodoro timer in the terminal using Python",
    "Write a python script to convert simple Markdown to HTML",
    "Make a multiple-choice quiz game in Python",
    "Detect duplicate files in a directory using hash comparison in Python",
  ];
  const supriseCurriculums: string[] = [
    "I want to learn how to build a command-line Pomodoro timer wioth Python",
    "I want to understand object-oriented programming with Python from scratch",
    "I want to learn how to handle and visualise data with pandas and matplotlib",
    "I want to master error handling and debugging techniques in Python",
  ];

  const handleSupriseClick = () => {
    if (mode == "code") {
      setPrompt(
        supriseBuilds[Math.floor(Math.random() * supriseBuilds.length)]
      );
    } else {
      setPrompt(
        supriseCurriculums[Math.floor(Math.random() * supriseBuilds.length)]
      );
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const generateContent = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    if (mode === "code") {
      setGeneratedCode("");
    } else {
      setGeneratedCurriculum("");
    }

    try {
      const contentPrompt =
        mode === "code"
          ? `You are a Python code generator. Generate ONLY Python code based on the user's request. Do not include explanations, comments, or any text outside of the code. Do not wrap the code in markdown code blocks. Respond with clean, functional Python code only.

User request: ${prompt}`
          : `You are a personalized Python programming instructor. Create a 5-step learning curriculum based on this learning goal: "${prompt}"

Return your response in this EXACT markdown format:

# Learning Path: [Title]

**Goal:** [What they'll achieve]

## Step 1: [Step Title]
**Learn:** [What they'll learn]
**Prompt:** [Specific AI prompt for this step]
\`\`\`python
# Expected code example they'll create
\`\`\`

## Step 2: [Step Title]
**Learn:** [What they'll learn]  
**Prompt:** [Specific AI prompt for this step]
\`\`\`python
# Expected code example they'll create
\`\`\`

[Continue for all 5 steps]

Each step should build on the previous one. Focus on practical, hands-on Python programming.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: contentPrompt }],
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
                  if (mode === "code") {
                    setGeneratedCode(cleanCodeBlock(fullContent));
                  } else {
                    setGeneratedCurriculum(fullContent);
                  }
                }
              } catch (_e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
      if (mode === "code") {
        setGeneratedCode("# Error generating code. Please try again.");
      } else {
        setGeneratedCurriculum(
          "# Error generating curriculum. Please try again."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to clean markdown code blocks and extract Python code
  const cleanCodeBlock = (code: string): string => {
    // Remove markdown code block syntax
    const cleaned = code
      .replace(/^```python\s*/i, "") // Remove opening ```python
      .replace(/^```\s*/gm, "") // Remove opening ```
      .replace(/\s*```\s*$/g, "") // Remove closing ```
      .trim();

    // If the code is empty after cleaning, return the original
    if (!cleaned) {
      return code;
    }

    return cleaned;
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Headline */}
        <div
          className={`transform transition-all duration-1000 delay-200  mt-20 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Build with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              {" "}
              Language{" "}
            </span>
            Not Code
          </h1>
        </div>

        {/* Subheadline */}
        <div
          className={`transform transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            <i>"The Hottest New Programming Language is English"</i> -- Andrej Kaparthy
          </p>
        </div>

        {/* Interactive Prompt Box */}
        <div className="relative w-full max-w-3xl mx-auto mt-16 mb-16">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 px-4 py-2">
            {/* Input field */}
            <div className="flex items-center mb-1">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === "curriculum"
                    ? "Try: &apos;I want to learn data analysis with Python&apos;"
                    : "Try: &apos;Create a function to check if a number is prime&apos;"
                }
                onKeyPress={(e) => e.key === "Enter" && generateContent()}
                disabled={isGenerating}
                className="flex-1 bg-transparent border-none text-gray-100 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg px-0"
              />
            </div>

            {/* All buttons at bottom */}
            <div className="flex items-center justify-between pt-0">
              <div className="flex items-center gap-2">
                <Button
                  variant={mode === "curriculum" ? "default" : "ghost"}
                  onClick={() => setMode("curriculum")}
                  className={
                    mode == "curriculum"
                      ? "bg-white text-black hover:text-white hover:bg-gray-700 flex items-center gap-2 px-3 py-2 transition-all duration-300"
                      : "text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-2 px-3 py-2 transition-all duration-300"
                  }
                  size="sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Curriculum
                </Button>
                <Button
                  variant={mode === "code" ? "default" : "ghost"}
                  onClick={() => setMode("code")}
                  className={
                    mode == "code"
                      ? "bg-white text-black hover:text-white hover:bg-gray-700 flex items-center gap-2 px-3 py-2 transition-all duration-300"
                      : "text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-2 px-3 py-2 transition-all duration-300"
                  }
                  size="sm"
                >
                  <Hammer className="w-4 h-4" />
                  Build
                </Button>
              </div>

              {/* Audio button */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full w-10 h-10"
                >
                  <Mic className="w-5 h-5" />
                </Button>
                {/* Submission Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full w-10 h-10"
                  onClick={generateContent}
                  disabled={!prompt.trim() || isGenerating}
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Surprise Me button below search */}
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800 flex items-center gap-2 mx-auto"
              onClick={handleSupriseClick}
            >
              <Sparkles className="w-4 h-4" />
              Surprise me
            </Button>
          </div>
        </div>

        {/* Generated Code Display / Demo */}
        <div
          className={`relative max-w-5xl mx-auto transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border overflow-hidden hover:shadow-3xl transition-shadow duration-500 group">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full group-hover:animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full group-hover:animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full group-hover:animate-pulse delay-200"></div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  {mode === "code"
                    ? generatedCode
                      ? "Your Generated Code"
                      : "Natural Language → Code"
                    : generatedCurriculum
                    ? "Your Generated Curriculum"
                    : "Natural Language → Curriculum"}
                </span>
              </div>
            </div>

            {mode === "code" ? (
              generatedCode ? (
                // Show generated code
                <div className="p-6 text-left">
                  <div className="text-xs text-green-600 font-medium mb-3">
                    GENERATED FROM YOUR PROMPT:
                  </div>
                  <pre className="text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    <code className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {generatedCode}
                    </code>
                  </pre>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setPrompt("");
                        setGeneratedCode("");
                      }}
                      variant="outline"
                    >
                      Try Another
                    </Button>
                    <Button size="sm" asChild>
                      <Link
                        href={`/editor${
                          generatedCode
                            ? `?code=${encodeURIComponent(generatedCode)}`
                            : ""
                        }`}
                      >
                        Edit in Full Editor
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                // Show demo split view
                <div className="flex">
                  {/* Chat side */}
                  <div className="flex-1 p-6 border-r border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-750">
                    <div className="space-y-3 text-left">
                      <div className="text-xs text-blue-600 font-medium mb-2">
                        YOU SAY:
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-sm">
                        &ldquo;Create a function that calculates fibonacci
                        numbers efficiently, and show me how to use it&rdquo;
                      </div>
                      <div className="text-xs text-purple-600 font-medium mt-4 mb-2">
                        AI DELIVERS:
                      </div>
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-sm">
                        &ldquo;I&apos;ll create an optimized fibonacci function
                        using memoization...&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Code side */}
                  <div className="flex-1 p-6 text-left">
                    <div className="text-xs text-green-600 font-medium mb-2">
                      GENERATED CODE:
                    </div>
                    <pre className="text-sm">
                      <code className="text-blue-600">def</code>{" "}
                      <code className="text-purple-600">fibonacci_memo</code>
                      <code className="text-gray-600">(n, memo={"{}"}):</code>
                      {"\n"}
                      <code className="text-blue-600"> if</code>{" "}
                      <code className="text-gray-600">n in memo:</code>
                      {"\n"}
                      <code className="text-blue-600"> return</code>{" "}
                      <code className="text-gray-600">memo[n]</code>
                      {"\n"}
                      <code className="text-blue-600"> if</code>{" "}
                      <code className="text-gray-600">n &lt;= 1:</code>
                      {"\n"}
                      <code className="text-blue-600"> return</code>{" "}
                      <code className="text-gray-600">n</code>
                      {"\n"}
                      <code className="text-gray-600"> memo[n] = </code>
                      <code className="text-purple-600">fibonacci_memo</code>
                      <code className="text-gray-600">(n-1, memo)</code>
                      {"\n"}
                      <code className="text-gray-600"> + </code>
                      <code className="text-purple-600">fibonacci_memo</code>
                      <code className="text-gray-600">(n-2, memo)</code>
                      {"\n"}
                      <code className="text-blue-600"> return</code>{" "}
                      <code className="text-gray-600">memo[n]</code>
                    </pre>
                  </div>
                </div>
              )
            ) : generatedCurriculum ? (
              // Show generated curriculum
              <div className="p-6 text-left">
                <div className="text-xs text-green-600 font-medium mb-3">
                  GENERATED CURRICULUM:
                </div>
                <pre className="text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {generatedCurriculum}
                  </code>
                </pre>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setPrompt("");
                      setGeneratedCurriculum("");
                    }}
                    variant="outline"
                  >
                    Try Another
                  </Button>
                  <Button size="sm" asChild>
                    <Link
                      href={`/curriculum${
                        generatedCurriculum
                          ? `?curriculum=${encodeURIComponent(
                              generatedCurriculum
                            )}`
                          : ""
                      }`}
                    >
                      Start Learning Journey
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              // Show demo split view
              <div className="flex">
                {/* Chat side */}
                <div className="flex-1 p-6 border-r border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-750">
                  <div className="space-y-3 text-left">
                    <div className="text-xs text-blue-600 font-medium mb-2">
                      YOU SAY:
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-sm">
                      &ldquo;Create a curriculum for learning Python
                      programming&rdquo;
                    </div>
                    <div className="text-xs text-purple-600 font-medium mt-4 mb-2">
                      AI DELIVERS:
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-sm">
                      &ldquo;I&apos;ll create a 5-step curriculum for learning
                      Python programming&rdquo;
                    </div>
                  </div>
                </div>

                {/* Code side */}
                <div className="flex-1 p-6 text-left">
                  <div className="text-xs text-green-600 font-medium mb-2">
                    GENERATED CURRICULUM:
                  </div>
                  <pre className="text-sm">
                    <code className="text-blue-600">def</code>{" "}
                    <code className="text-purple-600">fibonacci_memo</code>
                    <code className="text-gray-600">(n, memo={"{}"}):</code>
                    {"\n"}
                    <code className="text-blue-600"> if</code>{" "}
                    <code className="text-gray-600">n in memo:</code>
                    {"\n"}
                    <code className="text-blue-600"> return</code>{" "}
                    <code className="text-gray-600">memo[n]</code>
                    {"\n"}
                    <code className="text-blue-600"> if</code>{" "}
                    <code className="text-gray-600">n &lt;= 1:</code>
                    {"\n"}
                    <code className="text-blue-600"> return</code>{" "}
                    <code className="text-gray-600">n</code>
                    {"\n"}
                    <code className="text-gray-600"> memo[n] = </code>
                    <code className="text-purple-600">fibonacci_memo</code>
                    <code className="text-gray-600">(n-1, memo)</code>
                    {"\n"}
                    <code className="text-gray-600"> + </code>
                    <code className="text-purple-600">fibonacci_memo</code>
                    <code className="text-gray-600">(n-2, memo)</code>
                    {"\n"}
                    <code className="text-blue-600"> return</code>{" "}
                    <code className="text-gray-600">memo[n]</code>
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Floating Learning Tip */}
          {mode === "curriculum" && !generatedCurriculum && (
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 max-w-xs hidden lg:block animate-float">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-green-600 animate-pulse" />
                </div>
                <span className="text-sm font-medium">Try It Now!</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Type your request in the box above and watch AI generate Python
                code instantly!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
