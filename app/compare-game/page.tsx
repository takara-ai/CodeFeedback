"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Trophy, Target, Zap, Loader2 } from "lucide-react";

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

  useEffect(() => {
    initializeGame();
  }, []);

  const generateTopics = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/chat-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate 12 diverse Python programming challenge topics for a code quality comparison game. Return ONLY valid JSON array:

[
  "Create a function to check if a number is prime",
  "Create a function to reverse a string",
  "..."
]

Topics should cover:
- Data structures (lists, dictionaries, sets)
- Algorithms (basic ones)
- String manipulation
- Mathematical computations
- File operations
- Data validation
- Common programming patterns
- Performance optimization scenarios

Make each topic:
- Clear and specific
- Suitable for comparing good vs bad implementations
- Educational (showing common mistakes vs best practices), but not too complex (suited for kids)
- Varied in difficulty and domain
- Explain the problem in a way that is easy to understand (if it contains math, explain briefly the concept)`
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
      // Fallback topics if AI generation fails
      return [
        "Create a function to check if a number is prime",
        "Create a function to reverse a string",
        "Create a function to find the maximum value in a list",
        "Create a function to count word frequency in text",
        "Create a function to calculate factorial",
        "Create a function to sort a list of numbers",
        "Create a function to find duplicate elements in a list",
        "Create a function to validate email addresses",
        "Create a function to generate fibonacci sequence",
        "Create a function to merge two sorted arrays",
        "Create a function to check if a string is a palindrome",
        "Create a function to calculate the sum of digits in a number"
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
            content: `Generate a code comparison challenge for: "${prompt}"

Create two Python implementations - one good and one intentionally bad. Return ONLY valid JSON:

{
  "prompt": "${prompt}",
  "goodCode": "def example():\n    # Efficient, clean implementation\n    pass",
  "badCode": "def example():\n    # Inefficient, problematic implementation\n    pass",
  "explanation": {
    "good": "Brief explanation of why this is good (efficiency, readability, best practices)",
    "bad": "Brief explanation of why this is bad (performance issues, poor practices, bugs)"
  }
}

Make the bad code have real issues like:
- Poor time/space complexity
- Missing error handling
- Inefficient algorithms
- Poor variable names
- Code duplication
- Security issues

Make the good code demonstrate:
- Optimal algorithms
- Proper error handling
- Clean, readable code
- Best practices
- Efficient data structures`
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
              MISTRAL is creating your first code comparison challenge...
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
                   score >= totalChallenges * 0.6 ? "Good job! Keep practicing to improve your code sense." :
                   "Keep learning! Code quality comes with experience."}
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
            AI Code Quality Challenge
          </h1>
          <p className="text-gray-600 mb-4">
            MISTRAL generated two versions of the same code. Choose the better one!
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
                        Good Code
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-4 w-4" />
                        Bad Code
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 text-sm">
                <pre className="text-green-400 whitespace-pre-wrap overflow-x-auto">
                  {leftCode}
                </pre>
              </div>
              
              {gameState === 'playing' && (
                <Button 
                  onClick={() => handleChoice('left')}
                  className="w-full mt-4"
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
                        Good Code
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-4 w-4" />
                        Bad Code
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 text-sm">
                <pre className="text-green-400 whitespace-pre-wrap overflow-x-auto">
                  {rightCode}
                </pre>
              </div>
              
              {gameState === 'playing' && (
                <Button 
                  onClick={() => handleChoice('right')}
                  className="w-full mt-4"
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
