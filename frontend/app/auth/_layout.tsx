import { Redirect, Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.deepEmerald },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '800' },
      }}
    />
  );
}
