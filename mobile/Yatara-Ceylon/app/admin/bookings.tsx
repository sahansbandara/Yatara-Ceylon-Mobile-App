import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Text } from 'react-native';

import { Button, Card, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Booking } from '@/lib/types';

const statuses = ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function ManageBookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);

  const load = useCallback(() => {
    api.get('/bookings').then((response) => setItems(response.data.data)).catch((error) => Alert.alert('Load failed', getApiError(error)));
  }, []);

  useFocusEffect(load);

  async function update(id: string, status: string) {
    await api.put(`/bookings/${id}/status`, { status });
    load();
  }

  return (
    <Screen>
      <Title>Manage Bookings</Title>
      <Subtitle>Member 3 booking status workflow.</Subtitle>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Card>
            <Text style={{ color: Colors.deepEmerald, fontWeight: '900' }}>{item.bookingNo}</Text>
            <Text style={{ color: Colors.ink }}>{item.customerName} • {item.packageId?.title || item.type}</Text>
            <Text style={{ color: Colors.antiqueGold, fontWeight: '900', marginTop: 6 }}>{item.status}</Text>
            <Button title={`Set ${statuses[index % statuses.length]}`} onPress={() => update(item._id, statuses[index % statuses.length])} />
          </Card>
        )}
      />
    </Screen>
  );
}
