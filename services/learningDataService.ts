import { LearningSession, Student } from '@/types/learning';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SESSIONS: '@learning_sessions',
  STUDENT: '@student_profile',
};

export const learningDataService = {
  async saveLearningSession(session: LearningSession): Promise<void> {
    try {
      const existingSessions = await this.getAllSessions();
      const updatedSessions = [...existingSessions, session];
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving learning session:', error);
      throw error;
    }
  },

  async getAllSessions(): Promise<LearningSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  async getSessionsBySubject(subject: string): Promise<LearningSession[]> {
    const allSessions = await this.getAllSessions();
    return allSessions.filter(s => s.subject === subject);
  },

  async getRecentSessions(limit: number = 10): Promise<LearningSession[]> {
    const allSessions = await this.getAllSessions();
    return allSessions.slice(-limit).reverse();
  },

  async saveStudentProfile(student: Student): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
    } catch (error) {
      console.error('Error saving student profile:', error);
      throw error;
    }
  },

  async getStudentProfile(): Promise<Student | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting student profile:', error);
      return null;
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.SESSIONS, STORAGE_KEYS.STUDENT]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },

  // Generate mock session for testing
  generateMockSession(subject: string, topic: string): LearningSession {
    const totalQuestions = Math.floor(Math.random() * 10) + 10;
    const correctAnswers = Math.floor(Math.random() * totalQuestions);
    const duration = (Math.random() * 20 + 10) * 60 * 1000; // 10-30 minutes
    
    const responseTimes = Array.from({ length: totalQuestions }, () => 
      Math.random() * 5000 + 1000 // 1-6 seconds
    );
    
    return {
      id: Date.now().toString() + Math.random(),
      subject,
      topic,
      startTime: Date.now() - duration,
      endTime: Date.now(),
      totalQuestions,
      correctAnswers,
      behavioralData: {
        responseTimesMs: responseTimes,
        retryPatterns: Array.from({ length: totalQuestions }, () => Math.floor(Math.random() * 3)),
        mistakeFrequency: (totalQuestions - correctAnswers) / totalQuestions,
        focusScore: Math.floor(Math.random() * 40) + 60,
        engagementLevel: Math.floor(Math.random() * 40) + 60,
        webSearchCount: Math.floor(Math.random() * 5),
        aiSearchCount: Math.floor(Math.random() * 3),
      },
    };
  },
};
