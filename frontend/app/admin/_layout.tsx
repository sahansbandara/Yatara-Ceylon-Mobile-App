import { router, Redirect, Stack } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

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
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Admin Dashboard',
          headerLeft: () => (
            <Pressable onPress={() => router.replace('/(tabs)')} style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
              <ChevronLeft color={Colors.white} size={28} style={{ marginLeft: -8 }} />
            </Pressable>
          )
        }}
      />
      <Stack.Screen name="packages" options={{ title: 'Packages' }} />
      <Stack.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Stack.Screen name="vehicles" options={{ title: 'Vehicles' }} />
      <Stack.Screen name="destinations" options={{ title: 'Destinations' }} />
      <Stack.Screen name="partners" options={{ title: 'Partners' }} />
    </Stack>
  );
}
