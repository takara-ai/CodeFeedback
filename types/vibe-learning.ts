export interface PromptGrade {
  score: number;
  clarity: number;
  specificity: number;
  context: number;
  feedback: string;
  suggestions: string[];
}

export interface CodeAssessment {
  score: number;
  functionality: number;
  quality: number;
  efficiency: number;
  feedback: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  objective: string;
  challenge: string;
  examplePrompt: string;
  completed?: boolean;
  locked?: boolean;
  current?: boolean;
  promptScore?: number | null;
}

export interface UserProgress {
  lessonId: number;
  promptAttempts: PromptAttempt[];
  completedAt?: Date;
  bestPromptScore?: number;
  bestCodeScore?: number;
}

export interface PromptAttempt {
  prompt: string;
  promptGrade: PromptGrade;
  generatedCode: string;
  codeAssessment: CodeAssessment;
  timestamp: Date;
}

export interface LearningSession {
  userId: string;
  lessons: UserProgress[];
  overallProgress: number;
  averagePromptScore: number;
  startedAt: Date;
  lastActivityAt: Date;
}
