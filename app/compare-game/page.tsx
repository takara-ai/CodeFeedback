"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Trophy, Target, Zap, Loader2, Play } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import type { PyodideInterface } from "@/types/pyodide";

interface CodeComparison {
  prompt: string;
  goodCode: string;
  badCode: string;
  explanation: {
    good: string;
    bad: string;
  };
}

export default function CompareGamePage() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'revealed' | 'finished'>('loading');
  const [selectedCode, setSelectedCode] = useState<'left' | 'right' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [leftIsGood, setLeftIsGood] = useState(true);
  const [currentChallengeData, setCurrentChallengeData] = useState<CodeComparison | null>(null);
  const [totalChallenges] = useState(5);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [usedTopics, setUsedTopics] = useState<string[]>([]);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  
  // Python execution state
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [leftOutput, setLeftOutput] = useState<string>("");
  const [rightOutput, setRightOutput] = useState<string>("");
  const [isRunningLeft, setIsRunningLeft] = useState(false);
  const [isRunningRight, setIsRunningRight] = useState(false);

  useEffect(() => {
    initializeGame();
    loadPyodide();
  }, []);

  const loadPyodide = async () => {
    if (pyodide || pyodideLoading || pyodideError) return;

    try {
      setPyodideLoading(true);
      setPyodideError(null);

      // Check if Pyodide is already loaded
      if (window.loadPyodide) {
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        setPyodide(py);
        setPyodideLoading(false);
        return;
      }

      // Create and load the script
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.async = true;

      script.onload = async () => {
        try {
          if (window.loadPyodide) {
            const py = await window.loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
            });
            setPyodide(py);
          } else {
            throw new Error("Pyodide failed to load properly");
          }
        } catch (error) {
          console.error("Error initializing Pyodide:", error);
          setPyodideError(
            error instanceof Error ? error.message : "Failed to initialize Pyodide"
          );
        } finally {
          setPyodideLoading(false);
        }
      };

      script.onerror = () => {
        console.error("Failed to load Pyodide script");
        setPyodideError("Failed to load Pyodide from CDN");
        setPyodideLoading(false);
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("Error setting up Pyodide:", error);
      setPyodideError(
        error instanceof Error ? error.message : "Failed to setup Pyodide"
      );
      setPyodideLoading(false);
    }
  };

  const runCode = async (code: string, side: 'left' | 'right') => {
    if (pyodideLoading) {
      const output = "⏳ Python environment is still loading... Please wait.";
      if (side === 'left') setLeftOutput(output);
      else setRightOutput(output);
      return;
    }

    if (pyodideError) {
      const output = `❌ Python environment error: ${pyodideError}`;
      if (side === 'left') setLeftOutput(output);
      else setRightOutput(output);
      return;
    }

    if (!pyodide) {
      const output = "❌ Python environment is not available.";
      if (side === 'left') setLeftOutput(output);
      else setRightOutput(output);
      return;
    }

    if (side === 'left') {
      setIsRunningLeft(true);
      setLeftOutput("🚀 Running code...");
    } else {
      setIsRunningRight(true);
      setRightOutput("🚀 Running code...");
    }

    try {
      const wrappedCode = `
import sys
from io import StringIO
import traceback

# Capture stdout
stdout = sys.stdout
sys.stdout = StringIO()

${code}
    
sys.stdout.getvalue()
`;

      let output = "";
      try {
        const result = await pyodide.runPythonAsync(wrappedCode);
        output = String(result);
      } catch (err: any) {
        output = `❌ Error: ${err.toString()}`;
      }

      if (output.trim()) {
        if (side === 'left') setLeftOutput(output);
        else setRightOutput(output);
      } else {
        const successOutput = "✅ Code executed successfully! (No output produced)";
        if (side === 'left') setLeftOutput(successOutput);
        else setRightOutput(successOutput);
      }
    } catch (err: any) {
      console.error("Code execution error:", err);
      const errorOutput = `❌ Execution Error: ${err.toString()}`;
      if (side === 'left') setLeftOutput(errorOutput);
      else setRightOutput(errorOutput);
    } finally {
      if (side === 'left') setIsRunningLeft(false);
      else setIsRunningRight(false);
    }
  };

  const generateTopics = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/chat-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate 12 diverse Python programming challenge topics for teaching users how to evaluate AI-generated code quality. Return ONLY valid JSON array:

[
  "Create a function to check if a text contains bad words",
  "Create a function to format a person's name properly",
  "..."
]

Topics should focus on PRACTICAL, EVERYDAY programming tasks that help users learn to spot:
- Code readability issues
- Basic performance problems
- Missing error handling
- Poor variable naming
- Code that's hard to understand or maintain
- Security vulnerabilities in simple scenarios

Topics should cover:
- Text processing and validation
- Basic data manipulation (lists, dictionaries)
- Simple file operations
- User input handling
- Basic web/API interactions
- Common utility functions
- Data formatting and cleaning

Make each topic:
- Practical and relatable (things people actually code)
- Easy to understand without math/algorithm knowledge
- Focused on code quality rather than algorithmic complexity
- Suitable for teaching "code smell" detection
- About real-world programming scenarios
- Clear about what the function should do in plain English`
            },
          ],
        }),
      });

      const data = await response.json();
      let content = data.content;
      
      // Clean up the response to extract JSON
      content = content.replace(/```json\n?|\n?```/g, "");
      content = content.replace(/^[^[]*/, "");
      content = content.replace(/[^\]]*$/, "");
      
      const topics = JSON.parse(content);
      return Array.isArray(topics) ? topics : [];
    } catch (error) {
      console.error("Error generating topics:", error);
      // Fallback topics focused on practical code quality
      return [
        "Create a function to validate email addresses",
        "Create a function to format phone numbers",
        "Create a function to clean up user input text",
        "Create a function to check if a password is strong enough",
        "Create a function to extract hashtags from social media posts",
        "Create a function to convert text to title case",
        "Create a function to remove duplicate items from a shopping list",
        "Create a function to calculate the total price with tax",
        "Create a function to check if a username is available",
        "Create a function to format dates in a readable way",
        "Create a function to count words in a text",
        "Create a function to find the most common word in text"
      ];
    }
  };

  const initializeGame = async () => {
    setGameState('loading');
    
    // Generate topics for this game session
    const topics = await generateTopics();
    setAvailableTopics(topics);
    
    // Generate first challenge
    await generateNewChallenge(topics);
    setGameState('playing');
    setLeftIsGood(Math.random() > 0.5);
  };

  const generateNewChallenge = async (topics?: string[]) => {
    const topicsToUse = topics || availableTopics;
    
    // Get available topics (not used yet)
    const unusedTopics = topicsToUse.filter(topic => !usedTopics.includes(topic));
    
    // If we've used all topics, reset the pool
    const finalTopics = unusedTopics.length > 0 ? unusedTopics : topicsToUse;
    
    // Select random topic
    const selectedTopic = finalTopics[Math.floor(Math.random() * finalTopics.length)];
    
    try {
      const challenge = await generateChallenge(selectedTopic);
      setCurrentChallengeData(challenge);
      setUsedTopics(prev => [...prev, selectedTopic]);
    } catch (error) {
      console.error("Error generating challenge:", error);
      // Fallback challenge
      setCurrentChallengeData({
        prompt: selectedTopic,
        goodCode: `# Good implementation for: ${selectedTopic}
def example():
    # Efficient, clean implementation
    pass`,
        badCode: `# Bad implementation for: ${selectedTopic}
def example():
    # Inefficient, problematic implementation
    pass`,
        explanation: {
          good: "This would be an efficient implementation with best practices.",
          bad: "This would be an inefficient implementation with poor practices."
        }
      });
      setUsedTopics(prev => [...prev, selectedTopic]);
    }
  };

  const generateChallenge = async (prompt: string): Promise<CodeComparison> => {
    const response = await fetch("/api/chat-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Generate a code quality evaluation challenge for: "${prompt}"

Create two Python implementations - one with good practices and one with poor practices. This is for teaching users how to evaluate AI-generated code quality. Return ONLY valid JSON:

{
  "prompt": "${prompt}",
  "goodCode": "def example():\n    # Clean, readable implementation\n    pass\n\n# Test the function\nprint(example())",
  "badCode": "def example():\n    # Poor quality implementation\n    pass\n\n# Test the function\nprint(example())",
  "explanation": {
    "good": "Why this code follows good practices (readability, maintainability, etc.)",
    "bad": "Why this code has quality issues (hard to read, maintain, or understand)"
  }
}

IMPORTANT: 
- Both code versions must be SIMILAR IN LENGTH (same number of lines, similar complexity) so users can't cheat by picking the longer one. The difference should be in QUALITY, not quantity.
- Both implementations must be FUNCTIONAL and produce VISIBLE OUTPUT when run
- Include test code that calls the function and prints results so users can see how it works
- Make the output meaningful and comparable between versions

Focus on PRACTICAL code quality issues that anyone can understand:`
          },
        ],
      }),
    });

    const data = await response.json();
    let content = data.content;
    
    // Clean up the response to extract JSON
    content = content.replace(/```json\n?|\n?```/g, "");
    content = content.replace(/^[^{]*/, "");
    content = content.replace(/[^}]*$/, "");
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse JSON:", content);
      throw parseError;
    }
  };

  const handleChoice = (choice: 'left' | 'right') => {
    setSelectedCode(choice);
    const correct = (choice === 'left' && leftIsGood) || (choice === 'right' && !leftIsGood);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setGameState('revealed');
  };

  const nextChallenge = async () => {
    if (currentChallenge < totalChallenges - 1) {
      setIsGeneratingNext(true);
      setCurrentChallenge(currentChallenge + 1);
      setSelectedCode(null);
      setIsCorrect(null);
      
      // Clear outputs
      setLeftOutput("");
      setRightOutput("");
      
      // Generate next challenge
      await generateNewChallenge();
      
      setGameState('playing');
      setLeftIsGood(Math.random() > 0.5);
      setIsGeneratingNext(false);
    } else {
      setGameState('finished');
    }
  };

  const resetGame = () => {
    setCurrentChallenge(0);
    setScore(0);
    setSelectedCode(null);
    setIsCorrect(null);
    setUsedTopics([]);
    
    // Clear outputs
    setLeftOutput("");
    setRightOutput("");
    
    initializeGame();
  };

  const getScoreColor = () => {
    const percentage = (score / totalChallenges) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Loading state for first challenge
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Generating Challenge</h2>
            <p className="text-gray-600 mb-4">
              AI is creating a code quality evaluation challenge for you...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Finished state
  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="h-16 w-16 text-yellow-500" />
              </div>
              <CardTitle className="text-3xl">Game Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className={`text-6xl font-bold ${getScoreColor()}`}>
                  {score}/{totalChallenges}
                </div>
                <p className="text-gray-600 mt-2">
                  {score === totalChallenges ? "Perfect! You're a code quality expert!" :
                   score >= totalChallenges * 0.8 ? "Excellent! You have a great eye for code quality." :
                   score >= totalChallenges * 0.6 ? "Good job! You're learning to spot quality issues." :
                   "Keep practicing! Code quality evaluation is a valuable skill."}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{totalChallenges}</div>
                  <div className="text-sm text-gray-600">Challenges</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((score / totalChallenges) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>

              <Button onClick={resetGame} className="w-full" size="lg">
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Game state - check if we have current challenge data
  if (!currentChallengeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Failed to generate challenge</p>
          <Button onClick={initializeGame}>Try Again</Button>
        </div>
      </div>
    );
  }

  const leftCode = leftIsGood ? currentChallengeData.goodCode : currentChallengeData.badCode;
  const rightCode = leftIsGood ? currentChallengeData.badCode : currentChallengeData.goodCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Code Quality Detective
          </h1>
          <p className="text-gray-600 mb-4">
            Learn to spot good vs poor code quality! Choose the better-written version first, then run both to see how they work.
          </p>
          
          <div className="flex justify-center items-center gap-6">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Target className="mr-2 h-4 w-4" />
              Challenge {currentChallenge + 1}/{totalChallenges}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Trophy className="mr-2 h-4 w-4" />
              Score: {score}/{totalChallenges}
            </Badge>
          </div>
        </div>

        {/* Challenge Prompt */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Challenge: {currentChallengeData.prompt}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Code Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Code */}
          <Card className={`transition-all duration-300 ${
            gameState === 'revealed' 
              ? leftIsGood 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'ring-2 ring-red-500 bg-red-50'
              : selectedCode === 'left' 
                ? 'ring-2 ring-blue-500' 
                : 'hover:shadow-lg cursor-pointer'
          }`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Version A</CardTitle>
                {gameState === 'revealed' && (
                  <Badge variant={leftIsGood ? "default" : "destructive"}>
                    {leftIsGood ? (
                      <>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Good Quality
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-4 w-4" />
                        Poor Quality
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
                <Editor
                  height="200px"
                  defaultLanguage="python"
                  language="python"
                  value={leftCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontSize: 13,
                    lineNumbers: "on",
                    wordWrap: "on",
                  }}
                />
              </div>
              
              {/* Run Button */}
              <Button 
                onClick={() => runCode(leftCode, 'left')}
                className="w-full mb-4"
                variant="outline"
                disabled={isRunningLeft || pyodideLoading || gameState === 'playing'}
              >
                {isRunningLeft ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : gameState === 'playing' ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Make your choice first
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Code
                  </>
                )}
              </Button>

              {/* Output Display */}
              {leftOutput && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4 text-sm">
                  <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Output:</div>
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {leftOutput}
                  </pre>
                </div>
              )}
              
              {gameState === 'playing' && (
                <Button 
                  onClick={() => handleChoice('left')}
                  className="w-full"
                  variant={selectedCode === 'left' ? "default" : "outline"}
                >
                  Choose Version A
                </Button>
              )}
              
              {gameState === 'revealed' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Analysis:</strong> {leftIsGood ? currentChallengeData.explanation.good : currentChallengeData.explanation.bad}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Code */}
          <Card className={`transition-all duration-300 ${
            gameState === 'revealed' 
              ? !leftIsGood 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'ring-2 ring-red-500 bg-red-50'
              : selectedCode === 'right' 
                ? 'ring-2 ring-blue-500' 
                : 'hover:shadow-lg cursor-pointer'
          }`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Version B</CardTitle>
                {gameState === 'revealed' && (
                  <Badge variant={!leftIsGood ? "default" : "destructive"}>
                    {!leftIsGood ? (
                      <>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Good Quality
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-4 w-4" />
                        Poor Quality
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
                <Editor
                  height="200px"
                  defaultLanguage="python"
                  language="python"
                  value={rightCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontSize: 13,
                    lineNumbers: "on",
                    wordWrap: "on",
                  }}
                />
              </div>
              
              {/* Run Button */}
              <Button 
                onClick={() => runCode(rightCode, 'right')}
                className="w-full mb-4"
                variant="outline"
                disabled={isRunningRight || pyodideLoading || gameState === 'playing'}
              >
                {isRunningRight ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : gameState === 'playing' ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Make your choice first
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Code
                  </>
                )}
              </Button>

              {/* Output Display */}
              {rightOutput && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4 text-sm">
                  <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Output:</div>
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {rightOutput}
                  </pre>
                </div>
              )}
              
              {gameState === 'playing' && (
                <Button 
                  onClick={() => handleChoice('right')}
                  className="w-full"
                  variant={selectedCode === 'right' ? "default" : "outline"}
                >
                  Choose Version B
                </Button>
              )}
              
              {gameState === 'revealed' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Analysis:</strong> {!leftIsGood ? currentChallengeData.explanation.good : currentChallengeData.explanation.bad}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Result and Next Button */}
        {gameState === 'revealed' && (
          <div className="text-center">
            {!isGeneratingNext && (
              <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect!'}
              </div>
            )}
            
            {isGeneratingNext && (
              <div className="text-2xl font-bold mb-4 text-blue-600">
                🤖 AI is creating your next challenge...
              </div>
            )}
            
            <Button onClick={nextChallenge} size="lg" disabled={isGeneratingNext}>
              {isGeneratingNext ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Next Challenge...
                </>
              ) : (
                currentChallenge < totalChallenges - 1 ? 'Next Challenge' : 'View Results'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
