import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

export default function GameScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState({ num1: 0, num2: 0, operator: '+' });
    const [options, setOptions] = useState<number[]>([]);

    const generateQuestion = (currentScore: number = 0) => {
        const operators = ['+', '-'];
        if (currentScore >= 50) operators.push('*');
        if (currentScore >= 100) operators.push('/');

        const operator = operators[Math.floor(Math.random() * operators.length)];

        let maxNum = 10;
        if (currentScore >= 30) maxNum = 20;
        if (currentScore >= 80) maxNum = 50;
        if (currentScore >= 150) maxNum = 100;

        let num1 = Math.floor(Math.random() * maxNum) + 1;
        let num2 = Math.floor(Math.random() * maxNum) + 1;

        // Ensure no negative answers and cleanly divisible division
        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        } else if (operator === '/') {
            num1 = num1 * num2; // guarantees num1 / num2 is an integer
        }

        let answer = 0;
        if (operator === '+') answer = num1 + num2;
        else if (operator === '-') answer = num1 - num2;
        else if (operator === '*') answer = num1 * num2;
        else if (operator === '/') answer = num1 / num2;

        const newOptions: number[] = [answer];
        while (newOptions.length < 4) {
            // Generate realistic incorrect options near the actual answer
            const variant = currentScore >= 80 ? 20 : 10;
            const wrongAnswer = answer + Math.floor(Math.random() * variant) - (variant / 2);
            if (!newOptions.includes(wrongAnswer) && wrongAnswer >= 0) {
                newOptions.push(wrongAnswer);
            }
        }

        setQuestion({ num1, num2, operator });
        setOptions(newOptions.sort(() => Math.random() - 0.5));
    };

    useEffect(() => {
        generateQuestion(score);
    }, []);

    const handleAnswer = (selected: number) => {
        let correctAnswer = 0;
        if (question.operator === '+') correctAnswer = question.num1 + question.num2;
        else if (question.operator === '-') correctAnswer = question.num1 - question.num2;
        else if (question.operator === '*') correctAnswer = question.num1 * question.num2;
        else if (question.operator === '/') correctAnswer = question.num1 / question.num2;

        if (selected === correctAnswer) {
            const nextScore = score + 10;
            setScore(nextScore);
            generateQuestion(nextScore);
        } else {
            const nextScore = Math.max(0, score - 5);
            setScore(nextScore);
            Alert.alert('Oops!', 'That was incorrect. Try another one!', [
                { text: 'OK', onPress: () => generateQuestion(nextScore) }
            ]);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </Pressable>
                <Text style={styles.title}>Quick Math Learning</Text>
                <View style={styles.scoreContainer}>
                    <MaterialIcons name="stars" size={24} color={theme.colors.warning} />
                    <Text style={styles.scoreText}>{score}</Text>
                </View>
            </View>

            <View style={styles.gameBoard}>
                <Text style={styles.instructionText}>Solve the problem!</Text>
                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>
                        {question.num1} {question.operator} {question.num2} = ?
                    </Text>
                </View>

                <View style={styles.optionsGrid}>
                    {options.map((option, index) => (
                        <Pressable
                            key={index}
                            style={({ pressed }) => [
                                styles.optionButton,
                                pressed && styles.optionButtonPressed
                            ]}
                            onPress={() => handleAnswer(option)}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface,
    },
    backButton: {
        padding: theme.spacing.sm,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.round,
    },
    scoreText: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
        marginLeft: 4,
    },
    gameBoard: {
        flex: 1,
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionText: {
        ...theme.typography.h2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl,
    },
    questionCard: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        width: '100%',
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
        elevation: 4,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    questionText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.md,
        width: '100%',
    },
    optionButton: {
        backgroundColor: theme.colors.surface,
        width: '45%',
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary + '40',
    },
    optionButtonPressed: {
        backgroundColor: theme.colors.primary + '20',
        borderColor: theme.colors.primary,
    },
    optionText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});
