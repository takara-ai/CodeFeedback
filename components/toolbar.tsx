"use client";

import { Button } from "@/components/ui/button";
import {
  Bot,
  TerminalIcon,
  Play,
  Save,
  RotateCcw,
  ArrowLeft,
  Code,
} from "lucide-react";
import Link from "next/link";

interface ToolbarProps {
  onToggleAssistant: () => void;
  onToggleTerminal: () => void;
  onRunCode: () => void;
  onResetCode: () => void;
  onSaveCode: () => void;
  isAssistantOpen: boolean;
  isTerminalOpen: boolean;
  isRunning?: boolean;
  pyodideLoading?: boolean;
  pyodideError?: string | null;
}

export function Toolbar({
  onToggleAssistant,
  onToggleTerminal,
  onRunCode,
  onResetCode,
  onSaveCode,
  isAssistantOpen,
  isTerminalOpen,
  isRunning = false,
  pyodideLoading = false,
  pyodideError = null,
}: ToolbarProps) {
  return (
    <div className="border-b bg-background px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - Navigation and file info */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:scale-105 transition-transform duration-300"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-600" />
            <h1 className="text-sm font-medium text-muted-foreground">
              main.py
            </h1>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span className="text-xs text-muted-foreground">Python</span>
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-1">
          {/* Code actions */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            onClick={onResetCode}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            onClick={onSaveCode}
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            onClick={onRunCode}
            disabled={isRunning || pyodideLoading || !!pyodideError}
            title={
              pyodideLoading
                ? "Loading Python environment..."
                : pyodideError
                ? "Python environment error - refresh page"
                : isRunning
                ? "Code is running..."
                : "Run Python code"
            }
          >
            <Play className="w-4 h-4" />
            {pyodideLoading ? "Loading..." : isRunning ? "Running..." : "Run"}
          </Button>

          {/* Separator */}
          <div className="w-px h-4 bg-border mx-1"></div>

          {/* Panel toggles */}
          <Button
            size="sm"
            variant="ghost"
            className={`h-8 px-2 ${isTerminalOpen ? "bg-muted" : ""}`}
            onClick={onToggleTerminal}
            title="Toggle Terminal"
          >
            <TerminalIcon className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={`h-8 px-2 ${isAssistantOpen ? "bg-muted" : ""}`}
            onClick={onToggleAssistant}
            title="Toggle AI Assistant"
          >
            <Bot className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
