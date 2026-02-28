import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';
import { MetricCard } from '@/components/ui/MetricCard';
import { CognitivePatternCard } from '@/components/feature/CognitivePatternCard';
import { RecommendationCard } from '@/components/feature/RecommendationCard';
import { SessionHistoryCard } from '@/components/feature/SessionHistoryCard';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { sessions, metrics, recommendations, cognitivePattern, loading, refresh } = useLearningAnalytics();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const getRiskColor = () => {
    if (!metrics) return theme.colors.textSecondary;
    switch (metrics.riskLevel) {
      case 'high': return theme.colors.danger;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <LinearGradient colors={[theme.colors.primary, '#9C27B0']} style={styles.headerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View>
            <Text style={styles.greeting}>Learning Analytics</Text>
            <Text style={styles.subtitle}>Welcome back, keep learning!</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.profileButton,
              pressed && styles.profileButtonPressed
            ]}
            onPress={() => router.push('/profile')}
          >
            <MaterialIcons name="account-circle" size={48} color="#FFFFFF" />
          </Pressable>
        </LinearGradient>

        {/* Key Metrics Grid */}
        {metrics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Focus Score"
                value={metrics.focusScore}
                icon="center-focus-strong"
                color={theme.colors.primary}
                trend={metrics.focusScore >= 70 ? 'up' : 'down'}
                trendValue={`${metrics.focusScore >= 70 ? '+' : ''}${Math.abs(metrics.focusScore - 70)}`}
              />
              <MetricCard
                title="Distraction Index"
                value="Low"
                icon="mobile-off"
                color={theme.colors.secondary}
                trend={metrics.engagementScore >= 70 ? 'up' : 'neutral'}
                trendValue={`${metrics.engagementScore}%`}
              />
            </View>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Consistency Score"
                value="85%"
                subtitle="Daily habit"
                icon="event-available"
                color={theme.colors.success}
              />
              <MetricCard
                title="Learning Speed"
                value={metrics.learningSpeed}
                subtitle="Questions/min"
                icon="speed"
                color={theme.colors.warning}
              />
            </View>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Weekly Growth"
                value={`${metrics.weeklyGrowth > 0 ? '+' : ''}${metrics.weeklyGrowth}%`}
                icon="insights"
                color={metrics.weeklyGrowth >= 0 ? theme.colors.success : theme.colors.danger}
                trend={metrics.weeklyGrowth >= 0 ? 'up' : 'down'}
              />
              <MetricCard
                title="Exam Readiness"
                value="72%"
                icon="online-prediction"
                color={theme.colors.success}
              />
            </View>
          </View>
        )}

        {/* Interactive Learning Games */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 12, fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary }]}>Boost Your Skills</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            <Pressable
              style={({ pressed }) => [
                styles.gameCard,
                { width: 260, marginTop: 0 },
                pressed && styles.gameCardPressed
              ]}
              onPress={() => (router.push as any)('/game')}
            >
              <View style={styles.gameCardContent}>
                <View style={styles.gameIconContainer}>
                  <MaterialIcons name="calculate" size={32} color={theme.colors.textPrimary} />
                </View>
                <View style={styles.gameTextContainer}>
                  <Text style={styles.gameTitle}>Math</Text>
                  <Text style={styles.gameSubtitle}>Boost math focus!</Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.gameCard,
                { width: 260, marginTop: 0, backgroundColor: theme.colors.secondary },
                pressed && styles.gameCardPressed
              ]}
              onPress={() => (router.push as any)('/memory-game')}
            >
              <View style={styles.gameCardContent}>
                <View style={styles.gameIconContainer}>
                  <MaterialIcons name="psychology" size={32} color={theme.colors.textPrimary} />
                </View>
                <View style={styles.gameTextContainer}>
                  <Text style={styles.gameTitle}>Memory Match</Text>
                  <Text style={styles.gameSubtitle}>Improve cognitive recall</Text>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </View>
        {/* Cognitive Pattern */}
        {cognitivePattern && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Pattern Analysis</Text>
            <CognitivePatternCard
              pattern={cognitivePattern}
              onViewDetails={() => router.push('/pattern-details')}
            />
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
              <Text style={styles.sectionCount}>{recommendations.length}</Text>
            </View>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onPress={() => { }}
              />
            ))}
          </View>
        )}

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Learning Sessions</Text>
              <Pressable onPress={() => router.push('/history')}>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>
            {sessions.slice(-5).reverse().map((session) => (
              <SessionHistoryCard key={session.id} session={session} />
            ))}
          </View>
        )}
      </ScrollView>
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
  scrollContent: {
    padding: theme.spacing.md,
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.medium,
  },
  greeting: {
    ...theme.typography.h2,
    color: '#FFFFFF',
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  profileButton: {
    borderRadius: theme.borderRadius.round,
  },
  profileButtonPressed: {
    opacity: 0.7,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  sectionCount: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  viewAllText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  gameCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  gameCardPressed: {
    opacity: 0.8,
  },
  gameCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  gameTextContainer: {
    flex: 1,
  },
  gameTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  gameSubtitle: {
    ...theme.typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
