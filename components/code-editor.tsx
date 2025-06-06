"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { P5Canvas } from "@/components/p5-canvas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  output: string;
  language: string;
  onLanguageChange: (language: string) => void;
  p5Code?: string;
  onP5Error?: (error: string) => void;
  onP5Success?: () => void;
}

export function CodeEditor({
  code,
  setCode,
  output,
  language,
  onLanguageChange,
  p5Code = "",
  onP5Error,
  onP5Success,
}: CodeEditorProps) {

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
              onChange={(value: string | undefined) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
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
            <CardContent className="h-[93%]">
              <div className="w-full h-full bg-white rounded overflow-hidden border" >
                {p5Code ? (
                  <P5Canvas
                    code={p5Code}
                    onError={onP5Error}
                    onSuccess={onP5Success}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-center">
                    <div>
                      <p className="text-lg font-semibold">p5.js Canvas</p>
                      <p className="text-sm mt-2">
                        Click "Run" to execute your code and see the visual output here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
