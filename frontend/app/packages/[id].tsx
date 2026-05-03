import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';

import { Button, Card, EmptyState } from '@/components/yatara/ui';
import { getPackageImage } from '@/constants/images';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { PackageItem } from '@/lib/types';

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
      <View style={s.screen}>
        <EmptyState text="Loading package details..." />
      </View>
    );
  }

  const highlights = item.highlights?.length ? item.highlights : ['Private tour planning', 'Local guide support', 'Comfortable transfers'];
  const inclusions = item.inclusions?.length ? item.inclusions : ['Accommodation planning', 'Transport coordination', 'Yatara Ceylon support'];
  const itinerary = item.itinerary?.length ? item.itinerary : [
    { day: 1, title: 'Arrival and orientation', description: 'Meet the team and begin the curated route.' },
    { day: 2, title: 'Signature experience', description: item.summary },
  ];

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Image source={getPackageImage(item)} style={s.heroImage} resizeMode="cover" />
          <LinearGradient colors={['rgba(6,63,50,0.05)', 'rgba(6,63,50,0.92)']} style={StyleSheet.absoluteFillObject} />
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <ArrowLeft color={Colors.white} size={20} />
          </Pressable>
          <View style={s.heroContent}>
            <View style={s.badge}>
              <Text style={s.badgeText}>{item.style || 'Available'}</Text>
            </View>
            <Text style={s.heroTitle}>{item.title}</Text>
            <Text style={s.heroMeta}>{item.duration} | From LKR {item.priceMin?.toLocaleString()}</Text>
          </View>
        </View>

        <View style={s.body}>
          <Card>
            <Text style={s.label}>Overview</Text>
            <Text style={s.bodyText}>{item.fullDescription || item.summary}</Text>
          </Card>

          <Card>
            <Text style={s.label}>Highlights</Text>
            {highlights.slice(0, 6).map((highlight) => (
              <Bullet key={highlight} text={highlight} />
            ))}
          </Card>

          <Card>
            <Text style={s.label}>Short Itinerary</Text>
            {itinerary.slice(0, 4).map((day) => (
              <View key={`${day.day}-${day.title}`} style={s.dayRow}>
                <View style={s.dayBadge}>
                  <Text style={s.dayBadgeText}>{day.day}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.dayTitle}>{day.title}</Text>
                  {day.description ? <Text style={s.dayText}>{day.description}</Text> : null}
                </View>
              </View>
            ))}
          </Card>

          <Card>
            <Text style={s.label}>Included Items</Text>
            {inclusions.slice(0, 6).map((itemText) => (
              <Bullet key={itemText} text={itemText} />
            ))}
          </Card>

          <View style={s.ctaRow}>
            <Button title="Book Now" onPress={() => router.push(`/booking/${item._id}`)} />
            <Button
              title="Contact WhatsApp"
              variant="secondary"
              icon={<MessageCircle color={Colors.deepEmerald} size={18} />}
              onPress={() => Linking.openURL(`https://wa.me/94771234567?text=${encodeURIComponent(`Hello Yatara Ceylon, I want details about ${item.title}.`)}`)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bulletRow}>
      <View style={s.dot} />
      <Text style={s.bodyText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.offWhite },
  hero: { height: 320, backgroundColor: Colors.deepEmerald },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(6,63,50,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: { position: 'absolute', left: 20, right: 20, bottom: 22 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.antiqueGold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  badgeText: { color: Colors.ink, ...Typography.tiny, fontWeight: '800', textTransform: 'uppercase' },
  heroTitle: { color: Colors.white, ...Typography.h1 },
  heroMeta: { color: 'rgba(255,255,255,0.82)', ...Typography.body, marginTop: 6 },
  body: { padding: 20, gap: 14 },
  label: { color: Colors.deepEmerald, ...Typography.overline, marginBottom: 10 },
  bodyText: { color: Colors.ink, ...Typography.body, flex: 1 },
  bulletRow: { flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.antiqueGold, marginTop: 7 },
  dayRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  dayBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.deepEmerald,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  dayBadgeText: { color: Colors.antiqueGold, ...Typography.captionBold },
  dayTitle: { color: Colors.deepEmerald, ...Typography.captionBold },
  dayText: { color: Colors.muted, ...Typography.caption, marginTop: 2 },
  ctaRow: { gap: 10, marginTop: 2, marginBottom: 28 },
});
