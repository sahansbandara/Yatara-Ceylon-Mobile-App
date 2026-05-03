import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Text } from 'react-native';

import { Card, EmptyState, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { PackageItem } from '@/lib/types';

export default function PackagesScreen() {
  const [items, setItems] = useState<PackageItem[]>([]);

  useEffect(() => {
    api.get('/packages?public=true')
      .then((response) => setItems(response.data.data))
      .catch((error) => Alert.alert('Could not load packages', getApiError(error)));
  }, []);

  return (
    <Screen>
      <Title>Packages</Title>
      <Subtitle>API-backed tour packages from the Express backend.</Subtitle>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<EmptyState text="No packages found." />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: Colors.deepEmerald, fontSize: 18, fontWeight: '900' }}>{item.title}</Text>
            <Text style={{ color: Colors.muted, marginVertical: 6 }}>{item.duration} • LKR {item.priceMin?.toLocaleString()}</Text>
            <Text style={{ color: Colors.ink }}>{item.summary}</Text>
            <Link href={`/packages/${item._id}`} style={{ color: Colors.deepEmerald, fontWeight: '900', marginTop: 12 }}>Details and booking</Link>
          </Card>
        )}
      />
    </Screen>
  );
}
