import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LogOut, Save, ShieldCheck } from 'lucide-react-native';

import { Button, Card, Field } from '@/components/yatara/ui';
import { Colors, Typography } from '@/constants/theme';
import { API_URL, api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function AdminProfileScreen() {
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
    try {
      setSaving(true);
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      Alert.alert('Profile updated', 'Admin profile changes were saved.');
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
    : 'AD';

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.title}>{user?.name || 'Admin'}</Text>
          <Text style={s.subtitle}>{user?.email}</Text>
          <View style={s.roleRow}>
            <ShieldCheck color={Colors.antiqueGold} size={16} />
            <Text style={s.roleText}>Role: {user?.role || 'ADMIN'}</Text>
          </View>
        </View>

        <Card style={s.darkCard}>
          <Text style={s.sectionLabel}>Profile Details</Text>
          <Field label="Admin Name" value={name} onChangeText={setName} placeholder="Admin name" />
          <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+94 77 123 4567" />
          <Button title="Save Changes" icon={<Save color={Colors.white} size={18} />} onPress={save} loading={saving} />
        </Card>

        <Card style={s.darkCard}>
          <Text style={s.sectionLabel}>Backend Status</Text>
          <InfoRow label="API Status" value={apiStatus} />
          <InfoRow label="API URL" value={API_URL} />
          <InfoRow label="App Version" value="1.0.0 Viva Demo" />
        </Card>

        <Pressable onPress={signOut} style={({ pressed }) => [s.logoutBtn, pressed && { opacity: 0.82 }]}>
          <LogOut color="#ffb4ab" size={18} />
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
      <Text style={s.infoValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B100E' },
  content: { padding: 20, paddingBottom: 36, gap: 14 },
  header: {
    backgroundColor: Colors.deepEmerald,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0d5a47',
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
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(212,175,55,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.42)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  roleText: { color: Colors.antiqueGold, ...Typography.captionBold },
  darkCard: { backgroundColor: '#161B19', borderColor: '#222B28' },
  sectionLabel: { color: Colors.antiqueGold, ...Typography.overline, marginBottom: 10 },
  infoRow: { gap: 6, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#222B28' },
  infoLabel: { color: '#8B9A96', ...Typography.caption },
  infoValue: { color: Colors.white, ...Typography.captionBold },
  logoutBtn: {
    backgroundColor: '#3D1C1C',
    borderWidth: 1,
    borderColor: '#5f2525',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: { color: '#ffb4ab', ...Typography.bodyBold },
});
