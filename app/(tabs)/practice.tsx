import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { useAlert } from '@/template';

const subjects = [
  { id: '1', name: 'Mathematics', icon: 'calculate' as const, color: theme.colors.primary },
  { id: '2', name: 'Science', icon: 'science' as const, color: theme.colors.secondary },
  { id: '3', name: 'English', icon: 'menu-book' as const, color: theme.colors.success },
  { id: '4', name: 'History', icon: 'history-edu' as const, color: theme.colors.warning },
];

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [topic, setTopic] = useState('');

  const handleStartPractice = () => {
    if (!selectedSubject) {
      showAlert('Select Subject', 'Please choose a subject to begin practice');
      return;
    }
    if (!topic.trim()) {
      showAlert('Enter Topic', 'Please enter a topic name for this practice session');
      return;
    }
    
    showAlert(
      'Practice Session Started',
      'Behavioral tracking is now active. Your response time, focus, and engagement will be analyzed.',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="school" size={32} color={theme.colors.primary} />
          <Text style={styles.title}>Start Practice Session</Text>
          <Text style={styles.subtitle}>AI will track your learning behavior</Text>
        </View>

        {/* Subject Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Subject</Text>
          <View style={styles.subjectsGrid}>
            {subjects.map((subject) => (
              <Pressable
                key={subject.id}
                style={({ pressed }) => [
                  styles.subjectCard,
                  selectedSubject === subject.id && styles.subjectCardSelected,
                  pressed && styles.subjectCardPressed,
                ]}
                onPress={() => setSelectedSubject(subject.id)}
              >
                <View style={[styles.subjectIcon, { backgroundColor: subject.color + '20' }]}>
                  <MaterialIcons name={subject.icon} size={32} color={subject.color} />
                </View>
                <Text style={[
                  styles.subjectName,
                  selectedSubject === subject.id && styles.subjectNameSelected
                ]}>
                  {subject.name}
                </Text>
                {selectedSubject === subject.id && (
                  <View style={[styles.checkmark, { backgroundColor: subject.color }]}>
                    <MaterialIcons name="check" size={16} color="#FFF" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Topic Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Topic</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Quadratic Equations, Cell Biology..."
            placeholderTextColor={theme.colors.textTertiary}
            value={topic}
            onChangeText={setTopic}
          />
        </View>

        {/* Tracking Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Track</Text>
          <View style={styles.trackingList}>
            <View style={styles.trackingItem}>
              <MaterialIcons name="timer" size={24} color={theme.colors.primary} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackingTitle}>Response Time</Text>
                <Text style={styles.trackingDesc}>Measures thinking speed and decision making</Text>
              </View>
            </View>
            <View style={styles.trackingItem}>
              <MaterialIcons name="replay" size={24} color={theme.colors.secondary} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackingTitle}>Retry Patterns</Text>
                <Text style={styles.trackingDesc}>Analyzes learning persistence and approach</Text>
              </View>
            </View>
            <View style={styles.trackingItem}>
              <MaterialIcons name="error-outline" size={24} color={theme.colors.warning} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackingTitle}>Mistake Frequency</Text>
                <Text style={styles.trackingDesc}>Identifies areas needing reinforcement</Text>
              </View>
            </View>
            <View style={styles.trackingItem}>
              <MaterialIcons name="center-focus-strong" size={24} color={theme.colors.success} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackingTitle}>Focus & Engagement</Text>
                <Text style={styles.trackingDesc}>Tracks attention and interaction quality</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={handleStartPractice}
        >
          <MaterialIcons name="play-arrow" size={24} color="#FFF" />
          <Text style={styles.startButtonText}>Start Practice Session</Text>
        </Pressable>
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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  subjectCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  subjectCardSelected: {
    borderColor: theme.colors.primary,
  },
  subjectCardPressed: {
    opacity: 0.7,
  },
  subjectIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  subjectName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  subjectNameSelected: {
    color: theme.colors.primary,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  trackingList: {
    gap: theme.spacing.sm,
  },
  trackingItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  trackingContent: {
    flex: 1,
  },
  trackingTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackingDesc: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  startButtonPressed: {
    opacity: 0.8,
  },
  startButtonText: {
    ...theme.typography.button,
    color: '#FFF',
  },
});
