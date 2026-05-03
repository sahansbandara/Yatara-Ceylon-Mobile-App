import { Redirect, Stack, useRouter } from 'expo-router';
import { ActivityIndicator, View, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { useAuth } from '@/lib/auth';

const DARK_BG = '#0B100E';
const TAB_BG = '#063F32';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: DARK_BG }}>
        <ActivityIndicator color="#D4AF37" />
      </View>
    );
  }

  if (!user) return <Redirect href="/auth/login" />;
  if (!isAdmin) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: TAB_BG },
        headerTintColor: '#F8F4EA',
        headerTitleStyle: { fontWeight: '800' },
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={{ paddingRight: 16 }}>
            <ArrowLeft color="#F8F4EA" size={24} />
          </Pressable>
        ),
      }}>
      <Stack.Screen name="vehicles" options={{ title: 'Manage Vehicles' }} />
      <Stack.Screen name="destinations" options={{ title: 'Manage Destinations' }} />
      <Stack.Screen name="partners" options={{ title: 'Manage Partners' }} />
      <Stack.Screen name="users" options={{ title: 'Manage Users' }} />
    </Stack>
  );
}
