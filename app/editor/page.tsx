"use client";

import { CodeEditor } from "@/components/code-editor";
import { AIAssistant } from "@/components/ai-assistant";
import { Terminal } from "@/components/terminal";
import { Toolbar } from "@/components/toolbar";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function EditorPage() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [assistantWidth, setAssistantWidth] = useState(400);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const searchParams = useSearchParams();

  const defaultCode = `# Welcome to Natural Language Programming! 🚀
# 
# This is where your AI-generated code will appear.
# To get started:
# 
# 1. Open the AI Assistant panel (→) 
# 2. Describe what you want to build in plain English
# 3. Watch the AI create code for you!
#
# Example prompts to try:
# • "Create a function that checks if a number is prime"
# • "Build a simple calculator with basic operations"  
# • "Generate a list of fibonacci numbers up to 100"
# • "Create a password generator with custom options"
#
# The future of programming is conversational. Let's learn together!

print("Ready to build with language! Open the AI Assistant to start →")`;

  useEffect(() => {
    // Check if there's code passed from the landing page
    const generatedCode = searchParams.get("code");
    if (generatedCode) {
      try {
        const decodedCode = decodeURIComponent(generatedCode);
        setCode(decodedCode);
      } catch (error) {
        console.error("Error decoding code from URL:", error);
        setCode(defaultCode);
      }
    } else {
      setCode(defaultCode);
    }
  }, [searchParams]);

  const runCode = async () => {
    setIsRunning(true);
    try {
      // Simple Python code execution simulation
      // In a real implementation, you'd send this to a Python backend
      const lines = code.split("\n");
      const outputs: string[] = [];

      // Check for the welcome message
      if (
        code.includes(
          'print("Ready to build with language! Open the AI Assistant to start →")'
        )
      ) {
        outputs.push(
          "Ready to build with language! Open the AI Assistant to start →"
        );
      }

      // Simulate some basic Python execution
      if (code.includes('print(greet("World"))')) {
        outputs.push("Hello, World!");
      }
      if (code.includes("print(add(5, 3))")) {
        outputs.push("8");
      }
      if (code.includes('print(f"Original: {numbers}")')) {
        outputs.push("Original: [1, 2, 3, 4, 5]");
      }
      if (code.includes('print(f"Squared: {squared}")')) {
        outputs.push("Squared: [1, 4, 9, 16, 25]");
      }

      // Look for other print statements
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (
          trimmed.startsWith("print(") &&
          !outputs.some((o) => line.includes(o))
        ) {
          // Simple evaluation for basic print statements
          if (trimmed.includes('"') || trimmed.includes("'")) {
            const match = trimmed.match(/print$$["'](.+?)["']$$/);
            if (match) outputs.push(match[1]);
          }
        }
      });

      setOutput(outputs.join("\n") || "Code executed successfully!");
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(defaultCode);
    setOutput("");
  };

  const saveCode = () => {
    // Simulate saving
    console.log("Code saved!");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Toolbar */}
      <Toolbar
        onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        onRunCode={runCode}
        onResetCode={resetCode}
        onSaveCode={saveCode}
        isAssistantOpen={isAssistantOpen}
        isTerminalOpen={isTerminalOpen}
        isRunning={isRunning}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor Area */}
        <div
          className="flex flex-col flex-1"
          style={{
            width: isAssistantOpen
              ? `calc(100% - ${assistantWidth}px)`
              : "100%",
          }}
        >
          {/* Code Editor */}
          <div
            className="flex-1"
            style={{
              height: isTerminalOpen
                ? `calc(100% - ${terminalHeight}px)`
                : "100%",
            }}
          >
            <CodeEditor
              code={code}
              setCode={setCode}
              output={output}
              language="python"
            />
          </div>

          {/* Terminal Panel */}
          {isTerminalOpen && (
            <Terminal
              height={terminalHeight}
              onHeightChange={setTerminalHeight}
              onClose={() => setIsTerminalOpen(false)}
              output={output}
            />
          )}
        </div>

        {/* AI Assistant Panel */}
        {isAssistantOpen && (
          <AIAssistant
            width={assistantWidth}
            onWidthChange={setAssistantWidth}
            onClose={() => setIsAssistantOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
