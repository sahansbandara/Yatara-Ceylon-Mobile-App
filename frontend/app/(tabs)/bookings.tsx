import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

import { EmptyState, Screen } from '@/components/yatara/ui';
import { api, getApiError } from '@/lib/api';
import { Booking } from '@/lib/types';

// Elite Dark Theme Constants
const DARK_BG = '#0B100E';
const CARD_BG = '#0C1310';
const INNER_CARD = '#0F1A15';
const BORDER = '#1A241F';
const GOLD = '#D4AF37';
const GREEN = '#10B981';
const MUTED = '#69736F';
const TEXT = '#F8F4EA';

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
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>My Bookings</Text>
        <Text style={s.headerSubtitle}>Track your travel inquiries and reservations</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState text="No bookings yet. Create one from a package details screen." />
          )
        }
        renderItem={({ item }) => {
          const isPackage = !!item.packageId;
          const title = item.packageId?.title || 'Custom Tour Request';
          // Use first image of the package, or a default fallback if none
          const imageUrl = item.packageId?.images?.[0] || 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80';
          
          return (
            <View style={s.card}>
              {/* Image Section */}
              <View style={s.imageContainer}>
                <Image source={{ uri: imageUrl }} style={s.image} />
                <View style={s.imageOverlay} />
                
                {/* Top Badges over image */}
                <View style={s.badgeRow}>
                  <View style={s.typeBadge}>
                    <Text style={s.typeBadgeText}>{isPackage ? 'PACKAGE' : 'CUSTOM'}</Text>
                  </View>
                  <View style={s.statusBadge}>
                    <CheckCircle2 size={12} color={TEXT} />
                    <Text style={s.statusBadgeText}>{item.status.replace('_', ' ')}</Text>
                  </View>
                </View>
              </View>

              {/* Content Section */}
              <View style={s.content}>
                <Text style={s.refText}>REF: {item.bookingNo}</Text>
                <Text style={s.titleText}>{title}</Text>

                {/* Inner Cards Grid */}
                <View style={s.innerGrid}>
                  <View style={s.innerCard}>
                    <Text style={s.innerLabel}>TRAVEL DATES</Text>
                    <Text style={s.innerValue}>
                      {new Date(item.dates.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {'\u2192'} {new Date(item.dates.to || item.dates.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <View style={s.innerCard}>
                    <Text style={s.innerLabel}>GUESTS</Text>
                    <Text style={s.innerValue}>{item.pax} Passenger{item.pax > 1 ? 's' : ''}</Text>
                  </View>
                </View>

                {/* Pricing Section */}
                {item.totalCost ? (
                  <View style={s.priceSection}>
                    <View>
                      <Text style={s.innerLabel}>TOTAL VALUE</Text>
                      <Text style={s.totalValue}>LKR {item.totalCost.toLocaleString()}</Text>
                    </View>
                    <View style={s.paidDueBox}>
                      <View style={s.paidBadge}>
                        <Text style={s.paidText}>PAID: LKR 0</Text>
                      </View>
                      <Text style={s.dueText}>DUE: LKR {item.totalCost.toLocaleString()}</Text>
                    </View>
                  </View>
                ) : null}

                {/* Action Button */}
                <Pressable style={s.actionButton}>
                  <Text style={s.actionText}>Request Refund</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Times New Roman',
    letterSpacing: -1,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: MUTED,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  badgeRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeBadge: {
    backgroundColor: 'rgba(11, 16, 14, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  typeBadgeText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.2)', // translucent green
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  statusBadgeText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  refText: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  titleText: {
    color: GOLD,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Times New Roman',
    marginBottom: 20,
  },
  innerGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  innerCard: {
    flex: 1,
    backgroundColor: INNER_CARD,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  innerLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  innerValue: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  totalValue: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '800',
  },
  paidDueBox: {
    alignItems: 'flex-end',
  },
  paidBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 4,
  },
  paidText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dueText: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A3530',
    alignItems: 'center',
  },
  actionText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '600',
  },
});
