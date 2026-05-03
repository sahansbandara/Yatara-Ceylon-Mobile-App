import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Divider, Screen, SectionHeader, StatusBadge } from '@/components/yatara/ui';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Booking } from '@/lib/types';

export default function ManageBookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);

  const load = useCallback(() => {
    api.get('/bookings').then((response) => setItems(response.data.data)).catch((error) => Alert.alert('Load failed', getApiError(error)));
  }, []);

  useFocusEffect(load);

  async function setStatus(id: string, status: string) {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      load();
    } catch (error) {
      Alert.alert('Update failed', getApiError(error));
    }
  }

  return (
    <Screen>
      <SectionHeader title="Manage Bookings" subtitle={`${items.length} total bookings`} />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Card>
            <View style={s.headerRow}>
              <View style={s.bookingNoWrap}>
                <Text style={s.bookingNo}>{item.bookingNo}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <Divider />

            <Text style={s.packageTitle}>
              {item.packageId?.title || 'Custom Tour Request'}
            </Text>
            <Text style={s.customerName}>
              👤 {item.customerName || 'Unknown Customer'}
            </Text>

            <View style={s.detailsRow}>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Pax</Text>
                <Text style={s.detailValue}>{item.pax}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>From Date</Text>
                <Text style={s.detailValue}>
                  {new Date(item.dates?.from || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Total</Text>
                <Text style={[s.detailValue, { color: Colors.antiqueGold }]}>
                  {item.totalCost ? `LKR ${item.totalCost.toLocaleString()}` : 'TBD'}
                </Text>
              </View>
            </View>

            {/* Status action buttons */}
            {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' ? (
              <View style={s.statusButtons}>
                {item.status === 'NEW' ? (
                  <Button
                    title="Confirm"
                    onPress={() => setStatus(item._id, 'CONFIRMED')}
                    fullWidth={false}
                  />
                ) : null}
                {item.status === 'CONFIRMED' ? (
                  <Button
                    title="Complete"
                    onPress={() => setStatus(item._id, 'COMPLETED')}
                    fullWidth={false}
                  />
                ) : null}
                <Button
                  title="Cancel"
                  variant="danger"
                  onPress={() =>
                    Alert.alert('Cancel Booking', 'Mark this booking as cancelled?', [
                      { text: 'No' },
                      { text: 'Yes', style: 'destructive', onPress: () => setStatus(item._id, 'CANCELLED') },
                    ])
                  }
                  fullWidth={false}
                />
              </View>
            ) : null}
          </Card>
        )}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingNoWrap: { backgroundColor: Colors.offWhite, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  bookingNo: { color: Colors.deepEmerald, ...Typography.captionBold, letterSpacing: 0.5 },
  packageTitle: { color: Colors.ink, ...Typography.h4, marginBottom: 4 },
  customerName: { color: Colors.muted, ...Typography.caption, marginBottom: 12 },
  detailsRow: { flexDirection: 'row', gap: 16 },
  detailItem: { flex: 1 },
  detailLabel: { color: Colors.muted, ...Typography.tiny, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  detailValue: { color: Colors.deepEmerald, ...Typography.captionBold },
  statusButtons: { flexDirection: 'row', gap: 10, marginTop: 16, flexWrap: 'wrap' },
});
