import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function DemoLoginScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleLogin = (role: 'student' | 'parent') => {
        // In a real app, you would set authentication state here
        if (role === 'student') {
            router.replace('/(tabs)');
        } else {
            router.push('/parent-dashboard');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <MaterialIcons name="psychology" size={60} color={theme.colors.primary} />
                </View>
                <Text style={styles.title}>CogniLearn</Text>
                <Text style={styles.subtitle}>AI-Powered Learning Analytics</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Select Demo Role</Text>
                <Text style={styles.sectionDescription}>
                    Choose a role below to explore the application and view the analytical capabilities.
                </Text>

                <Pressable
                    style={({ pressed }) => [
                        styles.roleCard,
                        styles.studentCard,
                        pressed && styles.roleCardPressed
                    ]}
                    onPress={() => handleLogin('student')}
                >
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="school" size={40} color={theme.colors.primary} />
                    </View>
                    <View style={styles.roleInfo}>
                        <Text style={styles.roleTitle}>Student Demo</Text>
                        <Text style={styles.roleSubtitle}>Access learning tools & focus analytics</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={24} color={theme.colors.primary} />
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.roleCard,
                        styles.parentCard,
                        pressed && styles.roleCardPressed
                    ]}
                    onPress={() => handleLogin('parent')}
                >
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="family-restroom" size={40} color={theme.colors.secondaryDark} />
                    </View>
                    <View style={styles.roleInfo}>
                        <Text style={styles.roleTitle}>Parent Demo</Text>
                        <Text style={styles.roleSubtitle}>Monitor overall progress & insights</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={24} color={theme.colors.secondaryDark} />
                </Pressable>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Demonstration Environment</Text>
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
        alignItems: 'center',
        marginTop: theme.spacing.xxl,
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        borderRadius: theme.borderRadius.round,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h2,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    sectionDescription: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl,
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.medium,
    },
    studentCard: {
        borderColor: 'rgba(108, 92, 231, 0.3)',
    },
    parentCard: {
        borderColor: 'rgba(0, 184, 230, 0.3)',
    },
    roleCardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: theme.borderRadius.round,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    roleInfo: {
        flex: 1,
    },
    roleTitle: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    roleSubtitle: {
        ...theme.typography.bodySmall,
        color: theme.colors.textSecondary,
    },
    footer: {
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    footerText: {
        ...theme.typography.caption,
        color: theme.colors.textTertiary,
    },
});
