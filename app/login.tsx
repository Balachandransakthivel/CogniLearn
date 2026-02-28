import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import api from '@/utils/api'; // Ensure axios is installed and this is correct

export default function LoginScreen() {
    const { role } = useLocalSearchParams<{ role: 'student' | 'parent' | 'teacher' }>();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Styling differentiation based on role
    const isStudent = role === 'student';
    const isParent = role === 'parent';
    const isTeacher = role === 'teacher';

    const mainColor = isStudent ? theme.colors.primary : (isParent ? theme.colors.secondaryDark : theme.colors.success);
    const iconName = isStudent ? 'school' : (isParent ? 'family-restroom' : 'menu-book');
    const title = isStudent ? 'Student Login' : (isParent ? 'Parent Portal' : 'Teacher Dashboard');
    const subtitle = isStudent ? 'Welcome back! Ready to learn?' : (isParent ? 'Monitor your child\'s progress' : 'Manage class AI insights & predictions');
    const bgOpacity = isStudent ? 'rgba(108, 92, 231, 0.1)' : (isParent ? 'rgba(0, 184, 230, 0.1)' : 'rgba(76, 175, 80, 0.1)');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Call FastAPI backend
            const response = await api.post('/auth/login', {
                email,
                password
            });

            // Make sure the role they are logging in as matches the selected role
            if (response.data.role !== role) {
                Alert.alert('Role Mismatch', `This account is registered as a ${response.data.role}. Please log in using the correct portal.`);
                return;
            }

            // On success, navigate to the correct dashboard
            if (role === 'student') {
                router.replace('/(tabs)');
            } else if (role === 'parent') {
                router.replace('/parent-dashboard');
            } else {
                router.replace('/teacher-dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            Alert.alert('Login Failed', error.response?.data?.detail || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = () => {
        if (role === 'student') {
            router.replace('/(tabs)');
        } else if (role === 'parent') {
            router.replace('/parent-dashboard');
        } else {
            router.replace('/teacher-dashboard');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={28} color={theme.colors.textPrimary} />
            </Pressable>

            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: bgOpacity }]}>
                    <MaterialIcons name={iconName} size={50} color={mainColor} />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <View style={styles.form}>
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
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    )}
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.quickLoginButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleQuickLogin}
                >
                    <MaterialIcons name="bolt" size={24} color={mainColor} style={styles.quickLoginIcon} />
                    <Text style={[styles.quickLoginText, { color: mainColor }]}>Quick Demo Login</Text>
                </Pressable>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <Pressable onPress={() => router.push(`/register?role=${role}` as any)}>
                        <Text style={[styles.registerLink, { color: mainColor }]}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.xl,
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
    quickLoginButton: {
        height: 56,
        borderRadius: theme.borderRadius.lg,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.border,
    },
    quickLoginIcon: {
        marginRight: theme.spacing.sm,
    },
    quickLoginText: {
        ...theme.typography.h3,
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
