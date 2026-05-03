import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Field } from '@/components/yatara/ui';
import { HeroImages } from '@/constants/images';
import { Colors, Typography } from '@/constants/theme';
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
    <View style={s.container}>
      {/* Background */}
      <Image source={HeroImages.dusk} style={s.bgImage} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(6,63,50,0.35)', 'rgba(6,63,50,0.97)']}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Brand */}
          <View style={s.brand}>
            <View style={s.brandLine} />
            <Text style={s.overline}>YATARA CEYLON</Text>
            <Text style={s.title}>Welcome{'\n'}back</Text>
            <Text style={s.tagline}>
              Sign in to browse curated journeys, create bookings, and manage operations.
            </Text>
          </View>

          {/* Form */}
          <View style={s.formCard}>
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />
            <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
            <Button title="Sign In" onPress={submit} loading={loading} />
            <View style={s.footer}>
              <Text style={s.footerText}>New traveler? </Text>
              <Link href="/auth/register" style={s.footerLink}>Create account</Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.deepEmerald },
  bgImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  scroll: { flexGrow: 1, justifyContent: 'flex-end', padding: 24, paddingBottom: 40 },
  brand: { marginBottom: 28 },
  brandLine: { width: 40, height: 3, backgroundColor: Colors.antiqueGold, borderRadius: 2, marginBottom: 14 },
  overline: { color: Colors.antiqueGold, ...Typography.overline, marginBottom: 10 },
  title: { color: Colors.white, ...Typography.hero, fontSize: 40, lineHeight: 46, marginBottom: 12 },
  tagline: { color: 'rgba(255,255,255,0.7)', ...Typography.body, lineHeight: 22 },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: Colors.muted, ...Typography.caption },
  footerLink: { color: Colors.deepEmerald, ...Typography.captionBold },
});
