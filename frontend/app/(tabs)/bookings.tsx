import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

import { Button, EmptyState } from '@/components/yatara/ui';
import { HeroImages, getPackageImage } from '@/constants/images';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { toVivaStatus } from '@/lib/bookingStatus';
import { Booking } from '@/lib/types';

const STATUS_COLORS = {
  PENDING: { bg: Colors.warningLight, fg: Colors.warning },
  CONFIRMED: { bg: Colors.successLight, fg: Colors.success },
  COMPLETED: { bg: Colors.infoLight, fg: Colors.info },
  CANCELLED: { bg: Colors.dangerLight, fg: Colors.danger },
};

export default function BookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/bookings/my')
      .then((response) => setItems(response.data.data))
      .catch((error) => Alert.alert('Could not load bookings', getApiError(error)))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(load);

  async function cancelBooking(id: string) {
    try {
      await api.delete(`/bookings/${id}`);
      load();
    } catch (error) {
      Alert.alert('Cancel failed', getApiError(error));
    }
  }

  return (
    <View style={s.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={
          <View style={s.header}>
            <Text style={s.kicker}>CUSTOMER DASHBOARD</Text>
            <Text style={s.title}>My Bookings</Text>
            <Text style={s.subtitle}>Track requests, admin confirmations, and completed journeys.</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <EmptyState text="No bookings yet. Create one from a package detail screen." />
          )
        }
        renderItem={({ item }) => {
          const status = toVivaStatus(item.status);
          const statusColor = STATUS_COLORS[status];
          const title = item.packageId?.title || (item.type === 'TRANSFER' ? 'Transfer Request' : 'Custom Tour Request');
          const imageSource = item.packageId ? getPackageImage(item.packageId) : HeroImages.dusk;
          const date = item.dates?.from ? new Date(item.dates.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date pending';
          const vehicle = typeof item.vehicleId === 'object' ? item.vehicleId : undefined;
          const hotel = typeof item.hotelPartnerId === 'object' ? item.hotelPartnerId : undefined;
          const supplier = typeof item.supplierPartnerId === 'object' ? item.supplierPartnerId : undefined;

          return (
            <View style={[s.card, Shadows.sm]}>
              <Image source={imageSource} style={s.image} resizeMode="cover" />
              <View style={s.body}>
                <View style={s.topRow}>
                  <Text style={s.bookingNo}>{item.bookingNo}</Text>
                  <View style={[s.statusBadge, { backgroundColor: statusColor.bg }]}>
                    <Text style={[s.statusText, { color: statusColor.fg }]}>{status}</Text>
                  </View>
                </View>
                <Text style={s.packageTitle}>{title}</Text>
                <Text style={s.meta}>{date} | {item.pax} Traveler{item.pax > 1 ? 's' : ''}</Text>
                <Text style={s.cost}>Total Cost: {item.totalCost ? `LKR ${item.totalCost.toLocaleString()}` : 'TBD'}</Text>
                {item.pickupLocation ? <Text style={s.note}>Pickup: {item.pickupLocation}</Text> : null}
                {vehicle || hotel || supplier ? (
                  <View style={s.assignmentBox}>
                    <Text style={s.assignmentTitle}>Admin Assignments</Text>
                    {vehicle ? <Text style={s.assignmentText}>Vehicle: {vehicle.model}{vehicle.plateNumber ? ` (${vehicle.plateNumber})` : ''}</Text> : null}
                    {hotel ? <Text style={s.assignmentText}>Hotel: {hotel.name}</Text> : null}
                    {supplier ? <Text style={s.assignmentText}>Supplier: {supplier.name}</Text> : null}
                    {item.adminNote ? <Text style={s.assignmentText}>Note: {item.adminNote}</Text> : null}
                  </View>
                ) : null}
                <View style={s.actionRow}>
                  <Button title="View Details" variant="secondary" fullWidth={false} onPress={() => Alert.alert(item.bookingNo, `${title}\nStatus: ${status}\nTravelers: ${item.pax}\nAdmin note: ${item.notes || item.specialRequests || 'No note yet.'}`)} />
                  {status !== 'CANCELLED' && status !== 'COMPLETED' ? (
                    <Pressable
                      style={s.cancelBtn}
                      onPress={() => Alert.alert('Cancel Booking', 'Set this booking to CANCELLED?', [
                        { text: 'No' },
                        { text: 'Yes', style: 'destructive', onPress: () => cancelBooking(item._id) },
                      ])}>
                      <Text style={s.cancelText}>Cancel Booking</Text>
                    </Pressable>
                  ) : null}
                  <Pressable
                    style={s.whatsappBtn}
                    onPress={() => Linking.openURL(`https://wa.me/94771234567?text=${encodeURIComponent(`Hello Yatara Ceylon, I need help with booking ${item.bookingNo}.`)}`)}>
                    <MessageCircle color={Colors.deepEmerald} size={16} />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />
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
    marginBottom: 18,
  },
  kicker: { color: Colors.antiqueGold, ...Typography.overline, marginBottom: 8 },
  title: { color: Colors.white, ...Typography.h1 },
  subtitle: { color: 'rgba(255,255,255,0.74)', ...Typography.body, marginTop: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 14,
  },
  image: { width: '100%', height: 145, backgroundColor: Colors.emerald },
  body: { padding: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  bookingNo: { color: Colors.antiqueGold, ...Typography.captionBold },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { ...Typography.tiny, fontWeight: '900' },
  packageTitle: { color: Colors.deepEmerald, ...Typography.h4, marginTop: 8 },
  meta: { color: Colors.muted, ...Typography.caption, marginTop: 4 },
  cost: { color: Colors.ink, ...Typography.captionBold, marginTop: 6 },
  note: { color: Colors.muted, ...Typography.caption, marginTop: 4 },
  assignmentBox: {
    backgroundColor: Colors.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 10,
    marginTop: 10,
  },
  assignmentTitle: { color: Colors.deepEmerald, ...Typography.captionBold, marginBottom: 4 },
  assignmentText: { color: Colors.muted, ...Typography.caption, marginTop: 2 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14, alignItems: 'center' },
  cancelBtn: {
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  cancelText: { color: Colors.danger, ...Typography.captionBold },
  whatsappBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
