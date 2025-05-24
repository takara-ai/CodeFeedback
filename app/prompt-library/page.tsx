"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Star,
  Copy,
  Heart,
  Filter,
  Code,
  Database,
  Globe,
  Bot,
  Lightbulb,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  rating: number;
  likes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  author: string;
  useCase: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: "1",
    title: "Code Review & Optimization",
    description:
      "Get detailed code reviews with specific improvement suggestions",
    category: "Code Generation",
    prompt:
      "Review this code and provide specific improvement suggestions:\n\n[YOUR CODE HERE]\n\nPlease analyze:\n1. Code quality and best practices\n2. Performance optimizations\n3. Security considerations\n4. Readability improvements\n5. Potential bugs or edge cases\n\nProvide concrete examples of improvements.",
    rating: 4.9,
    likes: 156,
    difficulty: "Intermediate",
    tags: ["code-review", "optimization", "best-practices"],
    author: "CodeMaster",
    useCase: "Code improvement and learning",
  },
  {
    id: "2",
    title: "API Documentation Generator",
    description: "Generate comprehensive API documentation from code",
    category: "Documentation",
    prompt:
      "Generate comprehensive API documentation for this code:\n\n[YOUR API CODE HERE]\n\nInclude:\n- Clear endpoint descriptions\n- Request/response examples\n- Parameter explanations\n- Error codes and meanings\n- Authentication requirements\n- Rate limiting info\n- Code examples in multiple languages",
    rating: 4.8,
    likes: 142,
    difficulty: "Beginner",
    tags: ["documentation", "api", "technical-writing"],
    author: "DocBot",
    useCase: "API documentation creation",
  },
  {
    id: "3",
    title: "Database Schema Designer",
    description: "Design optimal database schemas with relationships",
    category: "Database",
    prompt:
      "Design a database schema for: [DESCRIBE YOUR APPLICATION]\n\nRequirements:\n- Identify all entities and their attributes\n- Define relationships (1:1, 1:many, many:many)\n- Suggest appropriate data types\n- Include indexes for performance\n- Consider normalization principles\n- Provide SQL CREATE statements\n- Explain design decisions",
    rating: 4.7,
    likes: 98,
    difficulty: "Advanced",
    tags: ["database", "schema", "sql", "design"],
    author: "DataArchitect",
    useCase: "Database design and optimization",
  },
  {
    id: "4",
    title: "Bug Hunter & Debugger",
    description: "Systematically find and fix bugs in your code",
    category: "Debugging",
    prompt:
      "Debug this code that's producing [DESCRIBE THE ISSUE]:\n\n[YOUR CODE HERE]\n\nPlease:\n1. Identify the root cause of the issue\n2. Explain why it's happening\n3. Provide a corrected version\n4. Suggest preventive measures\n5. Add relevant error handling\n6. Include test cases to verify the fix",
    rating: 4.8,
    likes: 203,
    difficulty: "Intermediate",
    tags: ["debugging", "troubleshooting", "error-handling"],
    author: "BugSlayer",
    useCase: "Bug identification and fixing",
  },
  {
    id: "5",
    title: "Test Case Generator",
    description: "Generate comprehensive test suites for your functions",
    category: "Testing",
    prompt:
      "Generate comprehensive test cases for this function:\n\n[YOUR FUNCTION HERE]\n\nCreate tests for:\n- Happy path scenarios\n- Edge cases and boundary values\n- Error conditions and exceptions\n- Invalid inputs\n- Performance edge cases\n- Integration scenarios\n\nUse [TESTING FRAMEWORK] format and include assertions.",
    rating: 4.6,
    likes: 87,
    difficulty: "Intermediate",
    tags: ["testing", "unit-tests", "quality-assurance"],
    author: "TestGuru",
    useCase: "Test automation and coverage",
  },
  {
    id: "6",
    title: "Architecture Pattern Advisor",
    description: "Get recommendations for software architecture patterns",
    category: "Architecture",
    prompt:
      "Recommend the best architecture pattern for: [DESCRIBE YOUR PROJECT]\n\nProject details:\n- Scale: [small/medium/large]\n- Technology stack: [YOUR STACK]\n- Team size: [NUMBER]\n- Performance requirements: [REQUIREMENTS]\n\nProvide:\n1. Recommended architecture pattern\n2. Justification for the choice\n3. Implementation guidelines\n4. Potential challenges and solutions\n5. Alternative patterns to consider",
    rating: 4.9,
    likes: 178,
    difficulty: "Advanced",
    tags: ["architecture", "design-patterns", "scalability"],
    author: "ArchGuru",
    useCase: "Software architecture design",
  },
];

const categories = [
  "All",
  "Code Generation",
  "Documentation",
  "Database",
  "Debugging",
  "Testing",
  "Architecture",
];

export default function PromptLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredPrompts = promptTemplates.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || prompt.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" || prompt.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Code Generation":
        return <Code className="w-4 h-4" />;
      case "Documentation":
        return <Lightbulb className="w-4 h-4" />;
      case "Database":
        return <Database className="w-4 h-4" />;
      case "Debugging":
        return <Zap className="w-4 h-4" />;
      case "Testing":
        return <Bot className="w-4 h-4" />;
      case "Architecture":
        return <Globe className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
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
                <Star className="w-5 h-5 text-yellow-600" />
                <h1 className="text-xl font-bold">Prompt Library</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Proven
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Prompt Templates{" "}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Copy, customize, and use these battle-tested prompts to get better
            results from AI coding assistants.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-200"
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {["All", "Beginner", "Intermediate", "Advanced"].map(
                (difficulty) => (
                  <Button
                    key={difficulty}
                    variant={
                      selectedDifficulty === difficulty ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className="transition-all duration-200"
                  >
                    {difficulty}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Found {filteredPrompts.length} prompt
            {filteredPrompts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Prompt Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-card rounded-xl border p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(prompt.category)}
                  <span className="text-sm text-muted-foreground">
                    {prompt.category}
                  </span>
                </div>
                <Badge className={getDifficultyColor(prompt.difficulty)}>
                  {prompt.difficulty}
                </Badge>
              </div>

              {/* Title and Description */}
              <h3 className="text-lg font-semibold mb-2">{prompt.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {prompt.description}
              </p>

              {/* Use Case */}
              <div className="mb-4">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {prompt.useCase}
                </span>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{prompt.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{prompt.likes}</span>
                  </div>
                </div>
                <span className="text-xs">by {prompt.author}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => copyToClipboard(prompt.prompt)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Prompt
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/prompt-lab?template=${prompt.id}`}>Try It</Link>
                </Button>
              </div>

              {/* Preview (collapsed by default) */}
              <details className="mt-4">
                <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                  View Prompt Preview
                </summary>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-muted-foreground max-h-32 overflow-y-auto">
                  {prompt.prompt}
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Own?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Take these templates to the Prompt Lab and customize them for your
            specific needs. Experiment, iterate, and create prompts that work
            perfectly for your use case.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500"
              asChild
            >
              <Link href="/prompt-lab">
                <Zap className="w-5 h-5 mr-2" />
                Open Prompt Lab
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/learning-paths">Learn Prompt Engineering</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
