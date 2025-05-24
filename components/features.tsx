"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Code, Zap, Shield, Users, Rocket } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Assistant",
    description: "Get intelligent code suggestions, debugging help, and explanations in real-time.",
  },
  {
    icon: Code,
    title: "Smart Code Editor",
    description: "Syntax highlighting, auto-completion, and error detection for multiple programming languages.",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description: "Run your code instantly and see results in real-time with our fast execution engine.",
  },
  {
    icon: Shield,
    title: "Secure Environment",
    description: "Code safely in our sandboxed environment with enterprise-grade security.",
  },
  {
    icon: Users,
    title: "Collaborative Coding",
    description: "Share your workspace and code together with team members in real-time.",
  },
  {
    icon: Rocket,
    title: "Deploy Anywhere",
    description: "Deploy your projects instantly to the cloud with one-click deployment.",
  },
]

export function Features() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(features.length).fill(false))
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newVisible = [...prev]
              newVisible[index] = true
              return newVisible
            })
          }
        },
        { threshold: 0.1 },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">Everything you need to code better</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
            Our platform combines the best of modern development tools with AI assistance to supercharge your coding
            experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`transform transition-all duration-700 ${
                visibleCards[index] ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-blue-600 group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
