import { UserProfile, ParentChildLink } from '@/types/learning';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_PROFILE: '@user_profile',
  PARENT_LINKS: '@parent_child_links',
};

export const authService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async login(email: string, password: string, role: 'student' | 'parent' | 'teacher'): Promise<UserProfile> {
    // Mock login - in real app, this would call backend API
    const user: UserProfile = {
      id: Date.now().toString(),
      name: role === 'student' ? 'Student Name' : role === 'parent' ? 'Parent Name' : 'Teacher Name',
      email,
      role,
      linkedAccounts: [],
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    return user;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    const current = await this.getCurrentUser();
    if (current) {
      const updated = { ...current, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  async linkChildAccount(parentId: string, childName: string): Promise<ParentChildLink> {
    const link: ParentChildLink = {
      id: Date.now().toString(),
      parentId,
      childId: `child_${Date.now()}`,
      childName,
      linkedAt: Date.now(),
      permissions: {
        viewProgress: true,
        viewReports: true,
        receiveAlerts: true,
      },
    };

    const links = await this.getChildLinks(parentId);
    links.push(link);
    await AsyncStorage.setItem(STORAGE_KEYS.PARENT_LINKS, JSON.stringify(links));
    
    return link;
  },

  async getChildLinks(parentId: string): Promise<ParentChildLink[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PARENT_LINKS);
      const allLinks: ParentChildLink[] = data ? JSON.parse(data) : [];
      return allLinks.filter(link => link.parentId === parentId);
    } catch {
      return [];
    }
  },

  async updateLinkPermissions(linkId: string, permissions: Partial<ParentChildLink['permissions']>): Promise<void> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PARENT_LINKS);
    if (data) {
      const links: ParentChildLink[] = JSON.parse(data);
      const index = links.findIndex(l => l.id === linkId);
      if (index !== -1) {
        links[index].permissions = { ...links[index].permissions, ...permissions };
        await AsyncStorage.setItem(STORAGE_KEYS.PARENT_LINKS, JSON.stringify(links));
      }
    }
  },
};
