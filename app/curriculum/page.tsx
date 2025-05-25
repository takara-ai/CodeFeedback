"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { NameInputModal } from "@/components/name-input-modal";
import { RefreshCw, Home, Trophy } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface CodeMetrics {
  lines: number;
  functions: number;
  errorHandling: number;
  documentation: number;
  validation: number;
  security: number;
}

interface PromptResult {
  originalCode: string;
  improvedCode: string;
  originalPrompt: string;
  improvedPrompt: string;
  score: number;
  feedback: string;
  before: CodeMetrics;
  after: CodeMetrics;
}

function PromptLab() {
  const [result, setResult] = useState<PromptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const originalPrompt = searchParams.get("originalPrompt");
    const originalCode = searchParams.get("originalCode");
    const userPrompt = searchParams.get("userPrompt");

    if (originalPrompt && originalCode && userPrompt) {
      runAnalysis(originalPrompt, originalCode, userPrompt);
    }
  }, [searchParams]);

  const runAnalysis = async (
    originalPrompt: string,
    originalCode: string,
    userPrompt: string
  ) => {
    setLoading(true);

    try {
      // Generate improved code
      const userCode = await generateCode(userPrompt);

      // Analyze both codes in parallel
      const [originalMetrics, userCodeMetrics] = await Promise.all([
        analyzeCode(originalCode),
        analyzeCode(userCode),
      ]);

      // Calculate score and feedback
      const score = calculateScore(originalMetrics, userCodeMetrics);
      const feedback = generateFeedback(userPrompt, score);

      const resultData = {
        originalCode,
        improvedCode: userCode,
        originalPrompt,
        improvedPrompt: userPrompt,
        score,
        feedback,
        before: originalMetrics,
        after: userCodeMetrics,
      };

      setResult(resultData);

      // Show name modal after a short delay
      setTimeout(() => {
        setShowNameModal(true);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitToLeaderboard = async (name: string) => {
    if (!result) return;

    setIsSubmittingScore(true);
    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          score: result.score,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowNameModal(false);
        // Show success message with score information
        if (data.previousScore > 0) {
          toast({
            title: "Score Added! 🎉",
            description: `Previous: ${data.previousScore}% → Added: ${data.addedScore}% → New Total: ${data.newScore}%`,
          });
        } else {
          toast({
            title: "First Score Submitted! 🚀",
            description: `Your score: ${data.newScore}% - Keep playing to accumulate more points!`,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting to leaderboard:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const analyzeCode = async (code: string): Promise<CodeMetrics> => {
    try {
      const response = await fetch("/api/chat-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Count code metrics. Return ONLY JSON:
${code}

{
  "lines": ${code.split("\n").filter((line) => line.trim()).length},
  "functions": 2,
  "errorHandling": 1,
  "documentation": 0,
  "validation": 0,
  "security": 0
}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const content = data.content
        .replace(/```json\n?|\n?```/g, "")
        .replace(/^[^{]*/, "")
        .replace(/[^}]*$/, "");
      return JSON.parse(content);
    } catch {
      return {
        lines: code.split("\n").filter((line) => line.trim()).length,
        functions: (code.match(/def |class /g) || []).length,
        errorHandling: (code.match(/try:|except|if.*error/gi) || []).length,
        documentation: (code.match(/"""|'''|#/g) || []).length,
        validation: (code.match(/validate|check|isinstance/gi) || []).length,
        security: (code.match(/auth|hash|encrypt/gi) || []).length,
      };
    }
  };

  const generateCode = async (prompt: string): Promise<string> => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Generate ONLY Python code for: ${prompt}

RULES:
- Return ONLY executable Python code
- NO markdown, NO explanations, NO comments
- Clean, functional code only

Example output:
def calculate():
    return 2 + 2
print(calculate())`,
          },
        ],
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let code = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) code += parsed.content;
            } catch {}
          }
        }
      }
    }

    return code
      .replace(/^```python\s*/i, "")
      .replace(/^```\s*/gm, "")
      .replace(/\s*```\s*$/g, "")
      .replace(/^Here.*?code.*?:/gim, "")
      .replace(/^Below.*?code.*?:/gim, "")
      .trim();
  };

  const calculateScore = (before: CodeMetrics, after: CodeMetrics): number => {
    const beforeScore =
      before.functions +
      before.errorHandling +
      before.documentation +
      before.validation +
      before.security;
    const afterScore =
      after.functions +
      after.errorHandling +
      after.documentation +
      after.validation +
      after.security;
    return Math.round(
      ((afterScore - beforeScore) / Math.max(beforeScore, 1)) * 100
    );
  };

  const generateFeedback = (userPrompt: string, score: number): string => {
    const hints = [];

    if (!userPrompt.includes("error") && !userPrompt.includes("validation"))
      hints.push("Add errors");
    if (!userPrompt.includes("document") && !userPrompt.includes("comment"))
      hints.push("Want docs");
    if (!userPrompt.includes("security") && !userPrompt.includes("validate"))
      hints.push("Add security");
    if (!userPrompt.includes("specific") && !userPrompt.includes("detail"))
      hints.push("Be specific");

    if (score > 100) return "Perfect!";
    if (score > 50) return `✨ Good! Try: ${hints.slice(0, 2).join(", ")}`;
    if (score > 0) return `💪 Better! Add: ${hints.slice(0, 2).join(", ")}`;
    return `🎯 Try: ${hints.slice(0, 2).join(", ")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Analyzing...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">No data</p>
          <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const beforeScore =
    result.before.functions +
    result.before.errorHandling +
    result.before.security;
  const afterScore =
    result.after.functions + result.after.errorHandling + result.after.security;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Results */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {result.score > 100
              ? "🏆"
              : result.score > 50
              ? "✨"
              : result.score > 0
              ? "💪"
              : "🎯"}
          </div>
          <h1 className="text-2xl font-bold mb-2">{result.feedback}</h1>
          <div className="flex items-center justify-center gap-4 text-lg">
            <span className="text-red-600 font-mono">{beforeScore}</span>
            <span>→</span>
            <span className="text-green-600 font-mono">{afterScore}</span>
            <span className="text-purple-600 font-mono">
              ({result.score > 0 ? "+" : ""}
              {result.score}%)
            </span>
          </div>
        </div>

        {/* Code Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">"{result.originalPrompt}"</span>
            </div>
            <div className="bg-gray-900 rounded p-3 text-xs font-mono max-h-48 overflow-auto">
              <pre className="text-red-400 whitespace-pre-wrap break-words">
                {result.originalCode}
              </pre>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">"{result.improvedPrompt}"</span>
            </div>
            <div className="bg-gray-900 rounded p-3 text-xs font-mono max-h-48 overflow-auto">
              <pre className="text-green-400 whitespace-pre-wrap break-words">
                {result.improvedCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/leaderboard">
              <Trophy className="w-4 h-4 mr-1" />
              Leaderboard
            </Link>
          </Button>
          <Button onClick={() => (window.location.href = "/")}>
            <Home className="w-4 h-4 mr-1" />
            Next Challenge
          </Button>
        </div>
      </div>

      {/* Name Input Modal */}
      <NameInputModal
        isOpen={showNameModal}
        score={result.score}
        onSubmit={submitToLeaderboard}
        onSkip={() => setShowNameModal(false)}
        isSubmitting={isSubmittingScore}
      />
    </div>
  );
}

export default function PromptLabPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Suspense fallback={<div>Loading...</div>}>
        <PromptLab />
      </Suspense>
    </ThemeProvider>
  );
}
