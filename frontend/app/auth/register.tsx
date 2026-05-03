import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Field } from '@/components/yatara/ui';
import { HeroImages } from '@/constants/images';
import { Colors, Typography } from '@/constants/theme';
import { getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function passwordCategoryCount(value: string) {
  return [
    /[A-Za-z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;
}

function getPasswordStrength(value: string) {
  const categories = passwordCategoryCount(value);
  if (!value) return { label: 'Password strength', color: Colors.muted, detail: 'Use 8+ characters with at least 2 of letters, numbers, symbols.' };
  if (value.length >= 10 && categories === 3) return { label: 'Strong', color: Colors.success, detail: 'Good password for the demo account.' };
  if (value.length >= 8 && categories >= 2) return { label: 'Medium', color: Colors.antiqueGold, detail: 'Accepted. Add all 3 types for a stronger password.' };
  return { label: 'Weak', color: Colors.danger, detail: 'Need 8+ characters and at least 2 of letters, numbers, symbols.' };
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordStrength = getPasswordStrength(password);

  async function submit() {
    if (name.trim().length < 2) { Alert.alert('Invalid name', 'Name must be at least 2 characters.'); return; }
    if (!isValidEmail(email)) { Alert.alert('Invalid email', 'Enter a valid email address like you@example.com.'); return; }
    if (!/^\d{9}$/.test(phoneDigits)) { Alert.alert('Invalid phone', 'Enter exactly 9 digits after +94. Example: 771234567.'); return; }
    if (password.length < 8 || passwordCategoryCount(password) < 2) {
      Alert.alert('Weak password', 'Password must be at least 8 characters and include at least 2 of letters, numbers, and symbols.');
      return;
    }

    try {
      setLoading(true);
      await register({ name: name.trim(), email: email.trim(), phone: `+94${phoneDigits}`, password });
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
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>Phone</Text>
              <View style={s.phoneRow}>
                <View style={s.phonePrefix}>
                  <Text style={s.phonePrefixText}>+94</Text>
                </View>
                <TextInput
                  value={phoneDigits}
                  onChangeText={(value) => setPhoneDigits(value.replace(/\D/g, '').slice(0, 9))}
                  keyboardType="number-pad"
                  placeholder="771234567"
                  placeholderTextColor={Colors.mutedLight}
                  maxLength={9}
                  style={s.phoneInput}
                />
              </View>
              <Text style={s.helpText}>Enter 9 digits only after +94.</Text>
            </View>
            <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Min. 8 characters" />
            <View style={s.strengthRow}>
              <Text style={[s.strengthLabel, { color: passwordStrength.color }]}>{passwordStrength.label}</Text>
              <Text style={s.strengthHelp}>{passwordStrength.detail}</Text>
            </View>
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
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { color: Colors.deepEmerald, ...Typography.captionBold, marginBottom: 6 },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  phonePrefix: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: Colors.offWhite,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  phonePrefixText: { color: Colors.deepEmerald, ...Typography.bodyBold },
  phoneInput: { flex: 1, color: Colors.ink, ...Typography.body, paddingHorizontal: 14, paddingVertical: 12 },
  helpText: { color: Colors.muted, ...Typography.tiny, marginTop: 5 },
  strengthRow: { marginTop: -6, marginBottom: 16 },
  strengthLabel: { ...Typography.captionBold, marginBottom: 4 },
  strengthHelp: { color: Colors.muted, ...Typography.tiny },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: Colors.muted, ...Typography.caption },
  footerLink: { color: Colors.deepEmerald, ...Typography.captionBold },
});
