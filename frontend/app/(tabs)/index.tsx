import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  CategoryCard,
  EmptyState,
  HeroBanner,
  ImageCard,
  SectionHeader,
  Screen,
} from '@/components/yatara/ui';
import { DestinationImages, HeroImages, TOUR_CATEGORIES } from '@/constants/images';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Destination, PackageItem } from '@/lib/types';

export default function HomeScreen() {
  const { user, isAdmin } = useAuth();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [packageRes, destinationRes] = await Promise.all([
          api.get('/packages?public=true'),
          api.get('/destinations'),
        ]);
        setPackages(packageRes.data.data.slice(0, 4));
        setDestinations(destinationRes.data.data.slice(0, 6));
      } catch (error) {
        Alert.alert('Could not load home data', getApiError(error));
      }
    }
    load();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Traveler';

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <HeroBanner
          image={HeroImages.backdrop}
          title={`Ayubowan, ${firstName}`}
          subtitle="Your curated Sri Lanka experience awaits"
        />

        {/* Admin CTA */}
        {isAdmin ? (
          <Button
            title="Open Admin Dashboard"
            variant="gold"
            onPress={() => router.push('/admin')}
          />
        ) : null}

        {/* Tour Categories */}
        <SectionHeader title="Explore Journeys" subtitle="Curated experiences across Sri Lanka" />
        <FlatList
          data={TOUR_CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.title}
          contentContainerStyle={s.categoryList}
          renderItem={({ item }) => (
            <CategoryCard
              image={item.image}
              title={item.title}
              tags={item.tags}
              onPress={() => router.push('/(tabs)/packages')}
            />
          )}
        />

        {/* Featured Packages */}
        <SectionHeader
          title="Featured Packages"
          subtitle="Hand-picked journeys"
          action={{ label: 'View all', onPress: () => router.push('/(tabs)/packages') }}
        />
        {packages.length ? (
          packages.map((item) => (
            <ImageCard
              key={item._id}
              image={
                item.images?.[0]
                  ? { uri: item.images[0] }
                  : HeroImages.dawn
              }
              title={item.title}
              subtitle={`${item.duration} · LKR ${item.priceMin?.toLocaleString()}`}
              badge={item.style || 'Featured'}
              height={200}
              onPress={() => router.push(`/packages/${item._id}`)}
            />
          ))
        ) : (
          <EmptyState text="No packages loaded yet." />
        )}

        {/* Destinations */}
        <SectionHeader title="Destinations" subtitle="Iconic Sri Lankan regions" />
        <FlatList
          data={destinations}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          contentContainerStyle={s.destList}
          renderItem={({ item }) => {
            const slug = item.title?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
            const localImg = DestinationImages[slug];
            return (
              <View style={[s.destCard, Shadows.sm]}>
                <Image
                  source={
                    localImg ||
                    (item.images?.[0] ? { uri: item.images[0] } : HeroImages.dawn)
                  }
                  style={s.destImage}
                  resizeMode="cover"
                />
                <View style={s.destInfo}>
                  <Text style={s.destTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={s.destMeta} numberOfLines={1}>
                    {item.region || 'Sri Lanka'} · {item.bestSeason || 'Year-round'}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={s.quickActions}>
          <Card style={s.quickCard}>
            <Text style={s.quickEmoji}>🗺️</Text>
            <Text style={s.quickLabel}>Packages</Text>
            <Button
              title="Browse"
              variant="secondary"
              fullWidth={false}
              onPress={() => router.push('/(tabs)/packages')}
            />
          </Card>
          <Card style={s.quickCard}>
            <Text style={s.quickEmoji}>📋</Text>
            <Text style={s.quickLabel}>My Bookings</Text>
            <Button
              title="View"
              variant="secondary"
              fullWidth={false}
              onPress={() => router.push('/(tabs)/bookings')}
            />
          </Card>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  categoryList: { paddingRight: 20 },
  destList: { paddingRight: 20 },
  destCard: {
    width: 160,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: Colors.white,
  },
  destImage: { width: '100%', height: 110 },
  destInfo: { padding: 10 },
  destTitle: { color: Colors.deepEmerald, ...Typography.captionBold },
  destMeta: { color: Colors.muted, ...Typography.tiny, marginTop: 3 },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickCard: { flex: 1, alignItems: 'center', gap: 8 },
  quickEmoji: { fontSize: 28 },
  quickLabel: { color: Colors.deepEmerald, ...Typography.captionBold },
});
