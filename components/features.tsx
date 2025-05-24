"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Brain,
  Lightbulb,
  Shield,
  Users,
  Rocket,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Programming",
    description:
      "Learn to describe what you want to build in plain English and watch AI transform your ideas into working code.",
  },
  {
    icon: Brain,
    title: "Prompt Engineering Mastery",
    description:
      "Master the art of communicating with AI. Learn techniques for crafting precise, effective prompts that get better results.",
  },
  {
    icon: Lightbulb,
    title: "Iterative Development",
    description:
      "Practice the new workflow: describe, review, refine, repeat. Learn to collaborate with AI for rapid prototyping.",
  },
  {
    icon: Shield,
    title: "Safe Learning Environment",
    description:
      "Experiment freely in our sandboxed environment. Make mistakes, learn from them, and build confidence.",
  },
  {
    icon: Users,
    title: "LLM Collaboration Patterns",
    description:
      "Discover proven patterns for working with AI: when to be specific, when to be abstract, and how to guide the conversation.",
  },
  {
    icon: Rocket,
    title: "Future-Ready Skills",
    description:
      "Prepare for tomorrow's job market. Learn skills that will be essential as AI transforms software development.",
  },
];

export function Features() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(features.length).fill(false)
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Master the Language of Tomorrow
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
            Learn to think, communicate, and build with AI. Develop the skills
            that will define the next generation of software creators.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`transform transition-all duration-700 ${
                visibleCards[index]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
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
  );
}
