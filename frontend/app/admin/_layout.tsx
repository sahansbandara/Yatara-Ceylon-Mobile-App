import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.offWhite }}>
        <ActivityIndicator color={Colors.deepEmerald} />
      </View>
    );
  }

  if (!user) return <Redirect href="/auth/login" />;
  if (!isAdmin) return <Redirect href="/(tabs)" />;

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
