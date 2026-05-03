import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Search, UserCheck, UserX, X } from 'lucide-react-native';

import { Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { AdminUser } from '@/lib/types';

const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED = '#8B9A96';
const BORDER = '#222B28';
const GOLD = '#D4AF37';
const INPUT_BG = '#121715';
const EMERALD = '#063f32';

const FILTERS = ['All', 'Pending', 'Active', 'Inactive'] as const;
type Filter = typeof FILTERS[number];

function statusLabel(status: AdminUser['status']) {
  return status === 'PENDING_APPROVAL' ? 'PENDING' : status;
}

function statusColor(status: AdminUser['status']) {
  if (status === 'ACTIVE') return '#10b981';
  if (status === 'PENDING_APPROVAL') return '#f59e0b';
  return '#ef4444';
}

export default function ManageUsersScreen() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(() => {
    api.get('/users')
      .then((response) => setItems(response.data.data))
      .catch((error) => Alert.alert('Load failed', getApiError(error)));
  }, []);

  useFocusEffect(load);

  async function setStatus(id: string, status: AdminUser['status']) {
    try {
      await api.put(`/users/${id}/status`, { status });
      load();
    } catch (error) {
      Alert.alert('Update failed', getApiError(error));
    }
  }

  async function remove(id: string) {
    Alert.alert('Delete User', 'This soft-deletes the user account.', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/users/${id}`);
            load();
          } catch (error) {
            Alert.alert('Delete failed', getApiError(error));
          }
        },
      },
    ]);
  }

  const counts = {
    All: items.length,
    Pending: items.filter((item) => item.status === 'PENDING_APPROVAL').length,
    Active: items.filter((item) => item.status === 'ACTIVE').length,
    Inactive: items.filter((item) => item.status === 'INACTIVE').length,
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeFilter === 'Pending' && item.status !== 'PENDING_APPROVAL') return false;
      if (activeFilter === 'Active' && item.status !== 'ACTIVE') return false;
      if (activeFilter === 'Inactive' && item.status !== 'INACTIVE') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.name} ${item.email} ${item.phone || ''} ${item.role}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [activeFilter, items, searchQuery]);

  return (
    <View style={s.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={
          <View>
            <View style={s.headerRow}>
              <View>
                <Text style={s.headerTitle}>Users</Text>
                <Text style={s.headerSub}>{counts.Pending} pending approval | {items.length} total accounts</Text>
              </View>
            </View>

            <View style={s.searchBar}>
              <Search size={16} color={MUTED} />
              <TextInput
                style={s.searchInput}
                placeholder="Search users..."
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

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
              {FILTERS.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <Pressable key={filter} style={[s.filterPill, active && s.filterPillActive]} onPress={() => setActiveFilter(filter)}>
                    <Text style={[s.filterText, active && s.filterTextActive]}>{filter} ({counts[filter]})</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyText}>No users match this view.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardTop}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{item.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.email}>{item.email}</Text>
              </View>
              <View style={[s.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
                <Text style={[s.statusText, { color: statusColor(item.status) }]}>{statusLabel(item.status)}</Text>
              </View>
            </View>

            <View style={s.metaGrid}>
              <View style={s.metaCard}>
                <Text style={s.metaLabel}>ROLE</Text>
                <Text style={s.metaValue}>{item.role}</Text>
              </View>
              <View style={s.metaCard}>
                <Text style={s.metaLabel}>PHONE</Text>
                <Text style={s.metaValue}>{item.phone || 'Not set'}</Text>
              </View>
            </View>

            <View style={s.actionRow}>
              {item.status !== 'ACTIVE' ? (
                <Pressable style={s.approveBtn} onPress={() => setStatus(item._id, 'ACTIVE')}>
                  <UserCheck size={14} color={DARK_TEXT} />
                  <Text style={s.approveText}>Approve</Text>
                </Pressable>
              ) : null}
              {item.status !== 'INACTIVE' ? (
                <Pressable style={s.deactivateBtn} onPress={() => setStatus(item._id, 'INACTIVE')}>
                  <UserX size={14} color="#ef4444" />
                  <Text style={s.deactivateText}>Deactivate</Text>
                </Pressable>
              ) : null}
              <Pressable style={s.deleteBtn} onPress={() => remove(item._id)}>
                <Text style={s.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DARK_BG },
  listContent: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 16 },
  headerTitle: { color: DARK_TEXT, fontSize: 24, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
  headerSub: { color: MUTED, fontSize: 13, fontWeight: '500' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 14, gap: 10, height: 46, marginBottom: 14 },
  searchInput: { color: DARK_TEXT, fontSize: 14, flex: 1 },
  filterRow: { gap: 8, paddingBottom: 18 },
  filterPill: { borderRadius: 999, borderWidth: 1, borderColor: BORDER, backgroundColor: INPUT_BG, paddingHorizontal: 14, paddingVertical: 8 },
  filterPillActive: { backgroundColor: EMERALD, borderColor: '#0a4d3d' },
  filterText: { color: MUTED, ...Typography.captionBold },
  filterTextActive: { color: GOLD },
  card: { backgroundColor: DARK_CARD, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D2522', marginBottom: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1A1810', borderWidth: 1, borderColor: '#302A18', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: GOLD, fontSize: 14, fontWeight: '900' },
  name: { color: DARK_TEXT, fontSize: 16, fontWeight: '800' },
  email: { color: MUTED, fontSize: 12, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  metaGrid: { flexDirection: 'row', gap: 10, marginTop: 14 },
  metaCard: { flex: 1, backgroundColor: INPUT_BG, borderRadius: 10, borderWidth: 1, borderColor: BORDER, padding: 10 },
  metaLabel: { color: MUTED, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  metaValue: { color: DARK_TEXT, fontSize: 12, fontWeight: '700' },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  approveBtn: { backgroundColor: EMERALD, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
  approveText: { color: DARK_TEXT, fontSize: 13, fontWeight: '800' },
  deactivateBtn: { borderWidth: 1, borderColor: '#3D1C1C', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
  deactivateText: { color: '#ef4444', fontSize: 13, fontWeight: '800' },
  deleteBtn: { borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  deleteText: { color: MUTED, fontSize: 13, fontWeight: '800' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: MUTED, textAlign: 'center' },
});
