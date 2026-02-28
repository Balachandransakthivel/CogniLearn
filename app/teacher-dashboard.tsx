import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data for "Unique AI Features"
const CLASS_METRICS = {
    totalStudents: 32,
    focusAverage: 74,
    studentsAtRisk: 3,
    topPerformer: 'Bala',
    examReadiness: 72,
    improvementNeeded: 'Calculus',
    riskLevel: 'Low',
};

const STUDENTS_LIST = [
    { id: 1, name: 'Arun', focus: 65, type: 'Visual + Practice', risk: 'Medium', weakArea: 'Mathematics', attention: 'Medium' },
    { id: 2, name: 'Bala', focus: 92, type: 'Analytical', risk: 'Good', weakArea: 'None', attention: 'High' },
    { id: 3, name: 'Charlie', focus: 45, type: 'Kinesthetic', risk: 'High Risk', weakArea: 'Physics', attention: 'Low' },
    { id: 4, name: 'David', focus: 78, type: 'Reading/Writing', risk: 'Good', weakArea: 'Chemistry', attention: 'High' },
];

export default function TeacherDashboardScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const getExamReadinessColor = (score: number) => {
        if (score >= 80) return theme.colors.success;
        if (score >= 60) return theme.colors.warning;
        return theme.colors.danger;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.headerBar}>
                <Text style={styles.headerTitle}>Teacher Portal</Text>
                <Pressable onPress={() => router.replace('/')}>
                    <MaterialIcons name="logout" size={24} color={theme.colors.textPrimary} />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. Class Overview Dashboard */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Class Dashboard</Text>
                    <View style={styles.overviewGrid}>
                        <View style={[styles.overviewCard, { backgroundColor: 'rgba(108, 92, 231, 0.1)' }]}>
                            <Text style={styles.overviewValue}>{CLASS_METRICS.totalStudents}</Text>
                            <Text style={styles.overviewLabel}>Total Students</Text>
                        </View>
                        <View style={[styles.overviewCard, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                            <Text style={[styles.overviewValue, { color: theme.colors.success }]}>{CLASS_METRICS.focusAverage}%</Text>
                            <Text style={styles.overviewLabel}>Avg Focus</Text>
                        </View>
                        <View style={[styles.overviewCard, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                            <Text style={[styles.overviewValue, { color: theme.colors.warning }]}>{CLASS_METRICS.studentsAtRisk}</Text>
                            <Text style={[styles.overviewLabel, { color: theme.colors.warning }]}>At Risk</Text>
                        </View>
                    </View>

                    <View style={styles.topPerformerContainer}>
                        <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
                        <Text style={styles.topPerformerText}> Top Performer: <Text style={{ fontWeight: 'bold' }}>{CLASS_METRICS.topPerformer}</Text></Text>
                    </View>
                </View>

                {/* 1. Exam Readiness Prediction (WOW Feature) */}
                <LinearGradient
                    colors={[theme.colors.success, '#1B5E20']}
                    style={styles.predictionCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.predictionHeader}>
                        <MaterialIcons name="online-prediction" size={32} color="#FFFFFF" />
                        <Text style={styles.predictionTitle}>AI Exam Readiness Predictor</Text>
                    </View>
                    <View style={styles.predictionContent}>
                        <View style={styles.predictionMain}>
                            <Text style={styles.predictionScore}>{CLASS_METRICS.examReadiness}%</Text>
                            <Text style={styles.predictionLabel}>Class Average</Text>
                        </View>
                        <View style={styles.predictionDetails}>
                            <Text style={styles.predictionText}>Needs Work: {CLASS_METRICS.improvementNeeded}</Text>
                            <Text style={styles.predictionText}>Risk Level: {CLASS_METRICS.riskLevel}</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* 3. Student List Management & At-Risk Detection */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Student Roster</Text>
                        <Pressable>
                            <MaterialIcons name="filter-list" size={24} color={theme.colors.textSecondary} />
                        </Pressable>
                    </View>

                    {STUDENTS_LIST.map(student => {
                        let riskColor = theme.colors.success;
                        let riskIcon: any = "check-circle";
                        if (student.risk === 'High Risk') {
                            riskColor = theme.colors.danger;
                            riskIcon = "error";
                        } else if (student.risk === 'Medium') {
                            riskColor = theme.colors.warning;
                            riskIcon = "warning";
                        }

                        return (
                            <View key={student.id} style={styles.studentListCard}>
                                <View style={styles.studentListHeader}>
                                    <View style={styles.studentNameContainer}>
                                        <Text style={styles.studentListName}>{student.name}</Text>
                                        <Text style={styles.studentListType}>{student.type}</Text>
                                    </View>
                                    <View style={styles.riskBadgeContainer}>
                                        <MaterialIcons name={riskIcon} size={16} color={riskColor} />
                                        <Text style={[styles.riskBadgeText, { color: riskColor }]}>{student.risk}</Text>
                                    </View>
                                </View>

                                <View style={styles.studentDetailsRow}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Focus</Text>
                                        <Text style={styles.detailValue}>{student.focus}%</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Attention</Text>
                                        <Text style={styles.detailValue}>{student.attention}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Weak Area</Text>
                                        <Text style={styles.detailValue}>{student.weakArea}</Text>
                                    </View>
                                </View>

                                <View style={styles.studentActionsRow}>
                                    <Pressable style={styles.actionBtn}>
                                        <MaterialIcons name="assignment" size={16} color={theme.colors.primary} />
                                        <Text style={styles.actionBtnText}>Assign Task</Text>
                                    </Pressable>
                                    <Pressable style={styles.actionBtn}>
                                        <MaterialIcons name="feedback" size={16} color={theme.colors.secondaryDark} />
                                        <Text style={styles.actionBtnText}>Feedback</Text>
                                    </Pressable>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* 4. Performance Analytics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Performance Analytics</Text>
                    <View style={styles.analyticsCard}>
                        <View style={styles.analyticsRow}>
                            <View style={styles.analyticsMetric}>
                                <Text style={styles.analyticsValue}>+12%</Text>
                                <Text style={styles.analyticsLabel}>Weekly Improvement</Text>
                            </View>
                            <View style={styles.analyticsMetric}>
                                <Text style={styles.analyticsValue}>85%</Text>
                                <Text style={styles.analyticsLabel}>Study Consistency</Text>
                            </View>
                            <View style={styles.analyticsMetric}>
                                <Text style={styles.analyticsValue}>+8%</Text>
                                <Text style={styles.analyticsLabel}>Accuracy Trend</Text>
                            </View>
                        </View>
                        {/* Placeholder for simple visual representation of a graph */}
                        <View style={styles.graphPlaceholder}>
                            <View style={[styles.graphBar, { height: '30%' }]} />
                            <View style={[styles.graphBar, { height: '50%' }]} />
                            <View style={[styles.graphBar, { height: '40%' }]} />
                            <View style={[styles.graphBar, { height: '70%' }]} />
                            <View style={[styles.graphBar, { height: '60%' }]} />
                            <View style={[styles.graphBar, { height: '90%', backgroundColor: theme.colors.primary }]} />
                        </View>
                    </View>
                </View>

                {/* 5. AI Study Strategy & Auto Reports */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Automations & Approvals</Text>

                    <Pressable style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(108, 92, 231, 0.1)' }]}>
                            <MaterialIcons name="compare-arrows" size={28} color={theme.colors.primary} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Class Comparison Analytics</Text>
                            <Text style={styles.actionSubtitle}>Analyze focus and learning styles</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
                    </Pressable>

                    <Pressable style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 184, 230, 0.1)' }]}>
                            <MaterialIcons name="picture-as-pdf" size={28} color={theme.colors.secondaryDark} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Auto Generated Class Report</Text>
                            <Text style={styles.actionSubtitle}>Export automated class summary to PDF</Text>
                        </View>
                        <MaterialIcons name="file-download" size={24} color={theme.colors.secondaryDark} />
                    </Pressable>

                    <Pressable style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                            <MaterialIcons name="fact-check" size={28} color={theme.colors.warning} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Approve AI Recommendations</Text>
                            <Text style={styles.actionSubtitle}>Review system-generated study plans</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
                    </Pressable>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.textPrimary,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
    },
    predictionCard: {
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        ...theme.shadows.medium,
    },
    predictionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    predictionTitle: {
        ...theme.typography.h3,
        color: '#FFFFFF',
        marginLeft: theme.spacing.sm,
    },
    predictionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    predictionMain: {
        alignItems: 'center',
    },
    predictionScore: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    predictionLabel: {
        ...theme.typography.bodySmall,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    predictionDetails: {
        flex: 1,
        marginLeft: theme.spacing.xl,
        paddingLeft: theme.spacing.md,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    },
    predictionText: {
        ...theme.typography.body,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    analyticsCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        ...theme.shadows.small,
    },
    analyticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
    },
    analyticsMetric: {
        alignItems: 'center',
    },
    analyticsValue: {
        ...theme.typography.h3,
        color: theme.colors.primary,
    },
    analyticsLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    graphPlaceholder: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    graphBar: {
        width: 30,
        backgroundColor: 'rgba(108, 92, 231, 0.3)',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    overviewGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    overviewCard: {
        flex: 1,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    overviewValue: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        marginBottom: 4,
    },
    overviewLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    topPerformerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    topPerformerText: {
        ...theme.typography.body,
        color: theme.colors.textPrimary,
        marginLeft: 8,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    studentListCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.small,
    },
    studentListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    studentNameContainer: {
        flex: 1,
    },
    studentListName: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
    },
    studentListType: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    riskBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    riskBadgeText: {
        ...theme.typography.caption,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    studentDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    detailValue: {
        ...theme.typography.bodySmall,
        color: theme.colors.textPrimary,
        fontWeight: 'bold',
        marginTop: 2,
    },
    studentActionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
    },
    actionBtnText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        ...theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    actionSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
});
