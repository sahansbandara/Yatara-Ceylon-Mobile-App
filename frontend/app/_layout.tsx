import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/lib/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.deepEmerald },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '800' },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin-tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="packages/[id]" options={{ title: 'Package Details' }} />
        <Stack.Screen name="booking/[packageId]" options={{ title: 'Booking Request' }} />
        <Stack.Screen name="transfer/[service]" options={{ title: 'Transfer Request' }} />
        <Stack.Screen name="build-tour/index" options={{ title: 'Build Tour' }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
