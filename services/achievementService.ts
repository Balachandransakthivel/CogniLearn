import { Achievement, LearningSession } from '@/types/learning';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/constants/theme';

const STORAGE_KEY = '@achievements';

const achievementTemplates: Omit<Achievement, 'currentProgress' | 'isUnlocked' | 'unlockedAt'>[] = [
  // Streak Achievements
  {
    id: 'streak_3',
    title: 'Getting Started',
    description: 'Complete 3 days in a row',
    icon: 'local-fire-department',
    category: 'streak',
    requirement: 3,
    color: theme.colors.warning,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'whatshot',
    category: 'streak',
    requirement: 7,
    color: theme.colors.danger,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Complete 30 consecutive days',
    icon: 'stars',
    category: 'streak',
    requirement: 30,
    color: theme.colors.primary,
  },
  
  // Accuracy Achievements
  {
    id: 'accuracy_80',
    title: 'Sharp Mind',
    description: 'Achieve 80% accuracy in a session',
    icon: 'verified',
    category: 'accuracy',
    requirement: 80,
    color: theme.colors.success,
  },
  {
    id: 'accuracy_95',
    title: 'Near Perfect',
    description: 'Score 95% or higher',
    icon: 'workspace-premium',
    category: 'accuracy',
    requirement: 95,
    color: theme.colors.warning,
  },
  {
    id: 'accuracy_100',
    title: 'Flawless Victory',
    description: 'Get 100% in a quiz',
    icon: 'emoji-events',
    category: 'accuracy',
    requirement: 100,
    color: theme.colors.primary,
  },
  
  // Focus Achievements
  {
    id: 'focus_80',
    title: 'Focused Learner',
    description: 'Maintain 80+ focus score',
    icon: 'center-focus-strong',
    category: 'focus',
    requirement: 80,
    color: theme.colors.secondary,
  },
  {
    id: 'focus_90',
    title: 'Laser Focus',
    description: 'Achieve 90+ focus score',
    icon: 'visibility',
    category: 'focus',
    requirement: 90,
    color: theme.colors.primary,
  },
  
  // Mastery Achievements
  {
    id: 'sessions_10',
    title: 'Dedicated Student',
    description: 'Complete 10 learning sessions',
    icon: 'school',
    category: 'mastery',
    requirement: 10,
    color: theme.colors.info,
  },
  {
    id: 'sessions_50',
    title: 'Knowledge Seeker',
    description: 'Finish 50 sessions',
    icon: 'menu-book',
    category: 'mastery',
    requirement: 50,
    color: theme.colors.success,
  },
  {
    id: 'sessions_100',
    title: 'Learning Legend',
    description: 'Complete 100 sessions',
    icon: 'auto-awesome',
    category: 'mastery',
    requirement: 100,
    color: theme.colors.primary,
  },
  
  // Speed Achievements
  {
    id: 'speed_fast',
    title: 'Quick Thinker',
    description: 'Average response under 3 seconds',
    icon: 'flash-on',
    category: 'speed',
    requirement: 3,
    color: theme.colors.warning,
  },
  {
    id: 'speed_ultra',
    title: 'Lightning Fast',
    description: 'Response time under 2 seconds',
    icon: 'bolt',
    category: 'speed',
    requirement: 2,
    color: theme.colors.danger,
  },
];

export const achievementService = {
  async initializeAchievements(): Promise<Achievement[]> {
    const achievements: Achievement[] = achievementTemplates.map(template => ({
      ...template,
      currentProgress: 0,
      isUnlocked: false,
    }));
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    return achievements;
  },

  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        return await this.initializeAchievements();
      }
      return JSON.parse(data);
    } catch {
      return await this.initializeAchievements();
    }
  },

  async updateAchievements(sessions: LearningSession[]): Promise<Achievement[]> {
    const achievements = await this.getAchievements();
    const currentStreak = this.calculateCurrentStreak(sessions);
    
    const updatedAchievements = achievements.map(achievement => {
      let progress = achievement.currentProgress;
      let isUnlocked = achievement.isUnlocked;
      
      switch (achievement.category) {
        case 'streak':
          progress = currentStreak;
          break;
          
        case 'accuracy':
          const recentSession = sessions[sessions.length - 1];
          if (recentSession) {
            const accuracy = (recentSession.correctAnswers / recentSession.totalQuestions) * 100;
            progress = Math.max(progress, accuracy);
          }
          break;
          
        case 'focus':
          const latestSession = sessions[sessions.length - 1];
          if (latestSession) {
            progress = Math.max(progress, latestSession.behavioralData.focusScore);
          }
          break;
          
        case 'mastery':
          progress = sessions.length;
          break;
          
        case 'speed':
          const lastSession = sessions[sessions.length - 1];
          if (lastSession) {
            const avgTime = lastSession.behavioralData.responseTimesMs.reduce((a, b) => a + b, 0) / 
                           lastSession.behavioralData.responseTimesMs.length;
            progress = Math.min(progress || 999, avgTime / 1000);
          }
          break;
      }
      
      // Check if unlocked
      if (!isUnlocked) {
        if (achievement.category === 'speed') {
          isUnlocked = progress <= achievement.requirement;
        } else {
          isUnlocked = progress >= achievement.requirement;
        }
        
        if (isUnlocked) {
          return {
            ...achievement,
            currentProgress: progress,
            isUnlocked: true,
            unlockedAt: Date.now(),
          };
        }
      }
      
      return { ...achievement, currentProgress: progress };
    });
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAchievements));
    return updatedAchievements;
  },

  calculateCurrentStreak(sessions: LearningSession[]): number {
    if (sessions.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const hasSessionOnDate = sessions.some(session => {
        const sessionDate = new Date(session.endTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === currentDate.getTime();
      });
      
      if (hasSessionOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  },

  getNewlyUnlocked(oldAchievements: Achievement[], newAchievements: Achievement[]): Achievement[] {
    return newAchievements.filter((newAch, index) => 
      newAch.isUnlocked && !oldAchievements[index].isUnlocked
    );
  },
};
