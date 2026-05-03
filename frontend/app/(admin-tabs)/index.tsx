import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {
  BookOpen, CalendarDays, Car, DollarSign, Search, Clock,
  Handshake, Plus, Eye, MapPin, ArrowRight, AlertTriangle,
} from 'lucide-react-native';

import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Booking, Vehicle, Partner } from '@/lib/types';

const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED = '#8B9A96';
const BORDER = '#222B28';
const GOLD = '#D4AF37';
const INPUT_BG = '#121715';

const STATUS_COLORS: Record<string, string> = {
  NEW: '#f59e0b',
  PAYMENT_PENDING: '#f59e0b',
  ADVANCE_PAID: '#3b82f6',
  CONFIRMED: '#10b981',
  ASSIGNED: '#8b5cf6',
  IN_PROGRESS: '#3b82f6',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
};

export default function AdminHomeScreen() {
  const { isAdmin } = useAuth();
  const [counts, setCounts] = useState({ packages: 0, bookings: 0, vehicles: 0, destinations: 0, partners: 0 });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [alertData, setAlertData] = useState({ pending: 0, unavailableVehicles: 0, pendingPartners: 0 });

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      try {
        const [packagesRes, bookingsRes, vehiclesRes, destinationsRes, partnersRes] = await Promise.all([
          api.get('/packages'),
          api.get('/bookings'),
          api.get('/vehicles'),
          api.get('/destinations'),
          api.get('/partners'),
        ]);

        const bookings: Booking[] = bookingsRes.data.data;
        const vehicles: Vehicle[] = vehiclesRes.data.data;
        const partners: Partner[] = partnersRes.data.data;

        setCounts({
          packages: packagesRes.data.data.length,
          bookings: bookings.length,
          vehicles: vehicles.length,
          destinations: destinationsRes.data.data.length,
          partners: partners.length,
        });

        const revenue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
        setTotalRevenue(revenue);

        const pending = bookings.filter(b => b.status === 'NEW' || b.status === 'PAYMENT_PENDING').length;
        setPendingCount(pending);

        setRecentBookings(bookings.slice(0, 5));

        const unavailableVehicles = vehicles.filter(v => v.status === 'UNAVAILABLE' || v.status === 'MAINTENANCE').length;
        const pendingPartners = partners.filter(p => p.status === 'PENDING' || p.status === 'INACTIVE').length;
        setAlertData({ pending, unavailableVehicles, pendingPartners });
      } catch (error) {
        Alert.alert('Could not load dashboard', getApiError(error));
      }
    }
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <View style={[s.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: MUTED }}>Access Denied</Text>
      </View>
    );
  }

  const KPIS = [
    { label: 'Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#10b981', route: '/(admin-tabs)/bookings' },
    { label: 'Bookings', value: counts.bookings, icon: CalendarDays, color: '#3b82f6', route: '/(admin-tabs)/bookings' },
    { label: 'Pending', value: pendingCount, icon: Clock, color: '#f59e0b', route: '/(admin-tabs)/bookings' },
    { label: 'Packages', value: counts.packages, icon: BookOpen, color: '#a855f7', route: '/(admin-tabs)/packages' },
    { label: 'Vehicles', value: counts.vehicles, icon: Car, color: '#8b5cf6', route: '/admin/vehicles' },
    { label: 'Partners', value: counts.partners, icon: Handshake, color: '#14b8a6', route: '/admin/partners' },
  ];

  const QUICK_ACTIONS = [
    { label: 'Add Package', icon: Plus, color: '#a855f7', route: '/(admin-tabs)/packages' },
    { label: 'View Pending', icon: Eye, color: '#f59e0b', route: '/(admin-tabs)/bookings' },
    { label: 'Manage Vehicles', icon: Car, color: '#8b5cf6', route: '/admin/vehicles' },
    { label: 'Manage Destinations', icon: MapPin, color: '#3b82f6', route: '/admin/destinations' },
    { label: 'Manage Partners', icon: Handshake, color: '#14b8a6', route: '/admin/partners' },
    { label: 'All Packages', icon: BookOpen, color: '#a855f7', route: '/(admin-tabs)/packages' },
  ];

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const totalAlerts = alertData.pending + alertData.unavailableVehicles + alertData.pendingPartners;

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Command Center</Text>
          <Text style={s.subtitle}>{todayStr} — Overview & operations hub</Text>
        </View>

        {/* Search Bar */}
        <View style={s.searchBar}>
          <Search size={16} color={MUTED} />
          <TextInput
            style={s.searchInput}
            placeholder="Search bookings, packages, dest..."
            placeholderTextColor={MUTED}
            editable={false}
          />
        </View>

        {/* KPI Grid */}
        <View style={s.grid}>
          {KPIS.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <Pressable
                key={i}
                style={({ pressed }) => [s.kpiCard, pressed && { opacity: 0.8 }]}
                onPress={() => router.push(kpi.route as any)}>
                <View style={s.kpiHeader}>
                  <Text style={s.kpiLabel}>{kpi.label}</Text>
                  <View style={[s.iconBox, { borderColor: BORDER, backgroundColor: kpi.color + '15' }]}>
                    <Icon size={16} color={kpi.color} />
                  </View>
                </View>
                <Text style={s.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
                  {kpi.value}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Quick Actions */}
        <Text style={s.sectionTitle}>QUICK ACTIONS</Text>
        <View style={s.grid}>
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <Pressable
                key={i}
                style={({ pressed }) => [s.actionCard, pressed && { opacity: 0.8 }]}
                onPress={() => router.push(action.route as any)}>
                <View style={[s.actionIconBox, { backgroundColor: action.color + '15' }]}>
                  <Icon size={18} color={action.color} />
                </View>
                <Text style={s.actionLabel}>{action.label}</Text>
                <ArrowRight size={14} color={MUTED} />
              </Pressable>
            );
          })}
        </View>

        {/* Recent Activity */}
        <Text style={s.sectionTitle}>RECENT ACTIVITY</Text>
        <View style={s.activityContainer}>
          {recentBookings.length > 0 ? recentBookings.map((booking, i) => (
            <Pressable
              key={booking._id}
              style={({ pressed }) => [s.activityRow, i < recentBookings.length - 1 && s.activityBorder, pressed && { opacity: 0.7 }]}
              onPress={() => router.push('/(admin-tabs)/bookings' as any)}>
              <View style={[s.activityDot, { backgroundColor: STATUS_COLORS[booking.status] || MUTED }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.activityTitle} numberOfLines={1}>
                  {booking.bookingNo} — {booking.packageId?.title || 'Custom Tour'}
                </Text>
                <Text style={s.activitySub}>
                  {booking.customerName || 'Unknown'} · {booking.status.replace('_', ' ')}
                </Text>
              </View>
              <Text style={s.activityDate}>
                {new Date(booking.dates?.from || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </Text>
            </Pressable>
          )) : (
            <Text style={[s.activitySub, { padding: 16 }]}>No recent bookings</Text>
          )}
        </View>

        {/* System Alerts */}
        {totalAlerts > 0 && (
          <>
            <Text style={s.sectionTitle}>SYSTEM ALERTS</Text>
            <View style={s.alertsContainer}>
              {alertData.pending > 0 && (
                <View style={s.alertRow}>
                  <AlertTriangle size={14} color="#f59e0b" />
                  <Text style={s.alertText}>{alertData.pending} booking{alertData.pending > 1 ? 's' : ''} pending approval</Text>
                </View>
              )}
              {alertData.unavailableVehicles > 0 && (
                <View style={s.alertRow}>
                  <AlertTriangle size={14} color="#ef4444" />
                  <Text style={s.alertText}>{alertData.unavailableVehicles} vehicle{alertData.unavailableVehicles > 1 ? 's' : ''} unavailable</Text>
                </View>
              )}
              {alertData.pendingPartners > 0 && (
                <View style={s.alertRow}>
                  <AlertTriangle size={14} color="#8b5cf6" />
                  <Text style={s.alertText}>{alertData.pendingPartners} partner{alertData.pendingPartners > 1 ? 's' : ''} inactive/pending</Text>
                </View>
              )}
            </View>
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DARK_BG },
  scrollContent: { padding: 20, paddingTop: 30, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { color: DARK_TEXT, fontSize: 28, fontWeight: '700', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { color: MUTED, fontSize: 13, letterSpacing: 0.2, lineHeight: 18 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 24, gap: 10 },
  searchInput: { color: DARK_TEXT, fontSize: 14, flex: 1 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 28 },

  kpiCard: { width: '48%', backgroundColor: DARK_CARD, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D2522' },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  kpiLabel: { color: '#D8E2DC', fontSize: 14, fontWeight: '500', letterSpacing: 0.5 },
  iconBox: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { color: DARK_TEXT, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },

  sectionTitle: { color: '#4A5550', fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 14, marginLeft: 2 },

  actionCard: { width: '48%', backgroundColor: DARK_CARD, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1D2522', flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: DARK_TEXT, fontSize: 12, fontWeight: '600', flex: 1, letterSpacing: 0.2 },

  activityContainer: { backgroundColor: DARK_CARD, borderRadius: 16, borderWidth: 1, borderColor: '#1D2522', marginBottom: 28, overflow: 'hidden' },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: '#1D2522' },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityTitle: { color: DARK_TEXT, fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
  activitySub: { color: MUTED, fontSize: 11, fontWeight: '500', marginTop: 2 },
  activityDate: { color: MUTED, fontSize: 11, fontWeight: '600' },

  alertsContainer: { backgroundColor: '#1A1510', borderRadius: 14, borderWidth: 1, borderColor: '#2A2218', padding: 4, marginBottom: 28 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16 },
  alertText: { color: DARK_TEXT, fontSize: 13, fontWeight: '500', letterSpacing: 0.2 },
});
