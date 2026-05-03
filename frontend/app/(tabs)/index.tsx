import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BookOpen, CalendarDays, MessageCircle, Plane, Route, ShieldCheck, UserCheck } from 'lucide-react-native';

import { Button, Card, EmptyState, SectionHeader, StatCard } from '@/components/yatara/ui';
import { getPackageImage } from '@/constants/images';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toVivaStatus } from '@/lib/bookingStatus';
import { Booking, PackageItem } from '@/lib/types';

const TRANSFERS = [
  {
    title: 'Airport Pickup',
    subtitle: 'Arrivals and departures with meet-and-greet support',
    image: require('@/assets/transfers/cat-chauffeur.webp'),
    icon: Plane,
  },
  {
    title: 'Intercity Transfer',
    subtitle: 'Private transfers between Colombo, Kandy, Galle and Ella',
    image: require('@/assets/transfers/route-kandy-day.webp'),
    icon: Route,
  },
  {
    title: 'Hourly Chauffeur',
    subtitle: 'Reserve a driver and vehicle for flexible city travel',
    image: require('@/assets/transfers/route-colombo-hourly.webp'),
    icon: ShieldCheck,
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [packageRes, bookingRes] = await Promise.all([
          api.get('/packages?public=true'),
          api.get('/bookings/my'),
        ]);
        setPackages(packageRes.data.data.slice(0, 3));
        setBookings(bookingRes.data.data);
      } catch (error) {
        Alert.alert('Could not load dashboard', getApiError(error));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Traveler';
  const pending = bookings.filter((item) => toVivaStatus(item.status) === 'PENDING').length;
  const confirmed = bookings.filter((item) => toVivaStatus(item.status) === 'CONFIRMED').length;

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.header}>
          <Text style={s.kicker}>YATARA CEYLON MOBILE</Text>
          <Text style={s.title}>Hello, {firstName}</Text>
          <Text style={s.subtitle}>Plan your Sri Lankan journey</Text>
        </View>

        <View style={s.statRow}>
          <StatCard label="My Bookings" value={bookings.length} icon={<CalendarDays color={Colors.antiqueGold} size={20} />} />
          <StatCard label="Pending" value={pending} icon={<BookOpen color={Colors.warning} size={20} />} />
          <StatCard label="Confirmed" value={confirmed} icon={<UserCheck color={Colors.success} size={20} />} />
        </View>

        <SectionHeader
          title="Featured Packages"
          subtitle="Book from package details"
          action={{ label: 'View all', onPress: () => router.push('/(tabs)/packages') }}
        />
        {packages.length ? (
          <View style={s.packageList}>
            {packages.map((item) => (
              <PackagePreview key={item._id} item={item} />
            ))}
          </View>
        ) : (
          <EmptyState text={loading ? 'Loading packages...' : 'No public packages found.'} />
        )}

        <SectionHeader title="Transfer Services" subtitle="Simple transfer requests for tomorrow demo" />
        <FlatList
          data={TRANSFERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.title}
          contentContainerStyle={s.transferList}
          renderItem={({ item }) => {
            const Icon = item.icon;
            return (
              <View style={[s.transferCard, Shadows.sm]}>
                <Image source={item.image} style={s.transferImage} resizeMode="cover" />
                <View style={s.transferBody}>
                  <View style={s.transferIcon}>
                    <Icon color={Colors.deepEmerald} size={16} />
                  </View>
                  <Text style={s.transferTitle}>{item.title}</Text>
                  <Text style={s.transferText} numberOfLines={2}>{item.subtitle}</Text>
                  <Button
                    title="Request Transfer"
                    variant="secondary"
                    fullWidth={false}
                    onPress={() => router.push('/(tabs)/packages')}
                  />
                </View>
              </View>
            );
          }}
        />

        <SectionHeader title="Quick Actions" />
        <View style={s.quickGrid}>
          <QuickAction label="Browse Packages" icon={<BookOpen color={Colors.deepEmerald} size={20} />} onPress={() => router.push('/(tabs)/packages')} />
          <QuickAction label="My Bookings" icon={<CalendarDays color={Colors.deepEmerald} size={20} />} onPress={() => router.push('/(tabs)/bookings')} />
          <QuickAction label="Contact Admin" icon={<MessageCircle color={Colors.deepEmerald} size={20} />} onPress={() => Linking.openURL('https://wa.me/94771234567?text=Hello%20Yatara%20Ceylon%2C%20I%20need%20help%20with%20my%20booking.')} />
        </View>
      </ScrollView>
    </View>
  );
}

function PackagePreview({ item }: { item: PackageItem }) {
  return (
    <Card style={s.packageCard}>
      <Image source={getPackageImage(item)} style={s.packageImage} resizeMode="cover" />
      <View style={s.packageBody}>
        <View style={s.badge}>
          <Text style={s.badgeText}>AVAILABLE</Text>
        </View>
        <Text style={s.packageTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={s.packageMeta}>{item.duration} | LKR {item.priceMin?.toLocaleString()}</Text>
        <Text style={s.packageSummary} numberOfLines={2}>{item.summary}</Text>
        <View style={s.actionRow}>
          <Button title="View" variant="secondary" fullWidth={false} onPress={() => router.push(`/packages/${item._id}`)} />
          <Button title="Book Now" fullWidth={false} onPress={() => router.push(`/booking/${item._id}`)} />
        </View>
      </View>
    </Card>
  );
}

function QuickAction({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.quickCard, pressed && { opacity: 0.8 }]}>
      <View style={s.quickIcon}>{icon}</View>
      <Text style={s.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.offWhite },
  content: { padding: 20, paddingBottom: 34 },
  header: {
    backgroundColor: Colors.deepEmerald,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
    ...Shadows.md,
  },
  kicker: { color: Colors.antiqueGold, ...Typography.overline, marginBottom: 10 },
  title: { color: Colors.white, ...Typography.h1 },
  subtitle: { color: 'rgba(255,255,255,0.76)', ...Typography.body, marginTop: 4 },
  statRow: { flexDirection: 'row', gap: 10 },
  packageList: { gap: 12 },
  packageCard: { padding: 0, overflow: 'hidden' },
  packageImage: { width: '100%', height: 150, backgroundColor: Colors.emerald },
  packageBody: { padding: 14 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.successLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: { color: Colors.success, ...Typography.tiny, fontWeight: '800' },
  packageTitle: { color: Colors.deepEmerald, ...Typography.h4 },
  packageMeta: { color: Colors.antiqueGold, ...Typography.captionBold, marginTop: 4 },
  packageSummary: { color: Colors.muted, ...Typography.caption, marginTop: 6 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  transferList: { paddingRight: 20, gap: 12 },
  transferCard: {
    width: 230,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  transferImage: { width: '100%', height: 110, backgroundColor: Colors.emerald },
  transferBody: { padding: 12 },
  transferIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  transferTitle: { color: Colors.deepEmerald, ...Typography.captionBold },
  transferText: { color: Colors.muted, ...Typography.caption, marginVertical: 6 },
  quickGrid: { gap: 10 },
  quickCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { color: Colors.deepEmerald, ...Typography.bodyBold },
});
