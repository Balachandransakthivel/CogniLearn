import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { quizService } from '@/services/quizService';
import { learningDataService } from '@/services/learningDataService';
import { QuizSession, BehavioralMetrics } from '@/types/learning';
import { useAlert } from '@/template';

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [focusStartTime] = useState(Date.now());

  useEffect(() => {
    loadActiveQuiz();
  }, []);

  const loadActiveQuiz = async () => {
    const active = await quizService.getActiveQuiz();
    setQuizSession(active);
  };

  const handleStartQuiz = async (subject: string) => {
    const session = await quizService.startQuiz(subject, 'Mixed Topics');
    setQuizSession(session);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !quizSession) return;

    const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setShowFeedback(true);

    setTimeout(async () => {
      const updatedSession = await quizService.submitAnswer(quizSession, selectedAnswer);
      
      if (!updatedSession.isActive) {
        // Quiz completed
        await handleQuizComplete(updatedSession);
      } else {
        setQuizSession(updatedSession);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }, 1500);
  };

  const handleQuizComplete = async (session: QuizSession) => {
    const results = quizService.calculateQuizResults(session);
    
    // Save to learning session
    const behavioralData: BehavioralMetrics = {
      responseTimesMs: session.responseTimes,
      retryPatterns: session.retries,
      mistakeFrequency: (session.questions.length - results.correctAnswers) / session.questions.length,
      focusScore: results.focusScore,
      engagementLevel: results.engagementScore,
      webSearchCount: 0,
      aiSearchCount: 0,
    };

    await learningDataService.saveLearningSession({
      id: session.id,
      subject: session.subject,
      topic: session.topic,
      startTime: session.startTime,
      endTime: Date.now(),
      totalQuestions: session.questions.length,
      correctAnswers: results.correctAnswers,
      behavioralData,
    });

    await quizService.endQuiz();

    showAlert(
      'Quiz Complete!',
      `Score: ${results.correctAnswers}/${session.questions.length}\nAccuracy: ${Math.round(results.accuracy)}%\nFocus Score: ${results.focusScore}`,
      [
        {
          text: 'View Analytics',
          onPress: () => router.push('/(tabs)/analytics'),
        },
        {
          text: 'Done',
          onPress: () => {
            setQuizSession(null);
            setSelectedAnswer(null);
            setShowFeedback(false);
          },
        },
      ]
    );
  };

  const handleRetry = async () => {
    if (!quizSession) return;
    const updated = await quizService.recordRetry(quizSession);
    setQuizSession(updated);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (!quizSession) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <MaterialIcons name="quiz" size={64} color={theme.colors.primary} />
            <Text style={styles.title}>Live Practice Quiz</Text>
            <Text style={styles.subtitle}>AI tracks your learning behavior in real-time</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Subject</Text>
            {['Mathematics', 'Science', 'English', 'History'].map((subject) => (
              <Pressable
                key={subject}
                style={({ pressed }) => [
                  styles.subjectButton,
                  pressed && styles.subjectButtonPressed,
                ]}
                onPress={() => handleStartQuiz(subject)}
              >
                <MaterialIcons 
                  name={
                    subject === 'Mathematics' ? 'calculate' :
                    subject === 'Science' ? 'science' :
                    subject === 'English' ? 'menu-book' : 'history-edu'
                  } 
                  size={32} 
                  color={theme.colors.primary} 
                />
                <View style={styles.subjectContent}>
                  <Text style={styles.subjectName}>{subject}</Text>
                  <Text style={styles.subjectDesc}>10 questions • Mixed difficulty</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
              </Pressable>
            ))}
          </View>

          <View style={styles.trackingInfo}>
            <Text style={styles.trackingTitle}>What We Track</Text>
            <View style={styles.trackingItem}>
              <MaterialIcons name="timer" size={20} color={theme.colors.primary} />
              <Text style={styles.trackingText}>Response time per question</Text>
            </View>
            <View style={styles.trackingItem}>
              <MaterialIcons name="replay" size={20} color={theme.colors.secondary} />
              <Text style={styles.trackingText}>Retry patterns and persistence</Text>
            </View>
            <View style={styles.trackingItem}>
              <MaterialIcons name="trending-up" size={20} color={theme.colors.success} />
              <Text style={styles.trackingText}>Focus and engagement levels</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
  const progress = ((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.quizHeader}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <Pressable onPress={() => {
          showAlert('Exit Quiz?', 'Your progress will be lost', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', style: 'destructive', onPress: async () => {
              await quizService.endQuiz();
              setQuizSession(null);
            }},
          ]);
        }}>
          <MaterialIcons name="close" size={28} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView style={styles.quizContent} contentContainerStyle={styles.quizScrollContent}>
        <View style={styles.questionCard}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{currentQuestion.difficulty.toUpperCase()}</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswer;
            
            let optionStyle = styles.optionButton;
            if (showFeedback) {
              if (isCorrectAnswer) {
                optionStyle = styles.optionCorrect;
              } else if (isSelected && !isCorrect) {
                optionStyle = styles.optionWrong;
              }
            } else if (isSelected) {
              optionStyle = styles.optionSelected;
            }

            return (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.option,
                  optionStyle,
                  pressed && !showFeedback && styles.optionPressed,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={showFeedback}
              >
                <View style={styles.optionNumber}>
                  <Text style={styles.optionNumberText}>{String.fromCharCode(65 + index)}</Text>
                </View>
                <Text style={styles.optionText}>{option}</Text>
                {showFeedback && isCorrectAnswer && (
                  <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <MaterialIcons name="cancel" size={24} color={theme.colors.danger} />
                )}
              </Pressable>
            );
          })}
        </View>

        {showFeedback && !isCorrect && (
          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <MaterialIcons name="replay" size={20} color={theme.colors.warning} />
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        )}
      </ScrollView>

      {!showFeedback && (
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              selectedAnswer === null && styles.submitButtonDisabled,
              pressed && styles.submitButtonPressed,
            ]}
            onPress={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  subjectButton: {
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
  subjectButtonPressed: {
    opacity: 0.7,
  },
  subjectContent: {
    flex: 1,
  },
  subjectName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  subjectDesc: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  trackingInfo: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  trackingTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  trackingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  trackingText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  quizContent: {
    flex: 1,
  },
  quizScrollContent: {
    padding: theme.spacing.md,
  },
  questionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  difficultyText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  questionText: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
  },
  optionButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  optionSelected: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  optionCorrect: {
    backgroundColor: theme.colors.success + '20',
    borderColor: theme.colors.success,
  },
  optionWrong: {
    backgroundColor: theme.colors.danger + '20',
    borderColor: theme.colors.danger,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionNumberText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  retryText: {
    ...theme.typography.body,
    color: theme.colors.warning,
    fontWeight: '600',
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonText: {
    ...theme.typography.button,
    color: '#FFF',
  },
});
