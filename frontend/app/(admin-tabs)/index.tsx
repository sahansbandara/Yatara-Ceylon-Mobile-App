import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { BookOpen, CalendarDays, Car, CheckCircle2, Clock, Handshake, Plus, RefreshCw, Users } from 'lucide-react-native';

import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { toVivaStatus } from '@/lib/bookingStatus';
import { AdminUser, Booking, PackageItem, Partner, Vehicle } from '@/lib/types';

export default function AdminHomeScreen() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get('/packages'),
      api.get('/bookings'),
      api.get('/vehicles'),
      api.get('/partners'),
      api.get('/users'),
    ])
      .then(([packageRes, bookingRes, vehicleRes, partnerRes, userRes]) => {
        setPackages(packageRes.data.data);
        setBookings(bookingRes.data.data);
        setVehicles(vehicleRes.data.data);
        setPartners(partnerRes.data.data);
        setUsers(userRes.data.data);
      })
      .catch((error) => Alert.alert('Could not load dashboard', getApiError(error)))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(load);

  const pendingBookings = bookings.filter((item) => toVivaStatus(item.status) === 'PENDING').length;
  const activeTransfers = vehicles.filter((item) => item.status === 'AVAILABLE').length;
  const pendingUsers = users.filter((item) => item.status === 'PENDING_APPROVAL').length;
  const pendingPartners = partners.filter((item) => item.status === 'PENDING').length;
  const recent = bookings.slice(0, 5);

  return (
    <View style={s.screen}>
      <FlatList
        data={recent}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <View>
            <View style={s.header}>
              <Text style={s.kicker}>ADMIN DASHBOARD</Text>
              <Text style={s.title}>Manage Yatara Ceylon operations</Text>
              <Pressable onPress={load} style={s.refreshBtn}>
                <RefreshCw color={Colors.antiqueGold} size={16} />
                <Text style={s.refreshText}>{loading ? 'Refreshing' : 'Refresh'}</Text>
              </Pressable>
            </View>

            <View style={s.kpiGrid}>
              <Kpi label="Total Packages" value={packages.length} icon={<BookOpen color={Colors.antiqueGold} size={20} />} onPress={() => router.push('/(admin-tabs)/packages')} />
              <Kpi label="Total Bookings" value={bookings.length} icon={<CalendarDays color={Colors.info} size={20} />} onPress={() => router.push('/(admin-tabs)/bookings')} />
              <Kpi label="Pending Bookings" value={pendingBookings} icon={<Clock color={Colors.warning} size={20} />} onPress={() => router.push('/(admin-tabs)/bookings')} />
              <Kpi label="Active Transfers" value={activeTransfers} icon={<Car color={Colors.success} size={20} />} onPress={() => router.push('/admin/vehicles' as any)} />
              <Kpi label="Pending Users" value={pendingUsers} icon={<Users color={Colors.warning} size={20} />} onPress={() => router.push('/admin/users' as any)} />
              <Kpi label="Pending Partners" value={pendingPartners} icon={<Handshake color={Colors.warning} size={20} />} onPress={() => router.push('/admin/partners' as any)} />
            </View>

            <Text style={s.sectionTitle}>Quick Actions</Text>
            <View style={s.actions}>
              <Action label="Add Package" icon={<Plus color={Colors.white} size={18} />} onPress={() => router.push('/(admin-tabs)/packages')} />
              <Action label="Manage Packages" icon={<BookOpen color={Colors.white} size={18} />} onPress={() => router.push('/(admin-tabs)/packages')} />
              <Action label="View Bookings" icon={<CalendarDays color={Colors.white} size={18} />} onPress={() => router.push('/(admin-tabs)/bookings')} />
              <Action label="Add Transfer" icon={<Car color={Colors.white} size={18} />} onPress={() => router.push('/admin/vehicles' as any)} />
              <Action label="Approve Users" icon={<Users color={Colors.white} size={18} />} onPress={() => router.push('/admin/users' as any)} />
              <Action label="Manage Partners" icon={<Handshake color={Colors.white} size={18} />} onPress={() => router.push('/admin/partners' as any)} />
            </View>

            <Text style={s.sectionTitle}>Recent Bookings</Text>
          </View>
        }
        ListEmptyComponent={<Text style={s.emptyText}>No recent bookings yet.</Text>}
        renderItem={({ item }) => {
          const status = toVivaStatus(item.status);
          return (
            <Pressable onPress={() => router.push('/(admin-tabs)/bookings')} style={({ pressed }) => [s.bookingRow, pressed && { opacity: 0.8 }]}>
              <View style={s.bookingIcon}>
                <CheckCircle2 color={Colors.antiqueGold} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.bookingTitle}>{item.bookingNo}</Text>
                <Text style={s.bookingText} numberOfLines={1}>
                  {item.customerName} | {item.packageId?.title || item.type}
                </Text>
              </View>
              <Text style={s.status}>{status}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function Kpi({ label, value, icon, onPress }: { label: string; value: number; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.kpiCard, Shadows.sm, pressed && { opacity: 0.82 }]}>
      <View style={s.kpiIcon}>{icon}</View>
      <Text style={s.kpiValue}>{value}</Text>
      <Text style={s.kpiLabel}>{label}</Text>
    </Pressable>
  );
}

function Action({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.82 }]}>
      {icon}
      <Text style={s.actionText}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B100E' },
  content: { padding: 20, paddingBottom: 36 },
  header: {
    backgroundColor: Colors.deepEmerald,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#0d5a47',
  },
  kicker: { color: Colors.antiqueGold, ...Typography.overline, marginBottom: 8 },
  title: { color: Colors.white, ...Typography.h2 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  refreshText: { color: Colors.antiqueGold, ...Typography.captionBold },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: {
    width: '48%',
    backgroundColor: '#161B19',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222B28',
    padding: 14,
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F1A15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  kpiValue: { color: Colors.white, fontSize: 28, fontWeight: '900' },
  kpiLabel: { color: '#8B9A96', ...Typography.caption },
  sectionTitle: { color: Colors.antiqueGold, ...Typography.overline, marginTop: 24, marginBottom: 12 },
  actions: { gap: 10 },
  actionBtn: {
    backgroundColor: Colors.deepEmerald,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: { color: Colors.white, ...Typography.captionBold },
  bookingRow: {
    backgroundColor: '#161B19',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222B28',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F1A15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingTitle: { color: Colors.white, ...Typography.captionBold },
  bookingText: { color: '#8B9A96', ...Typography.caption, marginTop: 2 },
  status: { color: Colors.antiqueGold, ...Typography.tiny, fontWeight: '900' },
  emptyText: { color: '#8B9A96', textAlign: 'center', padding: 24 },
});
