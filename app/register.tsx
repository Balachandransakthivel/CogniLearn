import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import api from '@/utils/api';

export default function RegisterScreen() {
    const { role } = useLocalSearchParams<{ role: 'student' | 'parent' | 'teacher' }>();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Styling differentiation based on role
    const isStudent = role === 'student';
    const isParent = role === 'parent';
    const isTeacher = role === 'teacher';

    const mainColor = isStudent ? theme.colors.primary : (isParent ? theme.colors.secondaryDark : theme.colors.success);
    const iconName = isStudent ? 'school' : (isParent ? 'family-restroom' : 'menu-book');
    const title = isStudent ? 'Student Registration' : (isParent ? 'Parent Registration' : 'Teacher Registration');
    const subtitle = isStudent ? 'Create your account to start learning' : (isParent ? 'Create an account to monitor progress' : 'Create an account to manage your class insights');
    const bgOpacity = isStudent ? 'rgba(108, 92, 231, 0.1)' : (isParent ? 'rgba(0, 184, 230, 0.1)' : 'rgba(76, 175, 80, 0.1)');

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Call FastAPI backend to register
            await api.post('/auth/register', {
                username,
                email,
                password,
                role
            });

            Alert.alert('Success', 'Account created successfully! Please log in.');
            router.replace(`/login?role=${role}` as any);

        } catch (error: any) {
            console.error('Registration error:', error.response?.data || error.message);
            Alert.alert('Registration Failed', error.response?.data?.detail || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={28} color={theme.colors.textPrimary} />
            </Pressable>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[styles.logoContainer, { backgroundColor: bgOpacity }]}>
                        <MaterialIcons name={iconName} size={50} color={mainColor} />
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="person" size={24} color={theme.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            autoCapitalize="words"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="email" size={24} color={theme.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} color={theme.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.loginButton,
                            { backgroundColor: mainColor },
                            pressed && styles.buttonPressed,
                            loading && styles.buttonDisabled
                        ]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign Up</Text>
                        )}
                    </Pressable>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Already have an account? </Text>
                        <Pressable onPress={() => router.push(`/login?role=${role}` as any)}>
                            <Text style={[styles.registerLink, { color: mainColor }]}>Log In</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.xl,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xxl,
    },
    backButton: {
        marginTop: theme.spacing.md,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xxl,
    },
    logoContainer: {
        width: 100,
        height: 100,
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
    form: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        height: 56,
    },
    inputIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        ...theme.typography.body,
        color: theme.colors.textPrimary,
        height: '100%',
    },
    loginButton: {
        height: 56,
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        ...theme.shadows.medium,
    },
    buttonPressed: {
        opacity: 0.9,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        ...theme.typography.h3,
        color: '#FFFFFF',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
    },
    registerText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    registerLink: {
        ...theme.typography.body,
        fontWeight: 'bold',
    },
});
