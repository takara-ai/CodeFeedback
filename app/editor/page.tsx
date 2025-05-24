"use client";

import { CodeEditor } from "@/components/code-editor";
import { AIAssistant } from "@/components/ai-assistant";
import { Terminal } from "@/components/terminal";
import { Toolbar } from "@/components/toolbar";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { PyodideInterface } from "@/types/pyodide";

function EditorContent() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [assistantWidth, setAssistantWidth] = useState(400);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

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

  // Initialize code from URL params or default
  useEffect(() => {
    const generatedCode = searchParams.get("code");
    if (generatedCode) {
      try {
        const decodedCode = decodeURIComponent(generatedCode);
        setCode(decodedCode);
        // Set a welcome message in output when code is loaded from URL
        setOutput("Code loaded! Click 'Run' to execute your Python code.");
      } catch (error) {
        console.error("Error decoding code from URL:", error);
        setCode(defaultCode);
      }
    } else {
      setCode(defaultCode);
    }
  }, [searchParams, defaultCode]);

  // Load Pyodide
  useEffect(() => {
    const loadPyodideFromCDN = async () => {
      try {
        setPyodideLoading(true);
        setPyodideError(null);
        setOutput("Loading Python environment...");

        // Check if Pyodide is already loaded
        if (window.loadPyodide) {
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
          });
          setPyodide(py);
          setPyodideLoading(false);
          setOutput("Python environment ready! You can now run your code.");
          return;
        }

        // Create and load the script
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.async = true;
        scriptRef.current = script;

        script.onload = async () => {
          try {
            if (window.loadPyodide) {
              const py = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
              });
              setPyodide(py);
              setOutput("Python environment ready! You can now run your code.");
            } else {
              throw new Error("Pyodide failed to load properly");
            }
          } catch (error) {
            console.error("Error initializing Pyodide:", error);
            setPyodideError(
              error instanceof Error
                ? error.message
                : "Failed to initialize Pyodide"
            );
            setOutput(
              "❌ Failed to load Python environment. Please refresh the page to try again."
            );
          } finally {
            setPyodideLoading(false);
          }
        };

        script.onerror = () => {
          console.error("Failed to load Pyodide script");
          setPyodideError("Failed to load Pyodide from CDN");
          setPyodideLoading(false);
          setOutput(
            "❌ Failed to load Python environment from CDN. Please check your internet connection and refresh the page."
          );
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Error setting up Pyodide:", error);
        setPyodideError(
          error instanceof Error ? error.message : "Failed to setup Pyodide"
        );
        setPyodideLoading(false);
        setOutput(
          "❌ Error setting up Python environment. Please refresh the page to try again."
        );
      }
    };

    loadPyodideFromCDN();

    // Cleanup function
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);

  const runCode = async () => {
    if (pyodideLoading) {
      setOutput("⏳ Python environment is still loading... Please wait.");
      return;
    }

    if (pyodideError) {
      setOutput(
        `❌ Python environment error: ${pyodideError}\nPlease refresh the page to try again.`
      );
      return;
    }

    if (!pyodide) {
      setOutput(
        "❌ Python environment is not available. Please refresh the page."
      );
      return;
    }

    setIsRunning(true);
    setOutput("🚀 Running your code...");

    try {
      // Load packages with error handling
      try {
        await pyodide.loadPackage(["numpy", "matplotlib"]);
      } catch (packageError) {
        console.warn("Some packages failed to load:", packageError);
        // Continue execution even if packages fail to load
      }

      const wrappedCode = `
import sys
from io import StringIO
import traceback

# Capture stdout
stdout = sys.stdout
sys.stdout = StringIO()

try:
    exec("""${code.replace(/"/g, '\\"').replace(/\n/g, "\\n")}""")
    result = sys.stdout.getvalue()
except Exception as e:
    # Get full traceback for better error reporting
    import traceback
    result = f"Error: {str(e)}\\n\\nTraceback:\\n{traceback.format_exc()}"
finally:
    sys.stdout = stdout

result`;

      const result = await pyodide.runPythonAsync(wrappedCode);
      const output = String(result);

      if (output.trim()) {
        setOutput(output);
      } else {
        setOutput("✅ Code executed successfully! (No output produced)");
      }
    } catch (err: any) {
      console.error("Code execution error:", err);
      setOutput(`❌ Execution Error: ${err.toString()}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(defaultCode);
    setOutput(
      pyodide
        ? "Python environment ready! You can now run your code."
        : "Loading Python environment..."
    );
  };

  const saveCode = () => {
    // Create a downloadable file
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "main.py";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Show success message
    setOutput("💾 Code saved as main.py!");
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
        pyodideLoading={pyodideLoading}
        pyodideError={pyodideError}
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

// Loading component for Suspense fallback
function EditorLoading() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b bg-background px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 bg-gray-50 animate-pulse"></div>
        <div className="w-96 bg-gray-100 animate-pulse"></div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <EditorContent />
    </Suspense>
  );
}
