import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState, Screen } from '@/components/yatara/ui';
import { CategoryImages, HeroImages } from '@/constants/images';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { PackageItem } from '@/lib/types';

const STYLE_IMAGE: Record<string, ImageSourcePropType> = {
  heritage: CategoryImages.heritage,
  cultural: CategoryImages.heritage,
  wildlife: CategoryImages.wildlife,
  adventure: CategoryImages.adventure,
  wellness: CategoryImages.ayurveda,
  luxury: HeroImages.dusk,
  beach: CategoryImages.coastal,
  marine: CategoryImages.coastal,
  hillcountry: CategoryImages.hillCountry,
};

export default function PackageDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<PackageItem | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/packages/${id}`)
      .then((response) => setItem(response.data.data))
      .catch((error) => Alert.alert('Could not load package', getApiError(error)));
  }, [id]);

  if (!item) {
    return (
      <Screen>
        <EmptyState text="Loading package..." />
      </Screen>
    );
  }

  const heroImage = item.images?.[0]
    ? { uri: item.images[0] }
    : (STYLE_IMAGE[item.style?.toLowerCase() ?? ''] ?? HeroImages.dawn);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.offWhite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={s.heroWrap}>
          <Image source={heroImage} style={s.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(6,63,50,0.88)']}
            style={s.heroGradient}
          />
          <View style={s.heroContent}>
            {item.style ? (
              <View style={s.badge}>
                <Text style={s.badgeText}>{item.style}</Text>
              </View>
            ) : null}
            <Text style={s.heroTitle}>{item.title}</Text>
            <Text style={s.heroMeta}>
              {item.duration} · From LKR {item.priceMin?.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={s.body}>
          {/* Summary */}
          <Card>
            <Text style={s.cardLabel}>Overview</Text>
            <Text style={s.summaryText}>{item.summary}</Text>
          </Card>

          {/* Price range */}
          <Card>
            <Text style={s.cardLabel}>Price Range</Text>
            <View style={s.priceRow}>
              <View style={s.priceItem}>
                <Text style={s.priceLabel}>From</Text>
                <Text style={s.priceValue}>LKR {item.priceMin?.toLocaleString()}</Text>
              </View>
              <View style={s.priceDivider} />
              <View style={s.priceItem}>
                <Text style={s.priceLabel}>Up to</Text>
                <Text style={s.priceValue}>LKR {item.priceMax?.toLocaleString()}</Text>
              </View>
            </View>
          </Card>

          {/* Highlights */}
          <Card>
            <Text style={s.cardLabel}>Highlights</Text>
            {(item.highlights || ['Private tour planning', 'Local operations support']).map(
              (highlight, idx) => (
                <View key={highlight} style={s.highlightRow}>
                  <View style={s.highlightDot} />
                  <Text style={s.highlightText}>{highlight}</Text>
                </View>
              ),
            )}
          </Card>

          {/* Gallery */}
          {item.images && item.images.length > 1 ? (
            <>
              <Text style={s.galleryTitle}>Gallery</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.images.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    style={s.galleryImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </>
          ) : null}

          {/* CTA */}
          <Link
            href={`/booking/${item._id}`}
            style={s.ctaButton}>
            Request Booking
          </Link>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  heroWrap: { height: 300, backgroundColor: Colors.emerald },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 22 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.antiqueGold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  badgeText: {
    color: Colors.ink,
    ...Typography.tiny,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: { color: Colors.white, ...Typography.h1 },
  heroMeta: { color: 'rgba(255,255,255,0.8)', ...Typography.body, marginTop: 4 },
  body: { padding: 20 },
  cardLabel: {
    color: Colors.deepEmerald,
    ...Typography.overline,
    marginBottom: 10,
  },
  summaryText: { color: Colors.ink, ...Typography.body, lineHeight: 24 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  priceItem: { flex: 1, alignItems: 'center' },
  priceLabel: { color: Colors.muted, ...Typography.tiny, marginBottom: 4 },
  priceValue: { color: Colors.antiqueGold, ...Typography.h3 },
  priceDivider: { width: 1, height: 40, backgroundColor: Colors.borderLight },
  highlightRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.antiqueGold,
  },
  highlightText: { color: Colors.ink, ...Typography.body, flex: 1 },
  galleryTitle: { color: Colors.deepEmerald, ...Typography.h4, marginTop: 20, marginBottom: 12 },
  galleryImage: {
    width: 200,
    height: 130,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: Colors.emerald,
  },
  ctaButton: {
    backgroundColor: Colors.deepEmerald,
    color: Colors.white,
    textAlign: 'center',
    padding: 16,
    borderRadius: 14,
    fontWeight: '800',
    fontSize: 16,
    overflow: 'hidden',
    marginTop: 24,
    ...Shadows.sm,
  },
});
