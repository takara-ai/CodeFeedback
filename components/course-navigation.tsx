import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Circle, Lock, Play } from "lucide-react"

const lessons = [
  { id: 1, title: "Introduction to JavaScript", completed: true, locked: false },
  { id: 2, title: "Variables and Data Types", completed: true, locked: false },
  { id: 3, title: "Functions and Scope", completed: false, locked: false, current: true },
  { id: 4, title: "Arrays and Objects", completed: false, locked: false },
  { id: 5, title: "Control Flow", completed: false, locked: false },
  { id: 6, title: "DOM Manipulation", completed: false, locked: true },
  { id: 7, title: "Event Handling", completed: false, locked: true },
  { id: 8, title: "Async JavaScript", completed: false, locked: true },
]

export function CourseNavigation() {
  const completedLessons = lessons.filter((lesson) => lesson.completed).length
  const progressPercentage = (completedLessons / lessons.length) * 100

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg mb-2">JavaScript Fundamentals</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>
              {completedLessons}/{lessons.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Lessons List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {lessons.map((lesson) => (
            <Button
              key={lesson.id}
              variant={lesson.current ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 ${lesson.locked ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={lesson.locked}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  {lesson.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : lesson.locked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : lesson.current ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{lesson.title}</div>
                  <div className="text-xs text-muted-foreground">Lesson {lesson.id}</div>
                </div>
                {lesson.current && (
                  <Badge variant="secondary" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
