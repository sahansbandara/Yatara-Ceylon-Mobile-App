import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Text } from 'react-native';

import { Card, EmptyState, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Booking } from '@/lib/types';

export default function BookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);

  useFocusEffect(useCallback(() => {
    api.get('/bookings/my')
      .then((response) => setItems(response.data.data))
      .catch((error) => Alert.alert('Could not load bookings', getApiError(error)));
  }, []));

  return (
    <Screen>
      <Title>My Bookings</Title>
      <Subtitle>Your booking history is filtered by the authenticated JWT user.</Subtitle>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<EmptyState text="No bookings yet. Create one from a package details screen." />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: Colors.deepEmerald, fontWeight: '900', fontSize: 17 }}>{item.bookingNo}</Text>
            <Text style={{ color: Colors.ink }}>{item.packageId?.title || 'Custom booking'}</Text>
            <Text style={{ color: Colors.muted, marginTop: 4 }}>{new Date(item.dates.from).toDateString()} • {item.pax} pax</Text>
            <Text style={{ color: Colors.antiqueGold, fontWeight: '900', marginTop: 8 }}>{item.status}</Text>
          </Card>
        )}
      />
    </Screen>
  );
}
