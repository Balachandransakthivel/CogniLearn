import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile" options={{ headerShown: true, title: 'Profile' }} />
          <Stack.Screen name="history" options={{ headerShown: true, title: 'Learning History' }} />
          <Stack.Screen 
            name="pattern-details" 
            options={{ 
              headerShown: true, 
              title: 'Pattern Analysis',
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="parent-dashboard" 
            options={{ 
              headerShown: false,
            }} 
          />
        </Stack>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
