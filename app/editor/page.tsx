"use client"

import { CodeEditor } from "@/components/code-editor"
import { AIAssistant } from "@/components/ai-assistant"
import { Terminal } from "@/components/terminal"
import { Toolbar } from "@/components/toolbar"
import { useEffect, useState } from "react"

export default function EditorPage() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [assistantWidth, setAssistantWidth] = useState(400)
  const [terminalHeight, setTerminalHeight] = useState(200)
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
print(f"Squared: {squared}")`)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [pyodide, setPyodide] = useState<any>(null);

  
  useEffect(() => {
    const loadPyodideFromCDN = async () => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      script.onload = async () => {
        // @ts-ignore
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
        });
        setPyodide(py);
      };
      document.body.appendChild(script);
    };

    loadPyodideFromCDN();
  }, []);

  const runCode = async () => {
    if (!pyodide) return;
    setIsRunning(true)
    try {
      // load packages here
      await pyodide.loadPackage("numpy");
      await pyodide.loadPackage("matplotlib");
      const wrappedCode = `
import sys
from io import StringIO
stdout = sys.stdout
sys.stdout = StringIO()
try:
    exec(\"\"\"${code}\"\"\")
    result = sys.stdout.getvalue()
finally:
    sys.stdout = stdout
result
    `;
      const result = await pyodide.runPythonAsync(wrappedCode);
      setOutput(String(result));
    } catch (err: any) {
      setOutput(err.toString());
    }finally {
      setIsRunning(false)
    }
  };

  const resetCode = () => {
    setCode(`# Welcome to the Python playground
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# Try writing your own function here`)
    setOutput("")
  }

  const saveCode = () => {
    // Simulate saving
    console.log("Code saved!")
  }

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
          style={{ width: isAssistantOpen ? `calc(100% - ${assistantWidth}px)` : "100%" }}
        >
          {/* Code Editor */}
          <div className="flex-1" style={{ height: isTerminalOpen ? `calc(100% - ${terminalHeight}px)` : "100%" }}>
            <CodeEditor code={code} setCode={setCode} output={output} language="python" />
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
  )
}
