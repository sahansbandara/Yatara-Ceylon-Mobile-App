import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { Card, Divider, EmptyState, Screen, SectionHeader, StatusBadge } from '@/components/yatara/ui';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Booking } from '@/lib/types';

export default function BookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      api.get('/bookings/my')
        .then((response) => setItems(response.data.data))
        .catch((error) => Alert.alert('Could not load bookings', getApiError(error)))
        .finally(() => setLoading(false));
    }, []),
  );

  return (
    <Screen>
      <SectionHeader
        title="My Bookings"
        subtitle={`${items.length} booking${items.length !== 1 ? 's' : ''}`}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState text="No bookings yet. Create one from a package details screen." />
          )
        }
        renderItem={({ item }) => (
          <Card>
            {/* Header row */}
            <View style={s.headerRow}>
              <View style={s.bookingNoWrap}>
                <Text style={s.bookingNo}>{item.bookingNo}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <Divider />

            {/* Package name */}
            <Text style={s.packageTitle}>
              {item.packageId?.title || 'Custom Tour Request'}
            </Text>

            {/* Details row */}
            <View style={s.detailsRow}>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Date</Text>
                <Text style={s.detailValue}>
                  {new Date(item.dates.from).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Guests</Text>
                <Text style={s.detailValue}>{item.pax} pax</Text>
              </View>
              {item.totalCost ? (
                <View style={s.detailItem}>
                  <Text style={s.detailLabel}>Total</Text>
                  <Text style={[s.detailValue, { color: Colors.antiqueGold }]}>
                    LKR {item.totalCost.toLocaleString()}
                  </Text>
                </View>
              ) : null}
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingNoWrap: {
    backgroundColor: Colors.offWhite,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bookingNo: {
    color: Colors.deepEmerald,
    ...Typography.captionBold,
    fontFamily: undefined, // system monospace is fine
    letterSpacing: 0.5,
  },
  packageTitle: {
    color: Colors.ink,
    ...Typography.h4,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: Colors.muted,
    ...Typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  detailValue: {
    color: Colors.deepEmerald,
    ...Typography.captionBold,
  },
});
