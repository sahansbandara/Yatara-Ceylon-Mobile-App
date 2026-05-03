import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { EmptyState, ImageCard, Screen, SectionHeader, Tag } from '@/components/yatara/ui';
import { CategoryImages, HeroImages } from '@/constants/images';
import { Colors, Typography } from '@/constants/theme';

const STYLE_IMAGE: Record<string, any> = {
  heritage:    CategoryImages.heritage,
  cultural:    CategoryImages.heritage,
  wildlife:    CategoryImages.wildlife,
  adventure:   CategoryImages.adventure,
  wellness:    CategoryImages.ayurveda,
  luxury:      HeroImages.dusk,
  beach:       CategoryImages.coastal,
  marine:      CategoryImages.coastal,
  hillcountry: CategoryImages.hillCountry,
};
import { api, getApiError } from '@/lib/api';
import { PackageItem } from '@/lib/types';

export default function PackagesScreen() {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/packages?public=true')
      .then((response) => setItems(response.data.data))
      .catch((error) => Alert.alert('Could not load packages', getApiError(error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen>
      <SectionHeader
        title="Tour Packages"
        subtitle={`${items.length} curated journeys`}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          loading ? null : <EmptyState text="No packages found." />
        }
        renderItem={({ item }) => (
          <ImageCard
            image={
              item.images?.[0]
                ? { uri: item.images[0] }
                : (STYLE_IMAGE[item.style?.toLowerCase() ?? ''] ?? HeroImages.dawn)
            }
            title={item.title}
            subtitle={`${item.duration} · LKR ${item.priceMin?.toLocaleString()}`}
            badge={item.style || 'Package'}
            height={210}
            onPress={() => router.push(`/packages/${item._id}`)}
          >
            {item.highlights && item.highlights.length > 0 ? (
              <View style={s.tagRow}>
                {item.highlights.slice(0, 3).map((h) => (
                  <View key={h} style={s.pill}>
                    <Text style={s.pillText}>{h}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </ImageCard>
        )}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    color: 'rgba(255,255,255,0.9)',
    ...Typography.tiny,
  },
});
