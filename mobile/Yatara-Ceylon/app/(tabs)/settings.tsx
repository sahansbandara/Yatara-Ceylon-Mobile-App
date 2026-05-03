import { router } from 'expo-router';
import { Text } from 'react-native';

import { Button, Card, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth();

  async function signOut() {
    await logout();
    router.replace('/auth/login');
  }

  return (
    <Screen>
      <Title>Profile</Title>
      <Subtitle>Session and environment details for viva proof.</Subtitle>
      <Card>
        <Text style={{ color: Colors.deepEmerald, fontWeight: '900', fontSize: 18 }}>{user?.name}</Text>
        <Text style={{ color: Colors.ink, marginTop: 6 }}>{user?.email}</Text>
        <Text style={{ color: Colors.antiqueGold, fontWeight: '900', marginTop: 8 }}>{user?.role}</Text>
      </Card>
      <Card>
        <Text style={{ color: Colors.muted }}>API Base URL</Text>
        <Text style={{ color: Colors.deepEmerald, fontWeight: '800', marginTop: 4 }}>{API_URL}</Text>
      </Card>
      {isAdmin ? <Button title="Admin Dashboard" onPress={() => router.push('/admin')} /> : null}
      <Button title="Logout" variant="danger" onPress={signOut} />
    </Screen>
  );
}
