"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  output: string;
  language: string;
  onLanguageChange: (language: string) => void;
  onSketchReady?: (sketch: any) => void;
}

export function CodeEditor({
  code,
  setCode,
  output,
  language,
  onLanguageChange,
  onSketchReady,
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<any>(null);

  useEffect(() => {
    // Only clean up when switching away from JavaScript
    if (language === "python" && sketchRef.current) {
      sketchRef.current.remove();
      sketchRef.current = null;
    }

    // Don't create a default sketch - let the run function handle it
    if (language === "javascript") {
      if (onSketchReady) {
        // Signal that we're ready for sketch creation, but don't create one yet
        onSketchReady(null as any);
      }
    }

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
        sketchRef.current = null;
      }
    };
  }, [language, onSketchReady]);

  return (
    <div className="flex h-full">
      {/* Left side - Code Editor */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Language Selector */}
        <div className="p-4 border-b">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">p5.js</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-4 min-h-0">
          <div className="h-full border rounded-lg overflow-hidden">
            <Editor
              className="h-full"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>
        </div>

        {/* Console Output */}
        {output && (
          <div className="border-t p-4 bg-muted/20">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Console Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-black text-green-400 p-3 rounded font-mono overflow-auto max-h-32">
                  {output}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Right side - p5.js Canvas (only shown for JavaScript) */}
      {language === "javascript" && (
        <div className="w-1/2 border-l p-4 bg-muted/20">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                p5.js Visual Output
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div 
                ref={containerRef} 
                className="w-full h-full bg-white rounded overflow-hidden flex items-center justify-center border"
                style={{ minHeight: "500px" }}
                data-p5-canvas-container
              >
                <div className="text-gray-500 text-center">
                  <p className="text-lg font-semibold">p5.js Canvas</p>
                  <p className="text-sm mt-2">Click "Run" to execute your code and see the visual output here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
