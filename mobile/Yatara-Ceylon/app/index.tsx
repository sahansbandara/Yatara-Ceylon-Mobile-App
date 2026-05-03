import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? '/(tabs)' : '/auth/login');
  }, [loading, user]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.deepEmerald, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: Colors.antiqueGold, fontSize: 34, fontWeight: '900', marginBottom: 12 }}>Yatara Ceylon</Text>
      <Text style={{ color: Colors.offWhite, marginBottom: 28 }}>Luxury travel operations, now mobile.</Text>
      <ActivityIndicator color={Colors.antiqueGold} />
    </View>
  );
}
