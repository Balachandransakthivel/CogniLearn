import { useState, useEffect } from 'react';
import { LearningSession, PerformanceMetrics, Recommendation, CognitivePattern } from '@/types/learning';
import { learningDataService } from '@/services/learningDataService';
import { aiPatternService } from '@/services/aiPatternService';

export function useLearningAnalytics() {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [cognitivePattern, setCognitivePattern] = useState<CognitivePattern | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allSessions = await learningDataService.getAllSessions();
      
      // If no sessions, generate some mock data for demonstration
      if (allSessions.length === 0) {
        await generateInitialData();
        const newSessions = await learningDataService.getAllSessions();
        setSessions(newSessions);
        analyzeData(newSessions);
      } else {
        setSessions(allSessions);
        analyzeData(allSessions);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInitialData = async () => {
    const subjects = ['Mathematics', 'Science', 'English', 'History'];
    const topics = {
      Mathematics: ['Algebra', 'Geometry', 'Calculus'],
      Science: ['Physics', 'Chemistry', 'Biology'],
      English: ['Grammar', 'Literature', 'Writing'],
      History: ['World War II', 'Ancient Rome', 'Modern Era'],
    };
    
    for (let i = 0; i < 8; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const topicList = topics[subject as keyof typeof topics];
      const topic = topicList[Math.floor(Math.random() * topicList.length)];
      
      const session = learningDataService.generateMockSession(subject, topic);
      await learningDataService.saveLearningSession(session);
    }
  };

  const analyzeData = (sessionData: LearningSession[]) => {
    if (sessionData.length === 0) return;
    
    // Calculate performance metrics
    const performanceMetrics = aiPatternService.calculatePerformanceMetrics(sessionData);
    setMetrics(performanceMetrics);
    
    // Classify cognitive pattern from recent sessions
    const recentSession = sessionData[sessionData.length - 1];
    const pattern = aiPatternService.classifyLearningPattern(recentSession.behavioralData);
    setCognitivePattern(pattern);
    
    // Generate personalized recommendations
    const recs = aiPatternService.generateRecommendations(pattern, recentSession.behavioralData);
    setRecommendations(recs);
  };

  const addSession = async (session: LearningSession) => {
    await learningDataService.saveLearningSession(session);
    await loadData();
  };

  const refresh = async () => {
    await loadData();
  };

  return {
    sessions,
    metrics,
    recommendations,
    cognitivePattern,
    loading,
    addSession,
    refresh,
  };
}
