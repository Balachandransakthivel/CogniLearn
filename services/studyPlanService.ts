import { StudyPlanItem, PerformanceMetrics } from '@/types/learning';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@study_plan';

export const studyPlanService = {
  async getStudyPlan(): Promise<StudyPlanItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveStudyPlan(plan: StudyPlanItem[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  },

  async addPlanItem(item: StudyPlanItem): Promise<void> {
    const plan = await this.getStudyPlan();
    plan.push(item);
    await this.saveStudyPlan(plan);
  },

  async updatePlanItem(id: string, updates: Partial<StudyPlanItem>): Promise<void> {
    const plan = await this.getStudyPlan();
    const index = plan.findIndex(item => item.id === id);
    if (index !== -1) {
      plan[index] = { ...plan[index], ...updates };
      await this.saveStudyPlan(plan);
    }
  },

  async deletePlanItem(id: string): Promise<void> {
    const plan = await this.getStudyPlan();
    const filtered = plan.filter(item => item.id !== id);
    await this.saveStudyPlan(filtered);
  },

  generateAIRecommendedPlan(metrics: PerformanceMetrics): StudyPlanItem[] {
    const now = new Date();
    const plan: StudyPlanItem[] = [];
    
    // Recommend based on performance
    if (metrics.accuracyTrend < 70) {
      // Low accuracy - recommend review sessions
      plan.push({
        id: `ai_${Date.now()}_1`,
        subject: 'Review Session',
        topic: 'Concept Reinforcement',
        scheduledTime: this.getNextAvailableSlot(now, 14), // 2 PM
        duration: 45,
        priority: 'high',
        completed: false,
        recommendedBy: 'ai',
      });
    }
    
    if (metrics.focusScore < 60) {
      // Low focus - recommend shorter sessions
      plan.push({
        id: `ai_${Date.now()}_2`,
        subject: 'Focus Training',
        topic: 'Quick Practice Drills',
        scheduledTime: this.getNextAvailableSlot(now, 16), // 4 PM
        duration: 25,
        priority: 'high',
        completed: false,
        recommendedBy: 'ai',
      });
    }
    
    if (metrics.engagementScore > 80) {
      // High engagement - recommend advanced topics
      plan.push({
        id: `ai_${Date.now()}_3`,
        subject: 'Advanced Topics',
        topic: 'Challenge Problems',
        scheduledTime: this.getNextAvailableSlot(now, 18), // 6 PM
        duration: 60,
        priority: 'medium',
        completed: false,
        recommendedBy: 'ai',
      });
    }
    
    // Daily practice recommendation
    plan.push({
      id: `ai_${Date.now()}_4`,
      subject: 'Mathematics',
      topic: 'Daily Practice',
      scheduledTime: this.getNextAvailableSlot(now, 17), // 5 PM
      duration: 30,
      priority: 'medium',
      completed: false,
      recommendedBy: 'ai',
    });
    
    return plan;
  },

  getNextAvailableSlot(baseDate: Date, hour: number): number {
    const slot = new Date(baseDate);
    slot.setHours(hour, 0, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (slot.getTime() < Date.now()) {
      slot.setDate(slot.getDate() + 1);
    }
    
    return slot.getTime();
  },

  getOptimalStudyTime(metrics: PerformanceMetrics): string {
    // AI recommendation based on focus patterns
    if (metrics.focusScore > 70) {
      return 'Your focus is best in the afternoon. Schedule challenging topics between 2-5 PM.';
    } else if (metrics.focusScore > 50) {
      return 'Morning sessions recommended. Try studying between 9-11 AM for better focus.';
    } else {
      return 'Short, frequent sessions work best. Try 25-minute blocks with 5-minute breaks.';
    }
  },

  getUpcomingPlan(plan: StudyPlanItem[]): StudyPlanItem[] {
    const now = Date.now();
    return plan
      .filter(item => !item.completed && item.scheduledTime >= now)
      .sort((a, b) => a.scheduledTime - b.scheduledTime);
  },

  getTodaysPlan(plan: StudyPlanItem[]): StudyPlanItem[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return plan.filter(item => 
      item.scheduledTime >= today.getTime() && 
      item.scheduledTime < tomorrow.getTime()
    );
  },
};
