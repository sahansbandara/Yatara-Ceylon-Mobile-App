import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Field } from '@/components/yatara/ui';
import { HeroImages } from '@/constants/images';
import { Colors, Typography } from '@/constants/theme';
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
    if (name.trim().length < 2) { Alert.alert('Invalid name', 'Name must be at least 2 characters.'); return; }
    if (!email.includes('@')) { Alert.alert('Invalid email', 'Enter a valid email address.'); return; }
    if (phone.trim().length < 7) { Alert.alert('Invalid phone', 'Enter a valid phone number.'); return; }
    if (password.length < 8) { Alert.alert('Weak password', 'Password must be at least 8 characters.'); return; }

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
    <View style={s.container}>
      <Image source={HeroImages.sustainability} style={s.bgImage} resizeMode="cover" />
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
          <View style={s.brand}>
            <View style={s.brandLine} />
            <Text style={s.overline}>YATARA CEYLON</Text>
            <Text style={s.title}>Create{'\n'}account</Text>
            <Text style={s.tagline}>
              Register as a traveler and start booking curated Sri Lanka journeys.
            </Text>
          </View>

          <View style={s.formCard}>
            <Field label="Full Name" value={name} onChangeText={setName} placeholder="Sahan Bandara" />
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />
            <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+94 77 123 4567" />
            <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Min. 8 characters" />
            <Button title="Create Account" onPress={submit} loading={loading} />
            <View style={s.footer}>
              <Text style={s.footerText}>Already a member? </Text>
              <Link href="/auth/login" style={s.footerLink}>Sign in</Link>
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
  brand: { marginBottom: 24 },
  brandLine: { width: 40, height: 3, backgroundColor: Colors.antiqueGold, borderRadius: 2, marginBottom: 14 },
  overline: { color: Colors.antiqueGold, ...Typography.overline, marginBottom: 10 },
  title: { color: Colors.white, ...Typography.hero, fontSize: 38, lineHeight: 44, marginBottom: 10 },
  tagline: { color: 'rgba(255,255,255,0.7)', ...Typography.body },
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
