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
    "create music player",
    "make drawing tool",
    "build photo editor",
    "create calendar app",
    "make timer app",
    "build note taker",
    "create habit tracker",
    "make recipe finder",
    "build workout planner",
    "create budget manager",
    "make task scheduler",
    "build inventory system",
    "create booking platform",
    "make survey tool",
    "build dashboard app",
    "create analytics tool",
    "make backup utility",
    "build search engine",
    "create social network",
    "make video player",
    "build text editor",
    "create image gallery",
    "make code formatter",
    "build data visualizer",
    "create form builder",
    "make url shortener",
    "build qr generator",
    "create password manager",
    "make email client",
    "build chat bot",
    "create game engine",
    "make 3d renderer",
    "build api tester",
    "create log analyzer",
    "make file converter",
    "build web scraper",
    "create pdf reader",
    "make audio editor",
    "build video converter",
    "create mind mapper",
    "make color picker",
    "build font manager",
    "create icon generator",
    "make meme creator",
    "build gif maker",
    "create screenshot tool",
    "make screen recorder",
    "build remote desktop",
    "create vpn client",
    "make network monitor",
    "build system cleaner",
    "create disk analyzer",
    "make memory optimizer",
    "build cpu monitor",
    "create battery tracker",
    "make wifi scanner",
    "build bluetooth manager",
    "create device finder",
    "make location tracker",
    "build map navigator",
    "create route planner",
    "make travel guide",
    "build language translator",
    "create voice recorder",
    "make speech synthesizer",
    "build ocr scanner",
    "create barcode reader",
    "make document scanner",
    "build signature pad",
    "create whiteboard app",
    "make presentation tool",
    "build slideshow maker",
    "create animation studio",
    "make video editor",
    "build streaming app",
    "create podcast player",
    "make radio tuner",
    "build music mixer",
    "create beat maker",
    "make synthesizer app",
    "build metronome tool",
    "create tuning app",
    "make chord finder",
    "build scale trainer",
    "create rhythm game",
    "make puzzle solver",
    "build card game",
    "create board game",
    "make trivia app",
    "build word game",
    "create math trainer",
    "make typing tutor",
    "build coding practice",
    "create flashcard app",
    "make study planner",
    "build grade tracker",
    "create course manager",
    "make library system",
    "build book reader",
    "create news aggregator",
    "make rss reader",
    "build blog platform",
    "create cms system",
    "make forum software",
    "build wiki engine",
    "create help desk",
    "make ticket system",
    "build crm tool",
    "create sales tracker",
    "make invoice generator",
    "build payroll system",
    "create timesheet app",
    "make project manager",
    "build kanban board",
    "create gantt chart",
    "make milestone tracker",
    "build resource planner",
    "create team scheduler",
    "make meeting organizer",
    "build video conferencer",
    "create collaboration tool",
    "make file sharer",
    "build cloud storage",
    "create backup service",
    "make sync utility",
    "build version control",
    "create deployment tool",
    "make monitoring system",
    "build alert manager",
    "create log collector",
    "make error tracker",
    "build performance monitor",
    "create load tester",
    "make security scanner",
    "build vulnerability checker",
    "create firewall manager",
    "make antivirus tool",
    "build encryption utility",
    "create hash generator",
    "make random generator",
    "build lottery picker",
    "create dice roller",
    "make coin flipper",
    "build magic 8ball",
    "create fortune teller",
    "make horoscope app",
    "build astrology chart",
    "create tarot reader",
    "make dream journal",
    "build mood tracker",
    "create meditation timer",
    "make breathing guide",
    "build yoga instructor",
    "create fitness tracker",
    "make calorie counter",
    "build water reminder",
    "create sleep tracker",
    "make pill reminder",
    "build health monitor",
    "create symptom tracker",
    "make appointment scheduler",
    "build doctor finder",
    "create pharmacy locator",
    "make recipe calculator",
    "build meal planner",
    "create grocery list",
    "make restaurant finder",
    "build food tracker",
    "create wine cellar",
    "make cocktail mixer",
    "build coffee timer",
    "create tea guide",
    "make cooking timer",
    "build kitchen scale",
    "create unit converter",
    "make currency converter",
    "build tip calculator",
    "create loan calculator",
    "make investment tracker",
    "build stock monitor",
    "create crypto tracker",
    "make trading bot",
    "build portfolio manager",
    "create expense analyzer",
    "make tax calculator",
    "build receipt scanner",
    "create mileage tracker",
    "make fuel calculator",
    "build car maintenance",
    "create parking finder",
    "make traffic monitor",
    "build speed tracker",
    "create gps logger",
    "make compass app",
    "build altitude meter",
    "create weather station",
    "make earthquake monitor",
    "build tide tracker",
    "create moon phase",
    "make star map",
    "build planet tracker",
    "create space news",
    "make satellite tracker",
    "build telescope guide",
    "create bird identifier",
    "make plant finder",
    "build garden planner",
    "create pet tracker",
    "make vet reminder",
    "build animal sounds",
    "create zoo guide",
    "make nature journal",
    "build hiking tracker",
    "create camping guide",
    "make fishing log",
    "build hunting tracker",
    "create outdoor gear",
    "make survival guide",
    "build emergency kit",
    "create first aid",
    "make safety checker",
    "build home security",
    "create smart home",
    "make iot controller",
    "build sensor monitor",
    "create automation hub",
    "make energy tracker",
    "build solar calculator",
    "create carbon tracker",
    "make recycling guide",
    "build eco tracker",
    "create green tips",
    "make sustainability app"
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
