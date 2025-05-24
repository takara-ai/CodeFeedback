"use client";

import { CodeEditor } from "@/components/code-editor";
import { AIAssistant } from "@/components/ai-assistant";
import { Terminal } from "@/components/terminal";
import { Toolbar } from "@/components/toolbar";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { PyodideInterface } from "@/types/pyodide";

const DEFAULT_PYTHON_CODE = `# Welcome to Natural Language Programming! 🚀
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

const DEFAULT_P5JS_CODE = `
// Welcome to Visual Coding! 🎨

background(50, 50, 50);

for (let i = 0; i < 20; i++) {
  fill(random(100, 255), random(100, 255), random(100, 255));
  circle(random(0, width), random(0, height), random(20, 80));
}

fill(255, 255, 255);
text("Visual output works! 🎉", 50, 50);
`;

function EditorContent() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [assistantWidth, setAssistantWidth] = useState(400);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [p5Instance, setP5Instance] = useState<any>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const sketchRef = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const searchParams = useSearchParams();

  // Simple p5.js loading
  useEffect(() => {
    if (language === "javascript" && !p5Instance) {
      // Try to load p5.js with a simple approach
      const loadP5 = () => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js";
        script.onload = () => {
          setTimeout(() => {
            if ((window as any).p5) {
              setP5Instance((window as any).p5);
              setCanvasReady(true);
              setOutput("✅ p5.js ready! Click 'Run' to see your visual output.");
            } else {
              // Fallback: create a basic canvas system
              setCanvasReady(true);
              setOutput("⚠️ Using fallback canvas. Click 'Run' to see basic graphics.");
            }
          }, 500);
        };
        script.onerror = () => {
          // Use fallback canvas system
          setCanvasReady(true);
          setOutput("⚠️ Using fallback canvas. Click 'Run' to see basic graphics.");
        };
        document.head.appendChild(script);
      };

      loadP5();
    }
  }, [language]);

  // Initialize code from URL params or default
  useEffect(() => {
    const generatedCode = searchParams.get("code");
    if (generatedCode) {
      try {
        const decodedCode = decodeURIComponent(generatedCode);
        setCode(decodedCode);
        setOutput("Code loaded! Click 'Run' to execute your code.");
      } catch (error) {
        console.error("Error decoding code from URL:", error);
        setCode(language === "python" ? DEFAULT_PYTHON_CODE : DEFAULT_P5JS_CODE);
      }
    } else {
      setCode(language === "python" ? DEFAULT_PYTHON_CODE : DEFAULT_P5JS_CODE);
    }
  }, [searchParams, language]);

  // Update code when language changes
  useEffect(() => {
    if (!searchParams.get("code")) {
      setCode(language === "python" ? DEFAULT_PYTHON_CODE : DEFAULT_P5JS_CODE);
    }
    
    // Update output message based on language
    if (language === "python") {
      setOutput(pyodide ? "Python environment ready! You can now run your code." : "Loading Python environment...");
    } else {
      setOutput(canvasReady ? "Canvas ready! Click 'Run' to see your visual output." : "Loading canvas...");
    }
  }, [language, pyodide, canvasReady, searchParams]);

  // Load Pyodide only when Python is selected
  useEffect(() => {
    if (language === "python" && !pyodide && !pyodideLoading && !pyodideError) {
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
    }

    // Cleanup function
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [language, pyodide, pyodideLoading, pyodideError]);

  const runCode = async () => {
    if (language === "javascript") {
      setIsRunning(true);
      
      try {
        // Get the canvas container
        const container = document.querySelector('[data-p5-canvas-container]') as HTMLElement;
        if (!container) {
          setOutput("❌ Canvas container not found.");
          setIsRunning(false);
          return;
        }

        // Clear container
        container.innerHTML = '';

        if (p5Instance) {
          // Use p5.js if available
          try {
            new p5Instance((p: any) => {
              // Create a sandbox for user code
              const userCode = `
                ${code}
              `;
              
              // Execute the user code
              const func = new Function('p', 'with(p) { ' + userCode + ' }');
              func.call(p, p);
              
              // Ensure we have a canvas
              if (!p.canvas) {
                p.setup = p.setup || (() => {
                  p.createCanvas(800, 600);
                  p.background(240);
                });
                p.setup();
              }
              
              // Parent the canvas to our container
              if (p.canvas) {
                container.appendChild(p.canvas);
              }
            });
            
            setOutput("✅ p5.js code executed! Visual output should appear on the right.");
          } catch (error) {
            console.error("p5.js error:", error);
            setOutput(`❌ p5.js Error: ${error instanceof Error ? error.message : String(error)}`);
          }
        } else {
          // Fallback: Use native canvas
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 600;
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.border = '1px solid #ccc';
          container.appendChild(canvas);
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Clear canvas
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Create basic drawing functions
            const drawingAPI = {
              canvas,
              ctx,
              width: canvas.width,
              height: canvas.height,
              
              background(r: number, g?: number, b?: number) {
                if (g === undefined) {
                  ctx.fillStyle = `rgb(${r}, ${r}, ${r})`;
                } else {
                  ctx.fillStyle = `rgb(${r}, ${g || 0}, ${b || 0})`;
                }
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              },
              
              fill(r: number, g?: number, b?: number) {
                if (g === undefined) {
                  ctx.fillStyle = `rgb(${r}, ${r}, ${r})`;
                } else {
                  ctx.fillStyle = `rgb(${r}, ${g || 0}, ${b || 0})`;
                }
              },
              
              circle(x: number, y: number, diameter: number) {
                ctx.beginPath();
                ctx.arc(x, y, diameter / 2, 0, Math.PI * 2);
                ctx.fill();
              },
              
              rect(x: number, y: number, width: number, height: number) {
                ctx.fillRect(x, y, width, height);
              },
              
              text(str: string, x: number, y: number) {
                ctx.fillText(str, x, y);
              },
              
              random(min?: number, max?: number) {
                if (min === undefined) return Math.random();
                if (max === undefined) return Math.random() * min;
                return Math.random() * (max - min) + min;
              }
            };
            
            try {
              // Execute user code with drawing API
              const func = new Function('canvas', 'ctx', 'width', 'height', 'background', 'fill', 'circle', 'rect', 'text', 'random', code);
              func.call(drawingAPI, canvas, ctx, canvas.width, canvas.height, 
                       drawingAPI.background, drawingAPI.fill, drawingAPI.circle, 
                       drawingAPI.rect, drawingAPI.text, drawingAPI.random);
              
              setOutput("✅ Canvas code executed! Visual output should appear on the right.");
            } catch (error) {
              console.error("Canvas error:", error);
              // Show error on canvas
              ctx.fillStyle = '#ff0000';
              ctx.font = '16px Arial';
              ctx.fillText('Error in code:', 10, 30);
              ctx.fillText(error instanceof Error ? error.message : String(error), 10, 50);
              setOutput(`❌ Canvas Error: ${error instanceof Error ? error.message : String(error)}`);
            }
          }
        }
      } catch (error) {
        console.error("General error:", error);
        setOutput(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsRunning(false);
      }
    } else {
      // Python execution
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
      setOutput("🚀 Running your Python code...");

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
          setOutput("✅ Python code executed successfully! (No output produced)");
        }
      } catch (err: any) {
        console.error("Code execution error:", err);
        setOutput(`❌ Python Execution Error: ${err.toString()}`);
      } finally {
        setIsRunning(false);
      }
    }
  };

  const resetCode = () => {
    setCode(language === "python" ? DEFAULT_PYTHON_CODE : DEFAULT_P5JS_CODE);
    setOutput(
      language === "python"
        ? (pyodide ? "Python environment ready! You can now run your code." : "Loading Python environment...")
        : "Canvas ready! Click 'Run' to see your visual output."
    );
  };

  const saveCode = () => {
    // Create a downloadable file
    const element = document.createElement("a");
    const file = new Blob([code], { 
      type: language === "python" ? "text/plain" : "text/javascript" 
    });
    element.href = URL.createObjectURL(file);
    element.download = language === "python" ? "main.py" : "sketch.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Show success message
    setOutput(`💾 Code saved as ${language === "python" ? "main.py" : "sketch.js"}!`);
  };

  const handleSketchReady = (sketch: any) => {
    // This is called when the canvas container is ready
    setOutput("Canvas ready! Click 'Run' to see your visual output.");
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
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
              language={language}
              onLanguageChange={handleLanguageChange}
              onSketchReady={handleSketchReady}
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
