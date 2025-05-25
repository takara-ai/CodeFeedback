"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";

export function Hero() {
  const [userPrompt, setUserPrompt] = useState("");
  const [originalBadPrompt, setOriginalBadPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const badPrompts = [
    "make chat app",
    "build calculator",
    "create todo list",
    "make password thing",
    "build file manager",
    "create expense tracker",
    "make weather app",
    "build quiz game",
  ];

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  const loadDailyChallenge = async () => {
    setIsGenerating(true);

    const badPrompt = badPrompts[Math.floor(Math.random() * badPrompts.length)];
    setOriginalBadPrompt(badPrompt);
    setUserPrompt(badPrompt);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate ONLY Python code for: ${badPrompt}. 
            
RULES:
- Return ONLY executable Python code
- NO markdown, NO explanations, NO comments
- Max 10 lines
- Basic implementation only

Example output format:
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
                if (parsed.content) {
                  code += parsed.content;
                  setGeneratedCode(cleanCodeBlock(code));
                }
              } catch {}
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanCodeBlock = (code: string): string => {
    return code
      .replace(/^```python\s*/i, "")
      .replace(/^```\s*/gm, "")
      .replace(/\s*```\s*$/g, "")
      .replace(/^Here.*?code.*?:/gim, "")
      .replace(/^Below.*?code.*?:/gim, "")
      .replace(/^This.*?code.*?:/gim, "")
      .trim();
  };

  return (
    <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Learn Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Language{" "}
            </span>
            Not Code
          </h1>
          <p className="text-lg text-muted-foreground">
            The Hottest New Programming Language is English
          </p>
        </div>

        {/* Challenge */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6 space-y-6">
          {/* Bad Code */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">"{originalBadPrompt}" generates:</span>
            </div>
            <div className="border rounded-lg overflow-hidden h-64">
              <Editor
                height="100%"
                defaultLanguage="python"
                language="python"
                theme="vs-dark"
                value={generatedCode || "# Loading..."}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: "on",
                  folding: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>

          {/* User Input */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Improve this prompt:</span>
            </div>

            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Make it more specific..."
              className="resize-none h-16 mb-4"
              disabled={isGenerating}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={loadDailyChallenge}
                disabled={isGenerating}
                size="sm"
                className="flex-1"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${
                    isGenerating ? "animate-spin" : ""
                  }`}
                />
                New
              </Button>

              <Button
                asChild
                disabled={
                  !userPrompt.trim() || userPrompt === originalBadPrompt
                }
                size="sm"
                className="flex-1"
              >
                <Link
                  href={`/curriculum?originalPrompt=${encodeURIComponent(
                    originalBadPrompt
                  )}&originalCode=${encodeURIComponent(
                    generatedCode
                  )}&userPrompt=${encodeURIComponent(userPrompt)}`}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Test
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
