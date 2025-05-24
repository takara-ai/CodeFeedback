"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, X, Minus, Square } from "lucide-react"
import { useState, useEffect } from "react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface AIAssistantProps {
  width: number
  onWidthChange: (width: number) => void
  onClose: () => void
}

export function AIAssistant({ width, onWidthChange, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your Python coding assistant. I can help you debug code, explain Python concepts, suggest improvements, or answer programming questions. What would you like to work on?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
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

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)

    setInput("")
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("error") || input.includes("bug")) {
      return "I can help you debug! Please share the error message or describe what's not working. Common Python issues include indentation errors, undefined variables, or incorrect function calls."
    } else if (input.includes("function") || input.includes("def")) {
      return "Functions in Python are defined with `def`. Basic syntax: `def function_name(parameters): return value`. Need help with a specific function?"
    } else if (input.includes("loop") || input.includes("for") || input.includes("while")) {
      return "Python has `for` and `while` loops. For example: `for item in list:` or `while condition:`. Also list comprehensions: `[x*2 for x in numbers]`. What kind of loop are you working with?"
    } else if (input.includes("list") || input.includes("array")) {
      return "Python lists are versatile: `my_list = [1, 2, 3]`. Common methods: `append()`, `remove()`, `pop()`. List comprehensions are powerful: `[x**2 for x in range(10)]`. What would you like to do with lists?"
    } else if (input.includes("dict") || input.includes("dictionary")) {
      return "Dictionaries store key-value pairs: `my_dict = {'key': 'value'}`. Access with `my_dict['key']` or `my_dict.get('key')`. Useful methods: `keys()`, `values()`, `items()`."
    } else if (input.includes("import") || input.includes("module")) {
      return "Import modules with `import module_name` or `from module import function`. Popular modules: `math`, `random`, `datetime`, `json`. Need help with a specific module?"
    } else if (input.includes("class") || input.includes("object")) {
      return "Classes in Python: `class MyClass:` with `__init__` method for initialization. Create objects with `obj = MyClass()`. Need help with object-oriented programming?"
    } else {
      return "I'm here to help with your Python code! You can ask me about syntax, debugging, best practices, libraries, or specific programming concepts. What would you like to know?"
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
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "ai" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-muted border"
                  }`}
                >
                  {message.content}
                </div>
                {message.sender === "user" && (
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
