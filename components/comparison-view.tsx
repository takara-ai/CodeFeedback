"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  Target,
  CheckCircle,
  Star,
  Code,
  Zap,
  Trophy,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import { CodeEditor } from "./code-editor";

interface ComparisonData {
  promptComparison: {
    original: string;
    final: string;
    improvements: string[];
  };
  codeComparison: {
    originalQuality: number;
    finalQuality: number;
    improvementPercentage: number;
    keyEnhancements: string[];
  };
  learningJourney: {
    lessonsCompleted: number;
    totalImprovements: number;
    biggestWin: string;
  };
}

interface ComparisonViewProps {
  data: ComparisonData;
  originalCode: string;
  finalCode: string;
  onStartNew?: () => void;
}

export function ComparisonView({
  data,
  originalCode,
  finalCode,
  onStartNew,
}: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<"prompts" | "code" | "metrics">(
    "prompts"
  );
  const [language] = useState("python");
  const [output] = useState("");

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return { text: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 60)
      return { text: "Good", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Needs Work", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">🎉 Prompt Engineering Mastery!</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Look how far you've come! Your prompts are now generating
          significantly better code.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {data.codeComparison.improvementPercentage}%
            </div>
            <div className="text-sm text-green-600">Quality Improvement</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {data.learningJourney.lessonsCompleted}
            </div>
            <div className="text-sm text-blue-600">Lessons Completed</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {data.learningJourney.totalImprovements}
            </div>
            <div className="text-sm text-purple-600">Key Improvements</div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button
            variant={activeTab === "prompts" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("prompts")}
            className="rounded-md"
          >
            Prompt Evolution
          </Button>
          <Button
            variant={activeTab === "code" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("code")}
            className="rounded-md"
          >
            Code Comparison
          </Button>
          <Button
            variant={activeTab === "metrics" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("metrics")}
            className="rounded-md"
          >
            Learning Journey
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === "prompts" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Original Prompt */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Original Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm">
                    "{data.promptComparison.original}"
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Final Prompt */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Improved Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg text-sm border border-green-200 dark:border-green-800">
                    "{data.promptComparison.final}"
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Key Improvements */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Key Improvements Made
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.promptComparison.improvements.map(
                    (improvement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                          {improvement}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "code" && (
          <div className="space-y-6 h-full">
            {/* Code Quality Scores */}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-lg font-semibold">Original Code</div>
                  <Badge
                    className={
                      getScoreBadge(data.codeComparison.originalQuality).color
                    }
                  >
                    {data.codeComparison.originalQuality}/100
                  </Badge>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-green-600" />

              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-lg font-semibold">Improved Code</div>
                  <Badge
                    className={
                      getScoreBadge(data.codeComparison.finalQuality).color
                    }
                  >
                    {data.codeComparison.finalQuality}/100
                  </Badge>
                </div>
              </div>
            </div>

            {/* Code Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code className="w-4 h-4 text-red-500" />
                    Original Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96">
                    <CodeEditor
                      code={originalCode}
                      setCode={() => {}}
                      output={output}
                      language={language}
                      onLanguageChange={() => {}}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code className="w-4 h-4 text-green-500" />
                    Improved Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96">
                    <CodeEditor
                      code={finalCode}
                      setCode={() => {}}
                      output={output}
                      language={language}
                      onLanguageChange={() => {}}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Code Enhancements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Code Enhancements Achieved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.codeComparison.keyEnhancements.map(
                    (enhancement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-800 dark:text-green-200">
                          {enhancement}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-6">
            {/* Learning Journey Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Your Learning Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-2">🏆 Biggest Win</h3>
                  <p className="text-muted-foreground">
                    {data.learningJourney.biggestWin}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.learningJourney.lessonsCompleted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Lessons Mastered
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {data.learningJourney.totalImprovements}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Skills Acquired
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.codeComparison.improvementPercentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Overall Growth
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Skills You've Mastered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Clear Communication",
                      "Specific Requirements",
                      "Context Awareness",
                      "Code Architecture",
                      "Performance Optimization",
                    ]
                      .slice(0, data.learningJourney.lessonsCompleted)
                      .map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center pt-4 border-t">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Progress
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Achievement
        </Button>
        {onStartNew && (
          <Button onClick={onStartNew} className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Start New Challenge
          </Button>
        )}
      </div>
    </div>
  );
}