"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Badge */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2 hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 mr-2 animate-spin-slow" />
            AI-Powered Python Editor
          </Badge>
        </div>

        {/* Headline */}
        <div
          className={`transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Code Python with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              {" "}
              AI{" "}
            </span>
            by your side
          </h1>
        </div>

        {/* Subheadline */}
        <div
          className={`transform transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of Python coding with our intelligent editor. Get real-time assistance, debug faster,
            and learn as you code with our AI-powered platform.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto group hover:scale-105 transition-all duration-300 hover:shadow-lg"
              asChild
            >
              <Link href="/editor">
                Start Coding Python
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 h-auto group hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div
          className={`relative max-w-5xl mx-auto transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border overflow-hidden hover:shadow-3xl transition-shadow duration-500 group">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full group-hover:animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full group-hover:animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full group-hover:animate-pulse delay-200"></div>
              </div>
              <span className="text-sm text-muted-foreground ml-4">main.py</span>
            </div>
            <div className="p-6 text-left">
              <pre className="text-sm">
                <code className="text-blue-600">def</code> <code className="text-purple-600">fibonacci</code>
                <code className="text-gray-600">(n):</code>
                {"\n"}
                <code className="text-gray-500"> # AI suggests: Use memoization for better performance</code>
                {"\n"}
                <code className="text-blue-600"> if</code> <code className="text-gray-600">n &lt;= 1:</code>
                {"\n"}
                <code className="text-blue-600"> return</code> <code className="text-gray-600">n</code>
                {"\n"}
                <code className="text-blue-600"> return</code> <code className="text-purple-600">fibonacci</code>
                <code className="text-gray-600">(n-1) + </code>
                <code className="text-purple-600">fibonacci</code>
                <code className="text-gray-600">(n-2)</code>
                {"\n"}
                {"\n"}
                <code className="text-purple-600">print</code>
                <code className="text-gray-600">(</code>
                <code className="text-purple-600">fibonacci</code>
                <code className="text-gray-600">(10))</code>
              </pre>
            </div>
          </div>

          {/* Floating AI Assistant Preview */}
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 max-w-xs hidden lg:block animate-float">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />
              </div>
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <p className="text-xs text-muted-foreground">
              "I notice you're implementing Fibonacci recursively. Would you like me to show you a more efficient
              approach using dynamic programming?"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
