"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, X, Minus, Square } from "lucide-react"
import { useState, useEffect } from "react"
import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});
interface Message {
  role: string
  content: string
}

interface AIAssistantProps {
  width: number
  onWidthChange: (width: number) => void
  onClose: () => void
}

export function AIAssistant({ width, onWidthChange, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= 300 && newWidth <= 800) {
        onWidthChange(newWidth)
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
  }, [isResizing, onWidthChange])

  // Message updating logic.
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input
    }
    setMessages((prev) => [...prev, userMessage])

    // AI response
    const aiMessage: Message = {
      role: "assistant",
      content: await getAIResponse(messages)
    }
    setMessages((prev) => [...prev, aiMessage])
  
    setInput("")
  }

  // AI response generation
  async function getAIResponse(input: Message[]): Promise<string> {
    try {
      const response = await client.agents.complete({
        agentId: "ag:e30aa3a7:20250524:code-feedback:78ecd4aa",
        messages: input as any,
      });
      return response.choices?.[0]?.message?.content as string ?? "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error:", error);
      return "Sorry, I couldn't generate a response.";
    }
  }

  return (
    <div className="flex border-l bg-background" style={{ width: `${width}px` }}>
      {/* Resize Handle */}
      <div
        className="w-1 bg-border hover:bg-blue-500 cursor-col-resize transition-colors"
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Assistant Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-3 py-1 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Python AI Assistant</span>
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

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={crypto.randomUUID()}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-muted border"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gray-100">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-3 bg-muted/20">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your Python code..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
