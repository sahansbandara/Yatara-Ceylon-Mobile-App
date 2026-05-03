import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, EmptyState } from '@/components/yatara/ui';
import { getPackageImage } from '@/constants/images';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { PackageItem } from '@/lib/types';

const FILTERS = ['All', 'Luxury', 'Adventure', 'Family'] as const;
type Filter = typeof FILTERS[number];

export default function PackagesScreen() {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/packages?public=true')
      .then((response) => setItems(response.data.data))
      .catch((error) => Alert.alert('Could not load packages', getApiError(error)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return items;
    const needle = activeFilter.toLowerCase();
    return items.filter((item) => {
      const text = [
        item.style,
        item.type,
        item.title,
        item.summary,
        ...(item.tags || []),
        ...(item.highlights || []),
      ].join(' ').toLowerCase();
      return text.includes(needle);
    });
  }, [activeFilter, items]);

  return (
    <View style={s.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={
          <View>
            <View style={s.header}>
              <Text style={s.kicker}>PUBLIC PACKAGES</Text>
              <Text style={s.title}>Packages</Text>
              <Text style={s.subtitle}>Browse curated Sri Lanka journeys and request a booking.</Text>
            </View>
            <View style={s.filters}>
              {FILTERS.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
                    style={[s.filterPill, active && s.filterPillActive]}>
                    <Text style={[s.filterText, active && s.filterTextActive]}>{filter}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? null : <EmptyState text="No packages match this filter." />
        }
        renderItem={({ item }) => <PackageCard item={item} />}
      />
    </View>
  );
}

function PackageCard({ item }: { item: PackageItem }) {
  return (
    <View style={[s.card, Shadows.sm]}>
      <Image source={getPackageImage(item)} style={s.image} resizeMode="cover" />
      <View style={s.cardBody}>
        <View style={s.topRow}>
          <Text style={s.cardTitle} numberOfLines={2}>{item.title}</Text>
          <View style={s.statusBadge}>
            <Text style={s.statusText}>Available</Text>
          </View>
        </View>
        <Text style={s.meta}>{item.duration} | LKR {item.priceMin?.toLocaleString()}</Text>
        <Text style={s.summary} numberOfLines={3}>{item.summary}</Text>
        <View style={s.actionRow}>
          <Button title="View Details" variant="secondary" fullWidth={false} onPress={() => router.push(`/packages/${item._id}`)} />
          <Button title="Book Now" fullWidth={false} onPress={() => router.push(`/booking/${item._id}`)} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.offWhite },
  listContent: { padding: 20, paddingBottom: 36 },
  header: {
    backgroundColor: Colors.deepEmerald,
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
  },
  kicker: { color: Colors.antiqueGold, ...Typography.overline, marginBottom: 8 },
  title: { color: Colors.white, ...Typography.h1 },
  subtitle: { color: 'rgba(255,255,255,0.75)', ...Typography.body, marginTop: 4 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  filterPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterPillActive: { backgroundColor: Colors.deepEmerald, borderColor: Colors.deepEmerald },
  filterText: { color: Colors.muted, ...Typography.captionBold },
  filterTextActive: { color: Colors.antiqueGold },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  image: { width: '100%', height: 170, backgroundColor: Colors.emerald },
  cardBody: { padding: 14 },
  topRow: { gap: 8 },
  cardTitle: { color: Colors.deepEmerald, ...Typography.h4 },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.successLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: { color: Colors.success, ...Typography.tiny, fontWeight: '800' },
  meta: { color: Colors.antiqueGold, ...Typography.captionBold, marginTop: 6 },
  summary: { color: Colors.muted, ...Typography.caption, marginTop: 6 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap' },
});
