import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { api, getApiError } from '@/lib/api';
import { Booking } from '@/lib/types';

const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED = '#8B9A96';
const BORDER = '#222B28';
const GOLD = '#D4AF37';
const INPUT_BG = '#121715';
const EMERALD = '#063f32';

const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;
type FilterType = typeof FILTERS[number];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  NEW: { bg: '#f59e0b20', text: '#f59e0b' },
  PAYMENT_PENDING: { bg: '#f59e0b20', text: '#f59e0b' },
  ADVANCE_PAID: { bg: '#3b82f620', text: '#3b82f6' },
  CONFIRMED: { bg: '#10b98120', text: '#10b981' },
  ASSIGNED: { bg: '#8b5cf620', text: '#8b5cf6' },
  IN_PROGRESS: { bg: '#3b82f620', text: '#3b82f6' },
  COMPLETED: { bg: '#10b98120', text: '#10b981' },
  CANCELLED: { bg: '#ef444420', text: '#ef4444' },
};

function matchesFilter(status: string, filter: FilterType): boolean {
  if (filter === 'All') return true;
  if (filter === 'Pending') return status === 'NEW' || status === 'PAYMENT_PENDING';
  if (filter === 'Confirmed') return status === 'CONFIRMED' || status === 'ADVANCE_PAID' || status === 'ASSIGNED' || status === 'IN_PROGRESS';
  if (filter === 'Completed') return status === 'COMPLETED';
  if (filter === 'Cancelled') return status === 'CANCELLED';
  return true;
}

export default function AdminBookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(() => {
    api.get('/bookings')
      .then((r) => setItems(r.data.data))
      .catch((e) => Alert.alert('Load failed', getApiError(e)));
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

  const filtered = items.filter(b => {
    if (!matchesFilter(b.status, activeFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesBookingNo = b.bookingNo?.toLowerCase().includes(q);
      const matchesCustomer = b.customerName?.toLowerCase().includes(q);
      const matchesPackage = b.packageId?.title?.toLowerCase().includes(q);
      if (!matchesBookingNo && !matchesCustomer && !matchesPackage) return false;
    }
    return true;
  });

  const filterCounts: Record<FilterType, number> = {
    All: items.length,
    Pending: items.filter(b => matchesFilter(b.status, 'Pending')).length,
    Confirmed: items.filter(b => matchesFilter(b.status, 'Confirmed')).length,
    Completed: items.filter(b => matchesFilter(b.status, 'Completed')).length,
    Cancelled: items.filter(b => matchesFilter(b.status, 'Cancelled')).length,
  };

  return (
    <View style={s.screen}>
      <FlatList
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={s.headerSection}>
              <Text style={s.headerTitle}>Manage Bookings</Text>
              <Text style={s.headerSub}>Track customer reservations</Text>
            </View>

            {/* Search Bar */}
            <View style={s.searchBar}>
              <Search size={16} color={MUTED} />
              <TextInput
                style={s.searchInput}
                placeholder="Search customer, package, booking ID..."
                placeholderTextColor={MUTED}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={16} color={MUTED} />
                </Pressable>
              ) : null}
            </View>

            {/* Filter Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={s.filterContent}>
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    style={[s.filterPill, isActive && s.filterPillActive]}
                    onPress={() => setActiveFilter(filter)}>
                    <Text style={[s.filterText, isActive && s.filterTextActive]}>
                      {filter} ({filterCounts[filter]})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        data={filtered}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyText}>
              {searchQuery || activeFilter !== 'All'
                ? 'No bookings match your filters.'
                : 'No bookings found. New customer reservations will appear here.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusColor = STATUS_COLORS[item.status] || { bg: MUTED + '20', text: MUTED };
          return (
            <View style={s.card}>
              {/* Top Row: Booking No + Status */}
              <View style={s.cardTopRow}>
                <View style={s.bookingNoBadge}>
                  <Text style={s.bookingNoText}>{item.bookingNo}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: statusColor.bg }]}>
                  <Text style={[s.statusText, { color: statusColor.text }]}>
                    {item.status.replace(/_/g, ' ')}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={s.divider} />

              {/* Package & Customer */}
              <Text style={s.packageTitle}>{item.packageId?.title || 'Custom Tour Request'}</Text>
              <Text style={s.customerName}>{item.customerName || 'Unknown Customer'}</Text>

              {/* Details Grid */}
              <View style={s.detailsGrid}>
                <View style={s.detailCard}>
                  <Text style={s.detailLabel}>PAX</Text>
                  <Text style={s.detailValue}>{item.pax}</Text>
                </View>
                <View style={s.detailCard}>
                  <Text style={s.detailLabel}>DATE</Text>
                  <Text style={s.detailValue}>
                    {new Date(item.dates?.from || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <View style={s.detailCard}>
                  <Text style={s.detailLabel}>TOTAL</Text>
                  <Text style={[s.detailValue, { color: GOLD }]}>
                    {item.totalCost ? `LKR ${item.totalCost.toLocaleString()}` : 'TBD'}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' ? (
                <View style={s.actionRow}>
                  {item.status === 'NEW' || item.status === 'PAYMENT_PENDING' ? (
                    <Pressable style={s.confirmBtn} onPress={() => setStatus(item._id, 'CONFIRMED')}>
                      <Text style={s.confirmBtnText}>Confirm</Text>
                    </Pressable>
                  ) : null}
                  {item.status === 'CONFIRMED' || item.status === 'ASSIGNED' || item.status === 'IN_PROGRESS' ? (
                    <Pressable style={s.completeBtn} onPress={() => setStatus(item._id, 'COMPLETED')}>
                      <Text style={s.completeBtnText}>Complete</Text>
                    </Pressable>
                  ) : null}
                  <Pressable
                    style={s.cancelBtn}
                    onPress={() =>
                      Alert.alert('Cancel Booking', 'Mark this booking as cancelled?', [
                        { text: 'No' },
                        { text: 'Yes', style: 'destructive', onPress: () => setStatus(item._id, 'CANCELLED') },
                      ])
                    }>
                    <Text style={s.cancelBtnText}>Cancel</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DARK_BG },
  listContent: { padding: 20, paddingBottom: 40 },

  headerSection: { marginBottom: 16 },
  headerTitle: { color: DARK_TEXT, fontSize: 24, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
  headerSub: { color: MUTED, fontSize: 13, fontWeight: '500' },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 14, gap: 10, height: 46, marginBottom: 16 },
  searchInput: { color: DARK_TEXT, fontSize: 14, flex: 1 },

  filterScroll: { marginBottom: 20 },
  filterContent: { gap: 8 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER },
  filterPillActive: { backgroundColor: EMERALD, borderColor: '#0a4d3d' },
  filterText: { color: MUTED, fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: GOLD },

  card: { backgroundColor: DARK_CARD, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#1D2522', marginBottom: 14 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingNoBadge: { backgroundColor: INPUT_BG, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: BORDER },
  bookingNoText: { color: DARK_TEXT, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  divider: { height: 1, backgroundColor: '#1D2522', marginVertical: 14 },

  packageTitle: { color: DARK_TEXT, fontSize: 17, fontWeight: '700', marginBottom: 4 },
  customerName: { color: MUTED, fontSize: 13, fontWeight: '500', marginBottom: 14 },

  detailsGrid: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  detailCard: { flex: 1, backgroundColor: INPUT_BG, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: BORDER },
  detailLabel: { color: MUTED, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  detailValue: { color: DARK_TEXT, fontSize: 14, fontWeight: '700' },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16, flexWrap: 'wrap' },
  confirmBtn: { backgroundColor: EMERALD, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18 },
  confirmBtnText: { color: DARK_TEXT, fontSize: 13, fontWeight: '700' },
  completeBtn: { backgroundColor: '#10b98120', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18, borderWidth: 1, borderColor: '#10b98140' },
  completeBtnText: { color: '#10b981', fontSize: 13, fontWeight: '700' },
  cancelBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3D1C1C', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18 },
  cancelBtnText: { color: '#ef4444', fontSize: 13, fontWeight: '700' },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: MUTED, fontSize: 14, textAlign: 'center' },
});
