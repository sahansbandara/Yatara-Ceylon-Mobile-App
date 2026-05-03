import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BookOpen, CalendarDays, Car, DollarSign, MapPin, Users, ChevronRight, Activity } from 'lucide-react-native';

import { Card, Divider, EmptyState, Screen, SectionHeader, StatusBadge } from '@/components/yatara/ui';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Booking } from '@/lib/types';

export default function AdminDashboardScreen() {
  const { isAdmin } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({
    packages: 0,
    bookings: 0,
    vehicles: 0,
    destinations: 0,
    partners: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      try {
        const [packages, bookingsRes, vehicles, destinations, partners] = await Promise.all([
          api.get('/packages'),
          api.get('/bookings'),
          api.get('/vehicles'),
          api.get('/destinations'),
          api.get('/partners'),
        ]);

        const bookingsData: Booking[] = bookingsRes.data.data;
        
        setCounts({
          packages: packages.data.data.length,
          bookings: bookingsData.length,
          vehicles: vehicles.data.data.length,
          destinations: destinations.data.data.length,
          partners: partners.data.data.length,
        });

        // Calculate revenue
        const revenue = bookingsData.reduce((sum, b) => sum + (b.totalCost || 0), 0);
        setTotalRevenue(revenue);

        // Get top 3 recent bookings
        setRecentBookings(bookingsData.slice(0, 3));
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

  const KPIS = [
    { label: 'Revenue', value: `LKR ${(totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: '#10b981', route: '/admin/bookings' },
    { label: 'Bookings', value: counts.bookings, icon: CalendarDays, color: '#3b82f6', route: '/admin/bookings' },
    { label: 'Packages', value: counts.packages, icon: BookOpen, color: '#8b5cf6', route: '/admin/packages' },
    { label: 'Vehicles', value: counts.vehicles, icon: Car, color: '#f59e0b', route: '/admin/vehicles' },
    { label: 'Partners', value: counts.partners, icon: Users, color: '#14b8a6', route: '/admin/partners' },
    { label: 'Locations', value: counts.destinations, icon: MapPin, color: '#f43f5e', route: '/admin/destinations' },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <SectionHeader 
          title="Command Center" 
          subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} 
        />

        {/* KPI Grid */}
        <View style={s.statsGrid}>
          {KPIS.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <Pressable
                key={i}
                style={({ pressed }) => [
                  s.statCard,
                  Shadows.sm,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
                ]}
                onPress={() => router.push(kpi.route as any)}>
                <View style={[s.iconWrap, { backgroundColor: kpi.color + '15' }]}>
                  <Icon size={20} color={kpi.color} />
                </View>
                <Text style={s.statValue}>{kpi.value}</Text>
                <Text style={s.statLabel}>{kpi.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Recent Bookings Panel */}
        <View style={s.panelHeader}>
          <Text style={s.panelTitle}>Recent Bookings</Text>
          <Pressable onPress={() => router.push('/admin/bookings')}>
            <Text style={s.panelAction}>View All</Text>
          </Pressable>
        </View>

        <Card style={s.panelCard}>
          {recentBookings.length > 0 ? (
            recentBookings.map((booking, index) => (
              <View key={booking._id}>
                <Pressable 
                  style={s.bookingRow} 
                  onPress={() => router.push('/admin/bookings')}
                >
                  <View style={s.bookingLeft}>
                    <Text style={s.bookingNo}>{booking.bookingNo}</Text>
                    <Text style={s.bookingCustomer}>{booking.customerName || 'Customer'}</Text>
                    <Text style={s.bookingTotal}>LKR {booking.totalCost?.toLocaleString() || '0'}</Text>
                  </View>
                  <View style={s.bookingRight}>
                    <StatusBadge status={booking.status} />
                    <ChevronRight size={16} color={Colors.muted} style={{ marginLeft: 8 }} />
                  </View>
                </Pressable>
                {index < recentBookings.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <View style={s.emptyPanel}>
              <Activity color={Colors.muted} size={24} />
              <Text style={s.emptyText}>No recent bookings</Text>
            </View>
          )}
        </Card>

      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: '31%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    flexGrow: 1,
    minWidth: 100,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: { color: Colors.deepEmerald, ...Typography.h3, fontSize: 20 },
  statLabel: { color: Colors.muted, ...Typography.tiny, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  panelTitle: { color: Colors.deepEmerald, ...Typography.h3 },
  panelAction: { color: Colors.antiqueGold, ...Typography.captionBold },
  panelCard: { padding: 0, overflow: 'hidden' },
  
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  bookingLeft: { flex: 1 },
  bookingNo: { color: Colors.muted, ...Typography.tiny, fontFamily: undefined, letterSpacing: 0.5, marginBottom: 2 },
  bookingCustomer: { color: Colors.ink, ...Typography.captionBold, marginBottom: 4 },
  bookingTotal: { color: Colors.deepEmerald, ...Typography.caption, fontWeight: '700' },
  bookingRight: { flexDirection: 'row', alignItems: 'center' },
  
  emptyPanel: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: { color: Colors.muted, ...Typography.caption },
});
