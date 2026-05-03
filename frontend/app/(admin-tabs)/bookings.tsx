import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { api, getApiError } from '@/lib/api';
import { toVivaStatus } from '@/lib/bookingStatus';
import { Booking, Partner, Vehicle } from '@/lib/types';

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
  return toVivaStatus(status) === filter.toUpperCase();
}

function getRelationId(value?: Vehicle | Partner | string) {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value._id;
}

function AssignmentSelector({
  label,
  emptyLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  emptyLabel: string;
  value?: string;
  options: { id: string; label: string }[];
  onChange: (value?: string) => void;
}) {
  return (
    <View style={s.selectorWrap}>
      <Text style={s.selectorLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.selectorOptions}>
        <Pressable
          style={[s.selectorPill, !value && s.selectorPillActive]}
          onPress={() => onChange(undefined)}>
          <Text style={[s.selectorText, !value && s.selectorTextActive]}>{emptyLabel}</Text>
        </Pressable>
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <Pressable
              key={option.id}
              style={[s.selectorPill, selected && s.selectorPillActive]}
              onPress={() => onChange(option.id)}>
              <Text style={[s.selectorText, selected && s.selectorTextActive]} numberOfLines={1}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function AdminBookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState<Record<string, { vehicleId?: string; hotelPartnerId?: string; supplierPartnerId?: string }>>({});

  const load = useCallback(() => {
    Promise.all([
      api.get('/bookings'),
      api.get('/vehicles'),
      api.get('/partners'),
    ])
      .then(([bookingRes, vehicleRes, partnerRes]) => {
        const loadedBookings: Booking[] = bookingRes.data.data;
        const loadedVehicles: Vehicle[] = vehicleRes.data.data;
        const loadedPartners: Partner[] = partnerRes.data.data;
        setItems(loadedBookings);
        setVehicles(loadedVehicles.filter((item) => item.status === 'AVAILABLE'));
        setPartners(loadedPartners.filter((item) => item.status === 'ACTIVE'));
        setAssignments((current) => {
          const next = { ...current };
          for (const booking of loadedBookings) {
            if (!next[booking._id]) {
              next[booking._id] = {
                vehicleId: getRelationId(booking.vehicleId),
                hotelPartnerId: getRelationId(booking.hotelPartnerId),
                supplierPartnerId: getRelationId(booking.supplierPartnerId),
              };
            }
          }
          return next;
        });
      })
      .catch((e) => Alert.alert('Load failed', getApiError(e)));
  }, []);

  useFocusEffect(load);

  async function setStatus(id: string, status: string, includeAssignments = false) {
    try {
      await api.put(`/bookings/${id}/status`, {
        status,
        ...(includeAssignments ? assignments[id] || {} : {}),
      });
      load();
    } catch (error) {
      Alert.alert('Update failed', getApiError(error));
    }
  }

  function updateAssignment(id: string, key: 'vehicleId' | 'hotelPartnerId' | 'supplierPartnerId', value?: string) {
    setAssignments((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        [key]: value,
      },
    }));
  }

  const hotels = partners.filter((item) => item.type === 'HOTEL');
  const suppliers = partners.filter((item) => item.type === 'SUPPLIER' || item.type === 'ACTIVITY' || item.type === 'RESTAURANT');

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
          const vivaStatus = toVivaStatus(item.status);
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
                    {vivaStatus}
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

              <View style={s.assignmentBox}>
                <Text style={s.assignmentTitle}>OPTIONAL ASSIGNMENTS</Text>
                <Text style={s.assignmentHelp}>Assign vehicle and hotel/supplier before confirming if needed.</Text>
                <AssignmentSelector
                  label="Vehicle"
                  emptyLabel="No Vehicle"
                  value={assignments[item._id]?.vehicleId}
                  options={vehicles.map((vehicle) => ({
                    id: vehicle._id,
                    label: `${vehicle.model}${vehicle.plateNumber ? ` (${vehicle.plateNumber})` : ''}`,
                  }))}
                  onChange={(value) => updateAssignment(item._id, 'vehicleId', value)}
                />
                <AssignmentSelector
                  label="Hotel Partner"
                  emptyLabel="No Hotel"
                  value={assignments[item._id]?.hotelPartnerId}
                  options={hotels.map((partner) => ({ id: partner._id, label: partner.name }))}
                  onChange={(value) => updateAssignment(item._id, 'hotelPartnerId', value)}
                />
                <AssignmentSelector
                  label="Supplier"
                  emptyLabel="No Supplier"
                  value={assignments[item._id]?.supplierPartnerId}
                  options={suppliers.map((partner) => ({ id: partner._id, label: `${partner.name} (${partner.type})` }))}
                  onChange={(value) => updateAssignment(item._id, 'supplierPartnerId', value)}
                />
              </View>

              {/* Action Buttons */}
              {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' ? (
                <View style={s.actionRow}>
                  {item.status === 'NEW' || item.status === 'PAYMENT_PENDING' ? (
                    <Pressable style={s.confirmBtn} onPress={() => setStatus(item._id, 'CONFIRMED', true)}>
                      <Text style={s.confirmBtnText}>Confirm + Assign</Text>
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

  assignmentBox: { backgroundColor: INPUT_BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 12, marginTop: 14 },
  assignmentTitle: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  assignmentHelp: { color: MUTED, fontSize: 11, marginBottom: 10, lineHeight: 16 },
  selectorWrap: { marginBottom: 10 },
  selectorLabel: { color: DARK_TEXT, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  selectorOptions: { gap: 8, paddingRight: 12 },
  selectorPill: { maxWidth: 210, borderRadius: 999, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: DARK_CARD },
  selectorPillActive: { backgroundColor: EMERALD, borderColor: '#0a4d3d' },
  selectorText: { color: MUTED, fontSize: 11, fontWeight: '700' },
  selectorTextActive: { color: GOLD },

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
