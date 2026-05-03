import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button, Field, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (name.trim().length < 2) {
      Alert.alert('Invalid name', 'Name must be at least 2 characters.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }
    if (phone.trim().length < 7) {
      Alert.alert('Invalid phone', 'Enter a valid phone number.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, phone, password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Registration failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title>Create account</Title>
      <Subtitle>Register as a traveler and start booking Yatara Ceylon journeys.</Subtitle>
      <Field label="Name" value={name} onChangeText={setName} />
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={submit} loading={loading} />
    </Screen>
  );
}
