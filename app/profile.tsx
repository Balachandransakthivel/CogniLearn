
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useAlert } from '@/template';

export default function ProfileScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => {
          showAlert('Logged Out', 'You have been successfully logged out');
          router.replace('/'); // Assuming this is the desired behavior from one of the merged branches
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="account-circle" size={80} color={theme.colors.primary} />
        </View>
        <Text style={styles.name}>Student Name</Text>
        <Text style={styles.grade}>Grade 10 • Science Track</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>42</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Pressable style={styles.menuItem}>
          <MaterialIcons name="person" size={24} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Edit Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <MaterialIcons name="notifications" size={24} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Notifications</Text>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => router.push('/parent-dashboard')}>
          <MaterialIcons name="supervisor-account" size={24} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Parent Dashboard</Text>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <MaterialIcons name="school" size={24} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Learning Preferences</Text>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <MaterialIcons name="privacy-tip" size={24} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Privacy Settings</Text>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <MaterialIcons name="help" size={24} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed
        ]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={20} color={theme.colors.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
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
  avatarContainer: {
    marginBottom: theme.spacing.sm,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  grade: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  logoutButtonPressed: {
    opacity: 0.7,
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.danger,
  },
});
