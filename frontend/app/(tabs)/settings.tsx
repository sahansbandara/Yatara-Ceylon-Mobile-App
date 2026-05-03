import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LogOut, Save } from 'lucide-react-native';

import { Button, Card, Field } from '@/components/yatara/ui';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { API_URL, api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/auth/me')
      .then(() => setApiStatus('Connected'))
      .catch(() => setApiStatus('Not reachable'));
  }, []);

  async function save() {
    if (name.trim().length < 2) {
      Alert.alert('Invalid name', 'Name must be at least 2 characters.');
      return;
    }
    if (phone.trim() && phone.trim().length < 7) {
      Alert.alert('Invalid phone', 'Phone number must be at least 7 characters.');
      return;
    }
    try {
      setSaving(true);
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      Alert.alert('Profile updated', 'Your profile changes were saved.');
    } catch (error) {
      Alert.alert('Save failed', getApiError(error));
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await logout();
    router.replace('/auth/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'YC';

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.title}>{user?.name || 'Traveler'}</Text>
          <Text style={s.subtitle}>{user?.email}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleText}>Role: USER</Text>
          </View>
        </View>

        <Card>
          <Text style={s.sectionLabel}>Profile Details</Text>
          <Field label="Full Name" value={name} onChangeText={setName} placeholder="Your name" />
          <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+94 77 123 4567" />
          <Button title="Save Changes" icon={<Save color={Colors.white} size={18} />} onPress={save} loading={saving} />
        </Card>

        <Card>
          <Text style={s.sectionLabel}>App Status</Text>
          <InfoRow label="App Version" value="1.0.0 Viva Demo" />
          <InfoRow label="Backend API" value={apiStatus} />
          <Text style={s.apiUrl} numberOfLines={2}>{API_URL}</Text>
        </Card>

        <Pressable onPress={signOut} style={({ pressed }) => [s.logoutBtn, pressed && { opacity: 0.82 }]}>
          <LogOut color={Colors.danger} size={18} />
          <Text style={s.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.offWhite },
  content: { padding: 20, paddingBottom: 36, gap: 14 },
  header: {
    backgroundColor: Colors.deepEmerald,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    ...Shadows.md,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: Colors.antiqueGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: Colors.ink, fontSize: 24, fontWeight: '900' },
  title: { color: Colors.white, ...Typography.h3, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.72)', ...Typography.caption, marginTop: 4 },
  roleBadge: {
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.45)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  roleText: { color: Colors.antiqueGold, ...Typography.captionBold },
  sectionLabel: { color: Colors.deepEmerald, ...Typography.overline, marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 8 },
  infoLabel: { color: Colors.muted, ...Typography.caption },
  infoValue: { color: Colors.deepEmerald, ...Typography.captionBold, textAlign: 'right', flex: 1 },
  apiUrl: { color: Colors.muted, ...Typography.tiny, marginTop: 8 },
  logoutBtn: {
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: 'rgba(180,35,24,0.2)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: { color: Colors.danger, ...Typography.bodyBold },
});
