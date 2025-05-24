"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface CodeEditorProps {
  code: string
  setCode: (code: string) => void
  output: string
  language?: string
}

export function CodeEditor({ code, setCode, output, language = "python" }: CodeEditorProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Code Editor */}
      <div className="flex-1 p-4">
        <div className="h-full border rounded-lg overflow-hidden">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none"
            placeholder={`Write your ${language} code here...`}
          />
        </div>
      </div>

      {/* Output Panel */}
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
  )
}
