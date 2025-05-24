"use client";

import { CodeEditor } from "@/components/code-editor";
import { AIAssistant } from "@/components/ai-assistant";
import { Terminal } from "@/components/terminal";
import { Toolbar } from "@/components/toolbar";
import { useEffect, useState, useRef } from "react";
import type { PyodideInterface } from "@/types/pyodide";

export default function EditorPage() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [assistantWidth, setAssistantWidth] = useState(400);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [code, setCode] = useState(`# Welcome to the Python playground
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# Try writing your own function here
def add(a, b):
    return a + b

print(add(5, 3))

# Example: Working with lists
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Original: {numbers}")
print(f"Squared: {squared}")`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const loadPyodideFromCDN = async () => {
      try {
        setPyodideLoading(true);
        setPyodideError(null);

        // Check if Pyodide is already loaded
        if (window.loadPyodide) {
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
          });
          setPyodide(py);
          setPyodideLoading(false);
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
          } finally {
            setPyodideLoading(false);
          }
        };

        script.onerror = () => {
          console.error("Failed to load Pyodide script");
          setPyodideError("Failed to load Pyodide from CDN");
          setPyodideLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Error setting up Pyodide:", error);
        setPyodideError(
          error instanceof Error ? error.message : "Failed to setup Pyodide"
        );
        setPyodideLoading(false);
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
      setOutput("Pyodide is still loading... Please wait.");
      return;
    }

    if (pyodideError) {
      setOutput(
        `Pyodide Error: ${pyodideError}\nPlease refresh the page to try again.`
      );
      return;
    }

    if (!pyodide) {
      setOutput("Pyodide is not available. Please refresh the page.");
      return;
    }

    setIsRunning(true);
    setOutput("Running...");

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
stdout = sys.stdout
sys.stdout = StringIO()
try:
    exec("""${code.replace(/"/g, '\\"')}""")
    result = sys.stdout.getvalue()
except Exception as e:
    result = f"Error: {e}"
finally:
    sys.stdout = stdout
result`;

      const result = await pyodide.runPythonAsync(wrappedCode);
      setOutput(String(result) || "Code executed successfully (no output)");
    } catch (err: any) {
      console.error("Code execution error:", err);
      setOutput(`Execution Error: ${err.toString()}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(`# Welcome to the Python playground
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# Try writing your own function here`);
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
