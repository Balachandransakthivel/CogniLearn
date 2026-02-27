import { BehavioralMetrics, CognitivePattern, Recommendation, PerformanceMetrics } from '@/types/learning';

export const aiPatternService = {
  classifyLearningPattern(metrics: BehavioralMetrics): CognitivePattern {
    const avgResponseTime = metrics.responseTimesMs.reduce((a, b) => a + b, 0) / metrics.responseTimesMs.length;
    const retryRate = metrics.retryPatterns.reduce((a, b) => a + b, 0) / metrics.retryPatterns.length;
    
    // AI-based pattern classification (simulated)
    if (avgResponseTime < 3000 && metrics.focusScore > 80) {
      return {
        type: 'analytical',
        confidence: 0.87,
        characteristics: ['Quick decision making', 'High concentration', 'Systematic approach'],
        strengths: ['Problem-solving', 'Logical reasoning', 'Pattern recognition'],
        improvements: ['Take time to verify', 'Consider creative alternatives'],
      };
    } else if (metrics.engagementLevel > 85 && metrics.aiSearchCount > 3) {
      return {
        type: 'creative',
        confidence: 0.82,
        characteristics: ['Exploratory learning', 'High curiosity', 'Multi-source research'],
        strengths: ['Critical thinking', 'Information synthesis', 'Innovation'],
        improvements: ['Focus on core concepts first', 'Reduce external searches'],
      };
    } else if (retryRate > 2 && metrics.mistakeFrequency > 0.3) {
      return {
        type: 'kinesthetic',
        confidence: 0.75,
        characteristics: ['Learning by doing', 'Trial and error', 'Persistence'],
        strengths: ['Hands-on learning', 'Resilience', 'Practical application'],
        improvements: ['Review concepts before practice', 'Use visual aids'],
      };
    } else {
      return {
        type: 'visual',
        confidence: 0.79,
        characteristics: ['Steady pacing', 'Moderate engagement', 'Balanced approach'],
        strengths: ['Visual learning', 'Information retention', 'Structured study'],
        improvements: ['Increase practice frequency', 'Use interactive content'],
      };
    }
  },

  generateRecommendations(pattern: CognitivePattern, metrics: BehavioralMetrics): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Strategy recommendations based on cognitive pattern
    if (pattern.type === 'analytical') {
      recommendations.push({
        id: '1',
        category: 'study-strategy',
        title: 'Challenge Mode Activated',
        description: 'Try advanced problems to match your analytical strengths',
        priority: 'high',
        icon: 'trending-up',
      });
    } else if (pattern.type === 'creative') {
      recommendations.push({
        id: '2',
        category: 'approach',
        title: 'Focused Learning Sessions',
        description: 'Limit external searches to 2 per session for better retention',
        priority: 'high',
        icon: 'target',
      });
    }
    
    // Focus-based recommendations
    if (metrics.focusScore < 60) {
      recommendations.push({
        id: '3',
        category: 'timing',
        title: 'Optimize Study Time',
        description: 'Try shorter 25-minute focused sessions with 5-min breaks',
        priority: 'high',
        icon: 'clock',
      });
    }
    
    // Engagement recommendations
    if (metrics.engagementLevel < 50) {
      recommendations.push({
        id: '4',
        category: 'content',
        title: 'Gamified Practice',
        description: 'Enable streak challenges and achievement badges',
        priority: 'medium',
        icon: 'game-controller',
      });
    }
    
    // Accuracy recommendations
    if (metrics.mistakeFrequency > 0.4) {
      recommendations.push({
        id: '5',
        category: 'study-strategy',
        title: 'Concept Review Needed',
        description: 'Revisit fundamentals before attempting new problems',
        priority: 'high',
        icon: 'book',
      });
    }
    
    return recommendations;
  },

  calculatePerformanceMetrics(sessions: any[]): PerformanceMetrics {
    if (sessions.length === 0) {
      return {
        focusScore: 0,
        engagementScore: 0,
        accuracyTrend: 0,
        learningSpeed: 0,
        weeklyGrowth: 0,
        riskLevel: 'low',
      };
    }
    
    const recentSessions = sessions.slice(-5);
    const avgFocus = recentSessions.reduce((sum, s) => sum + s.behavioralData.focusScore, 0) / recentSessions.length;
    const avgEngagement = recentSessions.reduce((sum, s) => sum + s.behavioralData.engagementLevel, 0) / recentSessions.length;
    
    // Calculate accuracy trend
    const accuracies = recentSessions.map(s => (s.correctAnswers / s.totalQuestions) * 100);
    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    
    // Learning speed (questions per minute)
    const avgDuration = recentSessions.reduce((sum, s) => sum + (s.endTime - s.startTime), 0) / recentSessions.length;
    const avgQuestions = recentSessions.reduce((sum, s) => sum + s.totalQuestions, 0) / recentSessions.length;
    const learningSpeed = (avgQuestions / (avgDuration / 60000)) * 10; // Normalized
    
    // Weekly growth
    const weeklyGrowth = sessions.length >= 2 
      ? ((accuracies[accuracies.length - 1] - accuracies[0]) / accuracies[0]) * 100 
      : 0;
    
    // Risk assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (avgAccuracy < 50 || avgFocus < 40) riskLevel = 'high';
    else if (avgAccuracy < 70 || avgFocus < 60) riskLevel = 'medium';
    
    return {
      focusScore: Math.round(avgFocus),
      engagementScore: Math.round(avgEngagement),
      accuracyTrend: Math.round(avgAccuracy),
      learningSpeed: Math.round(learningSpeed),
      weeklyGrowth: Math.round(weeklyGrowth),
      riskLevel,
    };
  },

  predictRisk(metrics: PerformanceMetrics): { level: string; factors: string[]; interventions: string[] } {
    const factors: string[] = [];
    const interventions: string[] = [];
    
    if (metrics.focusScore < 60) {
      factors.push('Low focus during study sessions');
      interventions.push('Implement distraction-free environment');
    }
    
    if (metrics.accuracyTrend < 60) {
      factors.push('Declining accuracy in recent attempts');
      interventions.push('Schedule concept review sessions');
    }
    
    if (metrics.engagementScore < 50) {
      factors.push('Reduced engagement with learning materials');
      interventions.push('Introduce varied content formats');
    }
    
    if (metrics.weeklyGrowth < -10) {
      factors.push('Negative weekly performance trend');
      interventions.push('One-on-one tutoring recommended');
    }
    
    return {
      level: metrics.riskLevel,
      factors: factors.length > 0 ? factors : ['No significant risk factors detected'],
      interventions: interventions.length > 0 ? interventions : ['Continue current study approach'],
    };
  },
};
