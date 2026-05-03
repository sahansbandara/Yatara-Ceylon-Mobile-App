import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BookOpen, CalendarDays, Car, MapPin, Users } from 'lucide-react-native';

import { Card, EmptyState, Screen, SectionHeader } from '@/components/yatara/ui';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const MODULES = [
  { key: 'packages', label: 'Packages', icon: BookOpen, route: '/admin/packages', color: '#1a7a62' },
  { key: 'bookings', label: 'Bookings', icon: CalendarDays, route: '/admin/bookings', color: '#d4af37' },
  { key: 'vehicles', label: 'Vehicles', icon: Car, route: '/admin/vehicles', color: '#1570ef' },
  { key: 'destinations', label: 'Destinations', icon: MapPin, route: '/admin/destinations', color: '#dc6803' },
  { key: 'partners', label: 'Partners', icon: Users, route: '/admin/partners', color: '#b42318' },
];

export default function AdminDashboardScreen() {
  const { isAdmin } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({
    packages: 0,
    bookings: 0,
    vehicles: 0,
    destinations: 0,
    partners: 0,
  });

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      try {
        const [packages, bookings, vehicles, destinations, partners] = await Promise.all([
          api.get('/packages'),
          api.get('/bookings'),
          api.get('/vehicles'),
          api.get('/destinations'),
          api.get('/partners'),
        ]);
        setCounts({
          packages: packages.data.data.length,
          bookings: bookings.data.data.length,
          vehicles: vehicles.data.data.length,
          destinations: destinations.data.data.length,
          partners: partners.data.data.length,
        });
      } catch (error) {
        Alert.alert('Could not load dashboard', getApiError(error));
      }
    }
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Screen>
        <EmptyState text="This area is only for admin and staff accounts." />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionHeader title="Admin Dashboard" subtitle="Manage all CRUD modules" />

        {/* Stats grid */}
        <View style={s.statsGrid}>
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Pressable
                key={mod.key}
                style={({ pressed }) => [
                  s.statCard,
                  Shadows.sm,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
                ]}
                onPress={() => router.push(mod.route as any)}>
                <View style={[s.iconWrap, { backgroundColor: mod.color + '15' }]}>
                  <Icon size={20} color={mod.color} />
                </View>
                <Text style={s.statValue}>{counts[mod.key] ?? 0}</Text>
                <Text style={s.statLabel}>{mod.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Management links */}
        <SectionHeader title="Quick Access" />
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Pressable
              key={mod.key}
              style={({ pressed }) => [pressed && { opacity: 0.9 }]}
              onPress={() => router.push(mod.route as any)}>
              <Card style={s.linkCard}>
                <View style={s.linkRow}>
                  <View style={[s.linkIcon, { backgroundColor: mod.color + '15' }]}>
                    <Icon size={18} color={mod.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.linkTitle}>Manage {mod.label}</Text>
                    <Text style={s.linkSub}>{counts[mod.key]} records</Text>
                  </View>
                  <Text style={s.linkArrow}>›</Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    flexGrow: 1,
    minWidth: 140,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: Colors.deepEmerald, ...Typography.h1, fontSize: 32 },
  statLabel: { color: Colors.muted, ...Typography.tiny, textTransform: 'uppercase', letterSpacing: 0.8 },
  linkCard: { marginBottom: 8 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: { color: Colors.deepEmerald, ...Typography.bodyBold },
  linkSub: { color: Colors.muted, ...Typography.tiny, marginTop: 2 },
  linkArrow: { color: Colors.muted, fontSize: 24, fontWeight: '300' },
});
