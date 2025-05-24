"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Minus, Square } from "lucide-react"
import { useState, useEffect } from "react"

interface TerminalProps {
  height: number
  onHeightChange: (height: number) => void
  onClose: () => void
  output?: string
}

export function Terminal({ height, onHeightChange, onClose, output }: TerminalProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState([
    "Python 3.11.0 (main, Oct 24 2022, 18:26:48) [MSC v.1933 64 bit (AMD64)] on win32",
    "Type 'help' for more information.",
    "",
  ])

  useEffect(() => {
    if (output) {
      setTerminalOutput((prev) => [...prev, `>>> Running main.py`, output, ""])
    }
  }, [output])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newHeight = window.innerHeight - e.clientY
      if (newHeight >= 100 && newHeight <= 500) {
        onHeightChange(newHeight)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, onHeightChange])

  return (
    <div className="border-t bg-background" style={{ height: `${height}px` }}>
      {/* Resize Handle */}
      <div
        className="h-1 bg-border hover:bg-blue-500 cursor-row-resize transition-colors"
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Terminal Header */}
      <div className="border-b px-3 py-1 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Terminal</span>
            <span className="text-xs text-muted-foreground">Python Console</span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Minus className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Square className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <ScrollArea className="flex-1" style={{ height: `${height - 40}px` }}>
        <div className="p-3 font-mono text-sm">
          <div className="space-y-1">
            {terminalOutput.map((line, index) => (
              <div key={index} className="text-green-400">
                {line && !line.startsWith(">>>") && <span className="text-blue-400">&gt;&gt;&gt; </span>}
                {line}
              </div>
            ))}
            <div className="flex items-center text-green-400">
              <span className="text-blue-400">&gt;&gt;&gt; </span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
