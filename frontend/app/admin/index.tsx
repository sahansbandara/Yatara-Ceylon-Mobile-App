import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { BookOpen, CalendarDays, Car, DollarSign, Users, ChevronRight, Search, Clock, Handshake } from 'lucide-react-native';

import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Booking } from '@/lib/types';

// Theme constants specifically for the Dark Admin Dashboard
const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED_TEXT = '#8B9A96';
const BORDER = '#222B28';

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
  const [pendingCount, setPendingCount] = useState(0);

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

        // Count pending
        const pending = bookingsData.filter(b => b.status === 'NEW' || b.status === 'PAYMENT_PENDING').length;
        setPendingCount(pending);

      } catch (error) {
        Alert.alert('Could not load dashboard', getApiError(error));
      }
    }
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: MUTED_TEXT }}>Access Denied</Text>
      </View>
    );
  }

  const KPIS = [
    { label: 'Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#10b981', route: '/admin/bookings' },
    { label: 'Bookings', value: counts.bookings, icon: CalendarDays, color: '#3b82f6', route: '/admin/bookings' },
    { label: 'Pending', value: pendingCount, icon: Clock, color: '#f59e0b', route: '/admin/bookings' },
    { label: 'Packages', value: counts.packages, icon: BookOpen, color: '#a855f7', route: '/admin/packages' },
    { label: 'Vehicles', value: counts.vehicles, icon: Car, color: '#8b5cf6', route: '/admin/vehicles' },
    { label: 'Partners', value: counts.partners, icon: Handshake, color: '#14b8a6', route: '/admin/partners' },
  ];

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Command Center</Text>
          <Text style={styles.subtitle}>{todayStr} — Overview & operations hub</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={16} color={MUTED_TEXT} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search bookings, packages, dest..."
            placeholderTextColor={MUTED_TEXT}
            editable={false}
          />
        </View>

        {/* KPI Grid - 2 Columns */}
        <View style={styles.grid}>
          {KPIS.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <Pressable
                key={i}
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => router.push(kpi.route as any)}>
                
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>{kpi.label}</Text>
                  <View style={[styles.iconBox, { borderColor: BORDER, backgroundColor: kpi.color + '10' }]}>
                    <Icon size={16} color={kpi.color} />
                  </View>
                </View>
                
                <Text style={styles.cardValue} numberOfLines={1} adjustsFontSizeToFit>
                  {kpi.value}
                </Text>
                
              </Pressable>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: DARK_TEXT,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontFamily: 'Times New Roman', // Attempt serif fallback
    marginBottom: 6,
  },
  subtitle: {
    color: MUTED_TEXT,
    fontSize: 13,
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121715',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 10,
  },
  searchInput: {
    color: DARK_TEXT,
    fontSize: 14,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: DARK_CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1D2522',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLabel: {
    color: '#D8E2DC',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: {
    color: DARK_TEXT,
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'Times New Roman', // Matches the serif look from screenshot
    letterSpacing: -0.5,
  },
});
