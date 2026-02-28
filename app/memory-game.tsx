import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

const ICONS: any[] = ['pets', 'star', 'favorite', 'lightbulb', 'eco', 'rocket-launch', 'science', 'psychology'];

export default function MemoryGameScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [cards, setCards] = useState<{ id: number, icon: any, isFlipped: boolean, isMatched: boolean }[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const shuffled = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }));
        setCards(shuffled);
        setFlippedIndices([]);
        setMoves(0);
        setMatches(0);
    };

    const handleCardPress = (index: number) => {
        if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        if (newFlippedIndices.length === 2) {
            setMoves(m => m + 1);
            const [firstIndex, secondIndex] = newFlippedIndices;

            if (cards[firstIndex].icon === cards[secondIndex].icon) {
                // Match!
                setTimeout(() => {
                    const matchedCards = [...cards];
                    matchedCards[firstIndex].isMatched = true;
                    matchedCards[secondIndex].isMatched = true;
                    setCards(matchedCards);
                    setFlippedIndices([]);
                    const newMatches = matches + 1;
                    setMatches(newMatches);
                    if (newMatches === ICONS.length) {
                        Alert.alert('Congratulations!', `You completed the game in ${moves + 1} moves!`, [
                            { text: 'Play Again', onPress: initializeGame },
                            { text: 'Go Back', onPress: () => router.back() }
                        ]);
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[firstIndex].isFlipped = false;
                    resetCards[secondIndex].isFlipped = false;
                    setCards(resetCards);
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </Pressable>
                <Text style={styles.title}>Memory Match</Text>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Moves: {moves}</Text>
                </View>
            </View>

            <View style={styles.gameBoard}>
                <Text style={styles.instructionText}>Find all matching pairs!</Text>

                <View style={styles.grid}>
                    {cards.map((card, index) => (
                        <Pressable
                            key={card.id}
                            style={[
                                styles.card,
                                (card.isFlipped || card.isMatched) ? styles.cardFlipped : styles.cardHidden
                            ]}
                            onPress={() => handleCardPress(index)}
                        >
                            {(card.isFlipped || card.isMatched) ? (
                                <MaterialIcons name={card.icon} size={40} color={card.isMatched ? theme.colors.success : theme.colors.primary} />
                            ) : (
                                <Text style={styles.cardQuestionMark}>?</Text>
                            )}
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
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.round,
    },
    scoreText: {
        ...theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    gameBoard: {
        flex: 1,
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    instructionText: {
        ...theme.typography.h3,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        width: '100%',
        maxWidth: 400,
    },
    card: {
        width: '21%', // 4 columns
        aspectRatio: 1,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.small,
    },
    cardHidden: {
        backgroundColor: theme.colors.primary,
    },
    cardFlipped: {
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.primary + '30',
    },
    cardQuestionMark: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    }
});
