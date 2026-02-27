import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { Achievement } from '@/types/learning';
import { achievementService } from '@/services/achievementService';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const { sessions } = useLearningAnalytics();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, [sessions]);

  const loadAchievements = async () => {
    const updated = await achievementService.updateAchievements(sessions);
    setAchievements(updated);
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const categories = ['streak', 'accuracy', 'focus', 'mastery', 'speed'] as const;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <View style={styles.statsCard}>
            <MaterialIcons name="emoji-events" size={32} color={theme.colors.warning} />
            <View style={styles.statsContent}>
              <Text style={styles.statsValue}>{unlockedCount}/{achievements.length}</Text>
              <Text style={styles.statsLabel}>Unlocked</Text>
            </View>
          </View>
        </View>

        {/* Achievement Categories */}
        {categories.map((category) => {
          const categoryAchievements = achievements.filter(a => a.category === category);
          const categoryUnlocked = categoryAchievements.filter(a => a.isUnlocked).length;

          return (
            <View key={category} style={styles.category}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Achievements
                </Text>
                <Text style={styles.categoryCount}>
                  {categoryUnlocked}/{categoryAchievements.length}
                </Text>
              </View>

              {categoryAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const progress = achievement.category === 'speed'
    ? Math.max(0, Math.min(100, (1 - achievement.currentProgress / (achievement.requirement * 2)) * 100))
    : Math.min(100, (achievement.currentProgress / achievement.requirement) * 100);

  return (
    <View style={[
      styles.achievementCard,
      !achievement.isUnlocked && styles.achievementCardLocked,
    ]}>
      <View style={[
        styles.iconContainer,
        achievement.isUnlocked && { backgroundColor: achievement.color + '20' },
      ]}>
        <MaterialIcons 
          name={achievement.icon as any} 
          size={32} 
          color={achievement.isUnlocked ? achievement.color : theme.colors.textTertiary} 
        />
      </View>

      <View style={styles.achievementContent}>
        <View style={styles.achievementHeader}>
          <Text style={[
            styles.achievementTitle,
            !achievement.isUnlocked && styles.textLocked,
          ]}>
            {achievement.title}
          </Text>
          {achievement.isUnlocked && (
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
          )}
        </View>

        <Text style={[
          styles.achievementDescription,
          !achievement.isUnlocked && styles.textLocked,
        ]}>
          {achievement.description}
        </Text>

        {!achievement.isUnlocked && (
          <>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: achievement.color },
              ]} />
            </View>
            <Text style={styles.progressText}>
              {achievement.category === 'speed' 
                ? `Current: ${achievement.currentProgress.toFixed(1)}s • Target: ${achievement.requirement}s`
                : `${achievement.currentProgress} / ${achievement.requirement}`
              }
            </Text>
          </>
        )}

        {achievement.isUnlocked && achievement.unlockedAt && (
          <Text style={styles.unlockedText}>
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  statsLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  category: {
    marginBottom: theme.spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  categoryCount: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  achievementCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  achievementDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  textLocked: {
    color: theme.colors.textTertiary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  unlockedText: {
    ...theme.typography.caption,
    color: theme.colors.success,
    fontWeight: '600',
  },
});
