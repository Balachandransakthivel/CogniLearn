export interface LearningSession {
  id: string;
  subject: string;
  topic: string;
  startTime: number;
  endTime: number;
  totalQuestions: number;
  correctAnswers: number;
  behavioralData: BehavioralMetrics;
  cognitivePattern?: CognitivePattern;
}

export interface BehavioralMetrics {
  responseTimesMs: number[];
  retryPatterns: number[];
  mistakeFrequency: number;
  focusScore: number;
  engagementLevel: number;
  webSearchCount: number;
  aiSearchCount: number;
}

export interface CognitivePattern {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'analytical' | 'creative';
  confidence: number;
  characteristics: string[];
  strengths: string[];
  improvements: string[];
}

export interface PerformanceMetrics {
  focusScore: number;
  engagementScore: number;
  accuracyTrend: number;
  learningSpeed: number;
  weeklyGrowth: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  category: 'study-strategy' | 'content' | 'timing' | 'approach';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
  totalSessions: number;
  currentStreak: number;
}

// New Types for Enhanced Features

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  topic: string;
}

export interface QuizSession {
  id: string;
  subject: string;
  topic: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  startTime: number;
  questionStartTime: number;
  responseTimes: number[];
  retries: number[];
  isActive: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'accuracy' | 'focus' | 'mastery' | 'speed';
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: number;
  color: string;
}

export interface StudyPlanItem {
  id: string;
  subject: string;
  topic: string;
  scheduledTime: number;
  duration: number; // minutes
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  recommendedBy: 'ai' | 'user';
}

export interface ParentChildLink {
  id: string;
  parentId: string;
  childId: string;
  childName: string;
  linkedAt: number;
  permissions: {
    viewProgress: boolean;
    viewReports: boolean;
    receiveAlerts: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'teacher';
  avatar?: string;
  linkedAccounts?: string[]; // For parent-child linking
}
