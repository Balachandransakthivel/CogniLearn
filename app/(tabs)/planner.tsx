import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { studyPlanService } from '@/services/studyPlanService';
import { StudyPlanItem } from '@/types/learning';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';
import { useAlert } from '@/template';

export default function PlannerScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { metrics } = useLearningAnalytics();
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    subject: '',
    topic: '',
    duration: '30',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    const plan = await studyPlanService.getStudyPlan();
    setStudyPlan(plan);
  };

  const generateAIPlan = async () => {
    if (!metrics) {
      showAlert('No Data', 'Complete some learning sessions first to get AI recommendations');
      return;
    }

    const aiPlan = studyPlanService.generateAIRecommendedPlan(metrics);
    
    for (const item of aiPlan) {
      await studyPlanService.addPlanItem(item);
    }
    
    await loadPlan();
    showAlert('AI Plan Generated', `Added ${aiPlan.length} personalized study sessions`);
  };

  const handleAddItem = async () => {
    if (!newItem.subject.trim() || !newItem.topic.trim()) {
      showAlert('Missing Fields', 'Please fill in subject and topic');
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    const item: StudyPlanItem = {
      id: Date.now().toString(),
      subject: newItem.subject,
      topic: newItem.topic,
      scheduledTime: tomorrow.getTime(),
      duration: parseInt(newItem.duration),
      priority: newItem.priority,
      completed: false,
      recommendedBy: 'user',
    };

    await studyPlanService.addPlanItem(item);
    await loadPlan();
    setShowAddModal(false);
    setNewItem({ subject: '', topic: '', duration: '30', priority: 'medium' });
  };

  const toggleComplete = async (item: StudyPlanItem) => {
    await studyPlanService.updatePlanItem(item.id, { completed: !item.completed });
    await loadPlan();
  };

  const deleteItem = async (id: string) => {
    await studyPlanService.deletePlanItem(id);
    await loadPlan();
  };

  const todaysPlan = studyPlanService.getTodaysPlan(studyPlan);
  const upcomingPlan = studyPlanService.getUpcomingPlan(studyPlan);
  const optimalTime = metrics ? studyPlanService.getOptimalStudyTime(metrics) : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Study Planner</Text>
            <Text style={styles.subtitle}>AI-powered scheduling</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => setShowAddModal(true)}
          >
            <MaterialIcons name="add" size={24} color="#FFF" />
          </Pressable>
        </View>

        {/* AI Recommendation */}
        {optimalTime && (
          <View style={styles.aiCard}>
            <MaterialIcons name="psychology" size={32} color={theme.colors.primary} />
            <View style={styles.aiContent}>
              <Text style={styles.aiTitle}>AI Recommendation</Text>
              <Text style={styles.aiText}>{optimalTime}</Text>
            </View>
          </View>
        )}

        {/* Generate AI Plan */}
        <Pressable
          style={({ pressed }) => [
            styles.generateButton,
            pressed && styles.generateButtonPressed,
          ]}
          onPress={generateAIPlan}
        >
          <MaterialIcons name="auto-awesome" size={20} color={theme.colors.primary} />
          <Text style={styles.generateText}>Generate AI Study Plan</Text>
        </Pressable>

        {/* Today's Plan */}
        {todaysPlan.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            {todaysPlan.map((item) => (
              <PlanItemCard
                key={item.id}
                item={item}
                onToggle={() => toggleComplete(item)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </View>
        )}

        {/* Upcoming Plan */}
        {upcomingPlan.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            {upcomingPlan.slice(0, 5).map((item) => (
              <PlanItemCard
                key={item.id}
                item={item}
                onToggle={() => toggleComplete(item)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </View>
        )}

        {studyPlan.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-available" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>No study sessions planned</Text>
            <Text style={styles.emptySubtext}>Add sessions or generate an AI plan</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + theme.spacing.md }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Study Session</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
              </Pressable>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Subject (e.g., Mathematics)"
              placeholderTextColor={theme.colors.textTertiary}
              value={newItem.subject}
              onChangeText={(text) => setNewItem({ ...newItem, subject: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Topic (e.g., Calculus)"
              placeholderTextColor={theme.colors.textTertiary}
              value={newItem.topic}
              onChangeText={(text) => setNewItem({ ...newItem, topic: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="number-pad"
              value={newItem.duration}
              onChangeText={(text) => setNewItem({ ...newItem, duration: text })}
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityButtons}>
              {(['high', 'medium', 'low'] as const).map((priority) => (
                <Pressable
                  key={priority}
                  style={[
                    styles.priorityButton,
                    newItem.priority === priority && styles.priorityButtonSelected,
                  ]}
                  onPress={() => setNewItem({ ...newItem, priority })}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    newItem.priority === priority && styles.priorityButtonTextSelected,
                  ]}>
                    {priority.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
              onPress={handleAddItem}
            >
              <Text style={styles.saveButtonText}>Add to Plan</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PlanItemCard({ 
  item, 
  onToggle, 
  onDelete 
}: { 
  item: StudyPlanItem; 
  onToggle: () => void; 
  onDelete: () => void;
}) {
  const scheduledDate = new Date(item.scheduledTime);
  const isToday = new Date().toDateString() === scheduledDate.toDateString();

  return (
    <View style={[styles.planCard, item.completed && styles.planCardCompleted]}>
      <Pressable onPress={onToggle} style={styles.checkbox}>
        <MaterialIcons 
          name={item.completed ? 'check-box' : 'check-box-outline-blank'} 
          size={24} 
          color={item.completed ? theme.colors.success : theme.colors.textSecondary} 
        />
      </Pressable>

      <View style={styles.planContent}>
        <Text style={[styles.planSubject, item.completed && styles.planTextCompleted]}>
          {item.subject}
        </Text>
        <Text style={[styles.planTopic, item.completed && styles.planTextCompleted]}>
          {item.topic}
        </Text>
        <View style={styles.planMeta}>
          <Text style={styles.planMetaText}>
            {isToday ? 'Today' : scheduledDate.toLocaleDateString()} • {item.duration}min
          </Text>
          {item.recommendedBy === 'ai' && (
            <View style={styles.aiBadge}>
              <MaterialIcons name="auto-awesome" size={12} color={theme.colors.primary} />
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.priorityIndicator, { backgroundColor: 
        item.priority === 'high' ? theme.colors.danger :
        item.priority === 'medium' ? theme.colors.warning :
        theme.colors.info
      }]} />

      <Pressable onPress={onDelete} hitSlop={8}>
        <MaterialIcons name="delete-outline" size={20} color={theme.colors.textTertiary} />
      </Pressable>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  aiCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  aiText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  generateButtonPressed: {
    opacity: 0.7,
  },
  generateText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  planCard: {
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
  planCardCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    padding: 4,
  },
  planContent: {
    flex: 1,
  },
  planSubject: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  planTopic: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  planTextCompleted: {
    textDecorationLine: 'line-through',
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: 4,
  },
  planMetaText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  priorityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    marginTop: 4,
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
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  priorityButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  priorityButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  priorityButtonTextSelected: {
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    ...theme.typography.button,
    color: '#FFF',
  },
});
