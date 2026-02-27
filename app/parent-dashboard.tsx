import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { ParentChildLink } from '@/types/learning';
import { authService } from '@/services/authService';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';
import { useAlert } from '@/template';
import { useRouter } from 'expo-router';

export default function ParentDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { sessions, metrics, cognitivePattern } = useLearningAnalytics();
  const [childLinks, setChildLinks] = useState<ParentChildLink[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [childName, setChildName] = useState('');

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    const user = await authService.getCurrentUser();
    if (user && user.role === 'parent') {
      const links = await authService.getChildLinks(user.id);
      setChildLinks(links);
    }
  };

  const handleLinkChild = async () => {
    if (!childName.trim()) {
      showAlert('Missing Name', 'Please enter your child name');
      return;
    }

    const user = await authService.getCurrentUser();
    if (user) {
      await authService.linkChildAccount(user.id, childName);
      await loadLinks();
      setShowLinkModal(false);
      setChildName('');
      showAlert('Success', `Linked account for ${childName}`);
    }
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Parent Dashboard</Text>
            <Text style={styles.subtitle}>Monitor your child progress</Text>
          </View>
          <Pressable
            style={styles.linkButton}
            onPress={() => setShowLinkModal(true)}
          >
            <MaterialIcons name="person-add" size={24} color={theme.colors.primary} />
          </Pressable>
        </View>

        {/* Linked Children */}
        {childLinks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked Children</Text>
            {childLinks.map((link) => (
              <View key={link.id} style={styles.linkCard}>
                <MaterialIcons name="account-circle" size={40} color={theme.colors.primary} />
                <View style={styles.linkContent}>
                  <Text style={styles.linkName}>{link.childName}</Text>
                  <Text style={styles.linkDate}>
                    Linked {new Date(link.linkedAt).toLocaleDateString()}
                  </Text>
                </View>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
              </View>
            ))}
          </View>
        )}

        {/* Performance Overview */}
        {metrics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <MaterialIcons name="trending-up" size={28} color={theme.colors.success} />
                <Text style={styles.metricValue}>{metrics.accuracyTrend}%</Text>
                <Text style={styles.metricLabel}>Accuracy</Text>
              </View>
              <View style={styles.metricCard}>
                <MaterialIcons name="psychology" size={28} color={theme.colors.primary} />
                <Text style={styles.metricValue}>{metrics.focusScore}</Text>
                <Text style={styles.metricLabel}>Focus</Text>
              </View>
              <View style={styles.metricCard}>
                <MaterialIcons name="bar-chart" size={28} color={theme.colors.secondary} />
                <Text style={styles.metricValue}>{metrics.engagementScore}%</Text>
                <Text style={styles.metricLabel}>Engagement</Text>
              </View>
              <View style={styles.metricCard}>
                <MaterialIcons name="warning" size={28} color={getRiskColor()} />
                <Text style={styles.metricValue}>{metrics.riskLevel.toUpperCase()}</Text>
                <Text style={styles.metricLabel}>Risk Level</Text>
              </View>
            </View>
          </View>
        )}

        {/* Cognitive Pattern */}
        {cognitivePattern && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Style</Text>
            <View style={styles.patternCard}>
              <MaterialIcons name="psychology-alt" size={32} color={theme.colors.primary} />
              <View style={styles.patternContent}>
                <Text style={styles.patternType}>{cognitivePattern.type.toUpperCase()} LEARNER</Text>
                <Text style={styles.patternConfidence}>
                  {Math.round(cognitivePattern.confidence * 100)}% confidence
                </Text>
                <View style={styles.patternTags}>
                  {cognitivePattern.characteristics.slice(0, 2).map((char, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{char}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Recent Activity */}
        {sessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Study Sessions</Text>
            {sessions.slice(-3).reverse().map((session) => {
              const accuracy = (session.correctAnswers / session.totalQuestions) * 100;
              return (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionSubject}>{session.subject}</Text>
                    <Text style={[
                      styles.sessionAccuracy,
                      { color: accuracy >= 70 ? theme.colors.success : theme.colors.warning }
                    ]}>
                      {Math.round(accuracy)}%
                    </Text>
                  </View>
                  <Text style={styles.sessionTopic}>{session.topic}</Text>
                  <Text style={styles.sessionDate}>
                    {new Date(session.endTime).toLocaleString()}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Alerts & Recommendations */}
        {metrics && metrics.riskLevel !== 'low' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            <View style={styles.alertCard}>
              <MaterialIcons 
                name="warning" 
                size={28} 
                color={metrics.riskLevel === 'high' ? theme.colors.danger : theme.colors.warning} 
              />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>
                  {metrics.riskLevel === 'high' ? 'High Risk Detected' : 'Attention Needed'}
                </Text>
                <Text style={styles.alertText}>
                  {metrics.riskLevel === 'high' 
                    ? 'Your child may need additional support. Consider scheduling a review session.'
                    : 'Some areas showing declining performance. Monitor progress closely.'
                  }
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Pressable style={styles.actionButton} onPress={() => router.push('/history')}>
            <MaterialIcons name="history" size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>View Full History</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/(tabs)/analytics')}>
            <MaterialIcons name="insights" size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Detailed Analytics</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Link Child Modal */}
      <Modal visible={showLinkModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + theme.spacing.md }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Link Child Account</Text>
              <Pressable onPress={() => setShowLinkModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
              </Pressable>
            </View>

            <Text style={styles.modalDescription}>
              Enter your child name to link their learning account
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Child Name"
              placeholderTextColor={theme.colors.textTertiary}
              value={childName}
              onChangeText={setChildName}
            />

            <Pressable
              style={({ pressed }) => [
                styles.linkSubmitButton,
                pressed && styles.linkSubmitButtonPressed,
              ]}
              onPress={handleLinkChild}
            >
              <Text style={styles.linkSubmitText}>Link Account</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  linkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  linkContent: {
    flex: 1,
  },
  linkName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  linkDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metricValue: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    marginTop: theme.spacing.xs,
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  patternCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  patternContent: {
    flex: 1,
  },
  patternType: {
    ...theme.typography.h4,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  patternConfidence: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  patternTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionSubject: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  sessionAccuracy: {
    ...theme.typography.body,
    fontWeight: '700',
  },
  sessionTopic: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  sessionDate: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  alertCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.warning + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.warning + '40',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  modalDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  linkSubmitButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  linkSubmitButtonPressed: {
    opacity: 0.8,
  },
  linkSubmitText: {
    ...theme.typography.button,
    color: '#FFF',
  },
});
