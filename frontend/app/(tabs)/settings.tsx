import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { Button, Card, Divider, Screen, SectionHeader } from '@/components/yatara/ui';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { API_URL, api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth();
  const [bookingCount, setBookingCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      api.get('/bookings/my').then((res) => {
        setBookingCount(res.data.data.length);
      }).catch(() => {});
    }, [])
  );

  async function signOut() {
    await logout();
    router.replace('/auth/login');
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionHeader title="My Dashboard" subtitle="Manage your account & bookings" />

        {/* Avatar & info */}
        <Card>
          <View style={s.profileRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.userName}>{user?.name}</Text>
              <Text style={s.userEmail}>{user?.email}</Text>
              <View style={s.roleBadge}>
                <Text style={s.roleText}>{user?.role}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Quick Stats */}
        <SectionHeader title="Overview" />
        <View style={s.statsRow}>
          <View style={[s.statCard, Shadows.sm]}>
            <Text style={s.statValue}>{bookingCount}</Text>
            <Text style={s.statLabel}>Total Bookings</Text>
          </View>
          <View style={[s.statCard, Shadows.sm]}>
            <Text style={s.statValue}>1</Text>
            <Text style={s.statLabel}>Saved Plans</Text>
          </View>
        </View>

        {/* Dashboard Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={{ gap: 10, marginBottom: 20 }}>
          <Button
            title="View My Bookings"
            variant="secondary"
            onPress={() => router.push('/(tabs)/bookings')}
          />
          <Button
            title="Browse Packages"
            variant="secondary"
            onPress={() => router.push('/(tabs)/packages')}
          />
        </View>

        {/* Environment card */}
        <SectionHeader title="System Info" />
        <Card>
          <Text style={s.envLabel}>API ENDPOINT</Text>
          <Text style={s.envValue}>{API_URL}</Text>
          <Divider />
          <Text style={s.envLabel}>APP VERSION</Text>
          <Text style={s.envValue}>Yatara Ceylon Mobile v1.0.0</Text>
          <Divider />
          <Text style={s.envLabel}>PLATFORM</Text>
          <Text style={s.envValue}>Expo React Native · SDK 54</Text>
        </Card>

        <View style={{ height: 20 }} />

        {/* Actions */}
        {isAdmin ? (
          <Button title="Open Admin Dashboard" variant="gold" onPress={() => router.push('/admin')} />
        ) : null}
        <View style={{ height: 10 }} />
        <Button title="Sign Out" variant="danger" onPress={signOut} />
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.deepEmerald,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.gold,
  },
  avatarText: { color: Colors.antiqueGold, ...Typography.h2, fontWeight: '900' },
  userName: { color: Colors.deepEmerald, ...Typography.h3 },
  userEmail: { color: Colors.muted, ...Typography.caption, marginTop: 2 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.antiqueGold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 8,
  },
  roleText: {
    color: Colors.ink,
    ...Typography.tiny,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  envLabel: {
    color: Colors.muted,
    ...Typography.overline,
    marginBottom: 4,
  },
  envValue: {
    color: Colors.deepEmerald,
    ...Typography.captionBold,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 10 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { color: Colors.deepEmerald, ...Typography.h2, fontWeight: '800' },
  statLabel: { color: Colors.muted, ...Typography.captionBold },
});
