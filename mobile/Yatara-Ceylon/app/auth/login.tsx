import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text } from 'react-native';

import { Button, Field, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.includes('@') || !password.trim()) {
      Alert.alert('Check your details', 'Enter a valid email address and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title>Welcome back</Title>
      <Subtitle>Sign in to browse journeys, create bookings, and manage operations.</Subtitle>
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={submit} loading={loading} />
      <Text style={{ color: Colors.muted, marginTop: 18 }}>
        New traveler? <Link href="/auth/register" style={{ color: Colors.deepEmerald, fontWeight: '800' }}>Create account</Link>
      </Text>
    </Screen>
  );
}
