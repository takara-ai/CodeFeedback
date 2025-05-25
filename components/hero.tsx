"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  API_ENDPOINTS,
  BAD_PROMPTS,
  GRADIENTS,
  VARIANTS,
  getRandomBadPrompt,
} from "@/lib/constants";
import {
  getContainerClasses,
  getTerminalClasses,
  getTerminalTextClasses,
  getChallengeCardClasses,
  LAYOUT_PATTERNS,
} from "@/lib/ui-utils";
import { StatusIndicator } from "@/components/ui/status-indicator";

export function Hero() {
  const [userPrompt, setUserPrompt] = useState("");
  const [originalBadPrompt, setOriginalBadPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Use constants instead of hardcoded array

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  const loadDailyChallenge = async () => {
    setIsGenerating(true);

    const badPrompt = getRandomBadPrompt();
    setOriginalBadPrompt(badPrompt);
    setUserPrompt(badPrompt);

    try {
      const response = await fetch(API_ENDPOINTS.chat, {
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
    <section className={`${LAYOUT_PATTERNS.heroSection} ${GRADIENTS.hero}`}>
      <div className={LAYOUT_PATTERNS.heroContainer}>
        {/* Header */}
        <div className={LAYOUT_PATTERNS.heroHeader}>
          <h1 className={LAYOUT_PATTERNS.heroTitle}>
            Learn Your
            <span className={GRADIENTS.brand}> Language </span>
            Not Code
          </h1>
          <p className={LAYOUT_PATTERNS.heroSubtitle}>
            The Hottest New Programming Language is English
          </p>
        </div>

        {/* Challenge */}
        <div className={getChallengeCardClasses()}>
          {/* Bad Code */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StatusIndicator status="error" />
              <span className="text-sm">"{originalBadPrompt}" generates:</span>
            </div>
            <div className={getTerminalClasses("max-h-48")}>
              <pre className={getTerminalTextClasses()}>
                {generatedCode || "Loading..."}
              </pre>
            </div>
          </div>

          {/* User Input */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StatusIndicator status="success" />
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
