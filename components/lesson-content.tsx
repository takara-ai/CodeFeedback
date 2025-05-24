import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react"

export function LessonContent() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <h1 className="text-xl font-bold">Functions and Scope</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>15 min</span>
            </div>
            <Badge variant="outline">Lesson 3</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-3xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Understanding Functions</h2>
              <p className="text-muted-foreground leading-relaxed">
                Functions are one of the fundamental building blocks in JavaScript. A function is a reusable block of
                code designed to perform a particular task.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Function Declaration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div className="text-blue-600">function</div>
                  <div className="ml-2">
                    <span className="text-purple-600">greet</span>
                    <span className="text-gray-600">(</span>
                    <span className="text-orange-600">name</span>
                    <span className="text-gray-600">) &#123;</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-600">return</span>
                    <span className="text-green-600"> "Hello, " + name + "!"</span>
                    <span className="text-gray-600">;</span>
                  </div>
                  <div className="text-gray-600">&#125;</div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-xl font-semibold mb-3">Key Concepts</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Parameters:</strong> Variables that act as placeholders for values passed to the function
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Return Statement:</strong> Specifies the value that the function should output
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Function Scope:</strong> Variables declared inside a function are only accessible within
                    that function
                  </span>
                </li>
              </ul>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Try It Yourself</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  In the code editor on the right, create a function called{" "}
                  <code className="bg-blue-100 px-1 rounded">calculateArea</code> that takes two parameters (length and
                  width) and returns their product.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>

      {/* Navigation Footer */}
      <div className="border-t p-4">
        <div className="flex justify-between">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Previous Lesson
          </Button>
          <Button className="flex items-center gap-2">
            Next Lesson
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
