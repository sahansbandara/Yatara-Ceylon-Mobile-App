import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';

import { Card, EmptyState, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
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

  if (!item) return <Screen><EmptyState text="Loading package..." /></Screen>;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>{item.title}</Title>
        <Subtitle>{item.duration} • LKR {item.priceMin?.toLocaleString()} onwards</Subtitle>
        <Card>
          <Text style={{ color: Colors.ink, lineHeight: 22 }}>{item.summary}</Text>
        </Card>
        <Card>
          <Text style={{ color: Colors.deepEmerald, fontWeight: '900', marginBottom: 8 }}>Highlights</Text>
          {(item.highlights || ['Private tour planning', 'Local operations support']).map((highlight) => (
            <Text key={highlight} style={{ color: Colors.ink, marginBottom: 4 }}>• {highlight}</Text>
          ))}
        </Card>
        <Link href={`/booking/${item._id}`} style={{ backgroundColor: Colors.deepEmerald, color: Colors.white, textAlign: 'center', padding: 14, borderRadius: 10, fontWeight: '900', overflow: 'hidden' }}>
          Request Booking
        </Link>
      </ScrollView>
    </Screen>
  );
}
