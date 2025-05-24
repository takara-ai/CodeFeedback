"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Target,
  Zap,
  Clock,
  Users,
  Star,
  CheckCircle,
  Play,
  Lock,
} from "lucide-react";
import Link from "next/link";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  color: string;
  skills: string[];
  completed?: boolean;
  progress?: number;
}

const learningPaths: LearningPath[] = [
  {
    id: "foundations",
    title: "Prompt Engineering Foundations",
    description:
      "Master the basics of crafting effective AI prompts. Learn core principles and techniques.",
    level: "Beginner",
    duration: "2 hours",
    lessons: 8,
    students: 1234,
    rating: 4.8,
    color: "bg-green-500",
    skills: [
      "Basic prompting",
      "Context setting",
      "Clear instructions",
      "Output formatting",
    ],
    progress: 75,
  },
  {
    id: "advanced-techniques",
    title: "Advanced Prompting Techniques",
    description:
      "Dive deep into sophisticated strategies like chain-of-thought, few-shot learning, and prompt chaining.",
    level: "Intermediate",
    duration: "3 hours",
    lessons: 12,
    students: 892,
    rating: 4.9,
    color: "bg-blue-500",
    skills: [
      "Chain-of-thought",
      "Few-shot learning",
      "Prompt chaining",
      "Role playing",
    ],
    progress: 30,
  },
  {
    id: "code-generation",
    title: "Code Generation Mastery",
    description:
      "Specialized techniques for generating high-quality code across different programming languages.",
    level: "Intermediate",
    duration: "4 hours",
    lessons: 15,
    students: 567,
    rating: 4.7,
    color: "bg-purple-500",
    skills: [
      "Code prompting",
      "Debugging prompts",
      "Architecture design",
      "Testing generation",
    ],
  },
  {
    id: "optimization",
    title: "Prompt Optimization & Engineering",
    description:
      "Advanced optimization techniques, A/B testing prompts, and systematic improvement methods.",
    level: "Advanced",
    duration: "5 hours",
    lessons: 18,
    students: 234,
    rating: 4.9,
    color: "bg-orange-500",
    skills: [
      "Prompt optimization",
      "A/B testing",
      "Performance metrics",
      "Systematic improvement",
    ],
  },
  {
    id: "ai-whisperer",
    title: "AI Whisperer Certification",
    description:
      "The ultimate mastery course. Learn to craft prompts like a true AI whisperer.",
    level: "Advanced",
    duration: "8 hours",
    lessons: 25,
    students: 89,
    rating: 5.0,
    color: "bg-gradient-to-r from-purple-600 to-pink-600",
    skills: [
      "Expert prompting",
      "Model understanding",
      "Advanced techniques",
      "Teaching others",
    ],
  },
];

export default function LearningPathsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  const filteredPaths =
    selectedLevel === "All"
      ? learningPaths
      : learningPaths.filter((path) => path.level === selectedLevel);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-bold">Learning Paths</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              AI Prompting{" "}
            </span>
            Step by Step
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured learning paths to transform you from a casual AI user to
            a prompt engineering expert.
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className="transition-all duration-200"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPaths.map((path, index) => (
            <div
              key={path.id}
              className="bg-card rounded-xl border p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${path.color} rounded-lg flex items-center justify-center text-white`}
                >
                  {index === 0 && <Target className="w-6 h-6" />}
                  {index === 1 && <Brain className="w-6 h-6" />}
                  {index === 2 && <Zap className="w-6 h-6" />}
                  {index === 3 && <Star className="w-6 h-6" />}
                  {index === 4 && <CheckCircle className="w-6 h-6" />}
                </div>
                <Badge className={getLevelColor(path.level)}>
                  {path.level}
                </Badge>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{path.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {path.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{path.duration}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Play className="w-3 h-3" />
                    <span>{path.lessons} lessons</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{path.students}</span>
                  </div>
                </div>
              </div>

              {/* Progress (if started) */}
              {path.progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                </div>
              )}

              {/* Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">You'll learn:</h4>
                <div className="flex flex-wrap gap-1">
                  {path.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {path.skills.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{path.skills.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rating & Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{path.rating}</span>
                </div>

                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {path.progress ? "Continue" : "Start Learning"}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Path Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
            <p className="text-muted-foreground">
              Follow our structured path to become an AI prompting expert
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {[
              "Vibe Coder",
              "Context Master",
              "Prompt Wizard",
              "AI Whisperer",
            ].map((level, index) => (
              <div key={level} className="flex items-center">
                <div className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-sm font-medium
                    ${
                      index === 0
                        ? "bg-orange-500"
                        : index === 1
                        ? "bg-green-500"
                        : index === 2
                        ? "bg-blue-500"
                        : "bg-purple-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium mt-2">{level}</p>
                </div>
                {index < 3 && (
                  <ArrowRight className="w-6 h-6 text-muted-foreground mx-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start with the foundations and work your way up to become an AI
            Whisperer
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              asChild
            >
              <Link href="/prompt-lab">
                <Target className="w-5 h-5 mr-2" />
                Start in Prompt Lab
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/prompt-library">
                <Brain className="w-5 h-5 mr-2" />
                Browse Prompt Library
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
