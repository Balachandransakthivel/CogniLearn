import { Question, QuizSession } from '@/types/learning';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@active_quiz_session';

const questionBank: { [subject: string]: Question[] } = {
  Mathematics: [
    {
      id: 'math1',
      text: 'What is the value of x in the equation: 2x + 5 = 15?',
      options: ['5', '7', '10', '15'],
      correctAnswer: 0,
      difficulty: 'easy',
      subject: 'Mathematics',
      topic: 'Algebra',
    },
    {
      id: 'math2',
      text: 'What is the area of a circle with radius 7 cm? (Use π = 22/7)',
      options: ['154 cm²', '44 cm²', '308 cm²', '22 cm²'],
      correctAnswer: 0,
      difficulty: 'medium',
      subject: 'Mathematics',
      topic: 'Geometry',
    },
    {
      id: 'math3',
      text: 'Simplify: (3x² + 2x - 5) - (x² - 3x + 2)',
      options: ['2x² + 5x - 7', '4x² - x - 3', '2x² - x - 7', '2x² + 5x - 3'],
      correctAnswer: 0,
      difficulty: 'medium',
      subject: 'Mathematics',
      topic: 'Algebra',
    },
    {
      id: 'math4',
      text: 'What is the derivative of x³?',
      options: ['3x²', 'x²', '3x', 'x³/3'],
      correctAnswer: 0,
      difficulty: 'hard',
      subject: 'Mathematics',
      topic: 'Calculus',
    },
  ],
  Science: [
    {
      id: 'sci1',
      text: 'What is the chemical formula for water?',
      options: ['H₂O', 'CO₂', 'O₂', 'H₂O₂'],
      correctAnswer: 0,
      difficulty: 'easy',
      subject: 'Science',
      topic: 'Chemistry',
    },
    {
      id: 'sci2',
      text: 'Which organelle is known as the powerhouse of the cell?',
      options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Chloroplast'],
      correctAnswer: 0,
      difficulty: 'easy',
      subject: 'Science',
      topic: 'Biology',
    },
    {
      id: 'sci3',
      text: "What is Newton's Second Law of Motion?",
      options: ['F = ma', 'E = mc²', 'v = u + at', 'PV = nRT'],
      correctAnswer: 0,
      difficulty: 'medium',
      subject: 'Science',
      topic: 'Physics',
    },
    {
      id: 'sci4',
      text: 'Which element has the atomic number 6?',
      options: ['Carbon', 'Oxygen', 'Nitrogen', 'Hydrogen'],
      correctAnswer: 0,
      difficulty: 'medium',
      subject: 'Science',
      topic: 'Chemistry',
    },
  ],
  English: [
    {
      id: 'eng1',
      text: 'Which of the following is a proper noun?',
      options: ['London', 'city', 'country', 'building'],
      correctAnswer: 0,
      difficulty: 'easy',
      subject: 'English',
      topic: 'Grammar',
    },
    {
      id: 'eng2',
      text: 'What is the past tense of "swim"?',
      options: ['swam', 'swimmed', 'swum', 'swimming'],
      correctAnswer: 0,
      difficulty: 'easy',
      subject: 'English',
      topic: 'Grammar',
    },
    {
      id: 'eng3',
      text: 'Who wrote "Romeo and Juliet"?',
      options: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'],
      correctAnswer: 0,
      difficulty: 'medium',
      subject: 'English',
      topic: 'Literature',
    },
  ],
  History: [
    {
      id: 'hist1',
      text: 'In which year did World War II end?',
      options: ['1945', '1944', '1946', '1943'],
      correctAnswer: 0,
      difficulty: 'easy',
      subject: 'History',
      topic: 'World War II',
    },
    {
      id: 'hist2',
      text: 'Who was the first Roman Emperor?',
      options: ['Augustus', 'Julius Caesar', 'Nero', 'Constantine'],
      correctAnswer: 0,
      difficulty: 'medium',
      subject: 'History',
      topic: 'Ancient Rome',
    },
  ],
};

export const quizService = {
  getQuestionsBySubject(subject: string, count: number = 10): Question[] {
    const questions = questionBank[subject] || [];
    return questions.slice(0, count);
  },

  async startQuiz(subject: string, topic: string): Promise<QuizSession> {
    const questions = this.getQuestionsBySubject(subject, 10);
    
    const session: QuizSession = {
      id: Date.now().toString(),
      subject,
      topic,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: Date.now(),
      questionStartTime: Date.now(),
      responseTimes: [],
      retries: [],
      isActive: true,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  async getActiveQuiz(): Promise<QuizSession | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async submitAnswer(session: QuizSession, answerIndex: number): Promise<QuizSession> {
    const responseTime = Date.now() - session.questionStartTime;
    const currentRetries = session.retries[session.currentQuestionIndex] || 0;

    const updatedSession: QuizSession = {
      ...session,
      answers: [...session.answers, answerIndex],
      responseTimes: [...session.responseTimes, responseTime],
      retries: [...session.retries, currentRetries],
      currentQuestionIndex: session.currentQuestionIndex + 1,
      questionStartTime: Date.now(),
      isActive: session.currentQuestionIndex + 1 < session.questions.length,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    return updatedSession;
  },

  async recordRetry(session: QuizSession): Promise<QuizSession> {
    const retries = [...session.retries];
    retries[session.currentQuestionIndex] = (retries[session.currentQuestionIndex] || 0) + 1;

    const updatedSession = { ...session, retries };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    return updatedSession;
  },

  async endQuiz(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  calculateQuizResults(session: QuizSession) {
    const correctAnswers = session.answers.filter(
      (answer, index) => answer === session.questions[index].correctAnswer
    ).length;

    const avgResponseTime = session.responseTimes.reduce((a, b) => a + b, 0) / session.responseTimes.length;
    const totalRetries = session.retries.reduce((a, b) => a + b, 0);
    
    // Calculate focus score based on response consistency
    const responseVariance = this.calculateVariance(session.responseTimes);
    const focusScore = Math.max(0, Math.min(100, 100 - (responseVariance / 1000)));
    
    // Engagement based on attempts and completion
    const engagementScore = Math.min(100, ((correctAnswers / session.questions.length) * 70) + 30);

    return {
      correctAnswers,
      totalQuestions: session.questions.length,
      accuracy: (correctAnswers / session.questions.length) * 100,
      avgResponseTime,
      totalRetries,
      focusScore: Math.round(focusScore),
      engagementScore: Math.round(engagementScore),
    };
  },

  calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  },
};
