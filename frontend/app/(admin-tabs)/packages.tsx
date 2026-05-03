import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Search, Plus, X } from 'lucide-react-native';

import { getPackageImage } from '@/constants/images';
import { api, getApiError } from '@/lib/api';
import { PackageItem } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED = '#8B9A96';
const BORDER = '#222B28';
const GOLD = '#D4AF37';
const INPUT_BG = '#121715';
const EMERALD = '#063f32';

export default function AdminPackagesScreen() {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState('3 Days');
  const [priceMin, setPriceMin] = useState('50000');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const load = useCallback(() => {
    api.get('/packages').then((r) => setItems(r.data.data)).catch((e) => Alert.alert('Load failed', getApiError(e)));
  }, []);

  useFocusEffect(load);

  function startEdit(item: PackageItem) {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditSummary(item.summary);
    setEditDuration(item.duration);
    setEditPrice(String(item.priceMin));
    setEditImage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditImage(null);
  }

  async function create() {
    if (title.trim().length < 2 || summary.trim().length < 3) {
      Alert.alert('Missing details', 'Enter a title and summary.');
      return;
    }
    if (!Number.isFinite(Number(priceMin)) || Number(priceMin) < 0) {
      Alert.alert('Invalid price', 'Enter a valid LKR price.');
      return;
    }
    const form = new FormData();
    form.append('title', title);
    form.append('summary', summary);
    form.append('duration', duration);
    form.append('durationDays', '3');
    form.append('priceMin', priceMin);
    form.append('priceMax', priceMin);
    form.append('isPublished', 'true');
    appendImage(form, image);
    try {
      await api.post('/packages', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTitle(''); setSummary(''); setImage(null); setShowForm(false);
      load();
    } catch (error) {
      Alert.alert('Create failed', getApiError(error));
    }
  }

  async function saveEdit(id: string) {
    if (editTitle.trim().length < 2) {
      Alert.alert('Missing title', 'Title must be at least 2 characters.');
      return;
    }
    if (!Number.isFinite(Number(editPrice)) || Number(editPrice) < 0) {
      Alert.alert('Invalid price', 'Enter a valid price.');
      return;
    }
    const form = new FormData();
    form.append('title', editTitle);
    form.append('summary', editSummary);
    form.append('duration', editDuration);
    form.append('priceMin', editPrice);
    form.append('priceMax', editPrice);
    appendImage(form, editImage);
    try {
      await api.put(`/packages/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      cancelEdit();
      load();
    } catch (error) {
      Alert.alert('Update failed', getApiError(error));
    }
  }

  async function remove(id: string) {
    Alert.alert('Delete Package', 'This cannot be undone.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/packages/${id}`); load(); }
        catch (e) { Alert.alert('Delete failed', getApiError(e)); }
      }},
    ]);
  }

  async function togglePublished(item: PackageItem) {
    const form = new FormData();
    form.append('isPublished', String(!item.isPublished));
    try {
      await api.put(`/packages/${item._id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      load();
    } catch (error) {
      Alert.alert('Publish update failed', getApiError(error));
    }
  }

  const filtered = items.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={s.screen}>
      <FlatList
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={s.headerSection}>
              <Text style={s.headerTitle}>Manage Packages</Text>
              <Text style={s.headerSub}>{items.length} active packages</Text>
            </View>

            {/* Search + Add */}
            <View style={s.topActions}>
              <View style={s.searchBar}>
                <Search size={16} color={MUTED} />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search packages..."
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
              <Pressable
                style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.8 }]}
                onPress={() => setShowForm(!showForm)}>
                <Plus size={20} color={DARK_TEXT} />
              </Pressable>
            </View>

            {/* Create Form */}
            {showForm && (
              <View style={s.formCard}>
                <Text style={s.formTitle}>Add New Package</Text>
                <DarkField label="Title" value={title} onChangeText={setTitle} placeholder="Package name" />
                <DarkField label="Summary" value={summary} onChangeText={setSummary} placeholder="Brief description" multiline />
                <DarkField label="Duration" value={duration} onChangeText={setDuration} placeholder="e.g. 3 Days" />
                <DarkField label="Price Min (LKR)" value={priceMin} onChangeText={setPriceMin} placeholder="50000" keyboardType="numeric" />
                <Pressable
                  style={[s.secondaryBtn, image && { borderColor: '#10b981' }]}
                  onPress={async () => setImage(await pickImage())}>
                  <Text style={[s.secondaryBtnText, image && { color: '#10b981' }]}>
                    {image ? 'Image Selected' : 'Pick Image'}
                  </Text>
                </Pressable>
                <View style={{ height: 8 }} />
                <View style={s.formActions}>
                  <Pressable style={s.primaryBtn} onPress={create}>
                    <Text style={s.primaryBtnText}>Create Package</Text>
                  </Pressable>
                  <Pressable style={s.secondaryBtn} onPress={() => setShowForm(false)}>
                    <Text style={s.secondaryBtnText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        }
        data={filtered}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyText}>
              {searchQuery ? 'No packages match your search.' : 'No packages yet. Tap + to add one.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            {editingId === item._id ? (
              <View style={s.cardInner}>
                <Text style={s.formTitle}>Edit Package</Text>
                <DarkField label="Title" value={editTitle} onChangeText={setEditTitle} />
                <DarkField label="Summary" value={editSummary} onChangeText={setEditSummary} multiline />
                <DarkField label="Duration" value={editDuration} onChangeText={setEditDuration} />
                <DarkField label="Price Min (LKR)" value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" />
                <Pressable
                  style={[s.secondaryBtn, editImage && { borderColor: '#10b981' }]}
                  onPress={async () => setEditImage(await pickImage())}>
                  <Text style={[s.secondaryBtnText, editImage && { color: '#10b981' }]}>
                    {editImage ? 'New Image Selected' : 'Change Image'}
                  </Text>
                </Pressable>
                <View style={{ height: 8 }} />
                <View style={s.formActions}>
                  <Pressable style={s.primaryBtn} onPress={() => saveEdit(item._id)}>
                    <Text style={s.primaryBtnText}>Save</Text>
                  </Pressable>
                  <Pressable style={s.secondaryBtn} onPress={cancelEdit}>
                    <Text style={s.secondaryBtnText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View>
                <Image
                  source={getPackageImage(item)}
                  style={s.thumb}
                  resizeMode="cover"
                />
                <View style={s.cardInner}>
                  <Text style={s.cardTitle}>{item.title}</Text>
                  <View style={s.metaRow}>
                    <Text style={s.cardSub}>{item.duration} · LKR {item.priceMin?.toLocaleString()}</Text>
                    <View style={[s.publishBadge, item.isPublished === false && s.draftBadge]}>
                      <Text style={[s.publishText, item.isPublished === false && s.draftText]}>
                        {item.isPublished === false ? 'Draft' : 'Published'}
                      </Text>
                    </View>
                  </View>
                  {item.summary ? <Text style={s.cardDesc} numberOfLines={2}>{item.summary}</Text> : null}
                  <View style={s.cardActions}>
                    <Pressable style={s.secondaryBtn} onPress={() => startEdit(item)}>
                      <Text style={s.secondaryBtnText}>Edit</Text>
                    </Pressable>
                    <Pressable style={s.secondaryBtn} onPress={() => togglePublished(item)}>
                      <Text style={s.secondaryBtnText}>{item.isPublished === false ? 'Publish' : 'Unpublish'}</Text>
                    </Pressable>
                    <Pressable style={s.dangerBtn} onPress={() => remove(item._id)}>
                      <Text style={s.dangerBtnText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

function DarkField({ label, value, onChangeText, placeholder, multiline, keyboardType }: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; multiline?: boolean; keyboardType?: 'numeric' | 'default';
}) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        style={[s.fieldInput, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#4A5550"
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DARK_BG },
  listContent: { padding: 20, paddingBottom: 40 },

  headerSection: { marginBottom: 20 },
  headerTitle: { color: DARK_TEXT, fontSize: 24, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
  headerSub: { color: MUTED, fontSize: 13, fontWeight: '500' },

  topActions: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 14, gap: 10, height: 46 },
  searchInput: { color: DARK_TEXT, fontSize: 14, flex: 1 },
  addBtn: { width: 46, height: 46, borderRadius: 12, backgroundColor: EMERALD, alignItems: 'center', justifyContent: 'center' },

  formCard: { backgroundColor: DARK_CARD, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: BORDER, marginBottom: 20 },
  formTitle: { color: GOLD, fontSize: 16, fontWeight: '700', marginBottom: 16, letterSpacing: 0.3 },
  formActions: { flexDirection: 'row', gap: 10 },

  card: { backgroundColor: DARK_CARD, borderRadius: 16, borderWidth: 1, borderColor: '#1D2522', marginBottom: 14, overflow: 'hidden' },
  cardInner: { padding: 16 },
  thumb: { width: '100%', height: 160, backgroundColor: '#1A241F' },
  cardTitle: { color: DARK_TEXT, fontSize: 17, fontWeight: '700', marginBottom: 4 },
  cardSub: { color: GOLD, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 },
  publishBadge: { backgroundColor: '#10b98120', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  publishText: { color: '#10b981', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  draftBadge: { backgroundColor: '#f59e0b20' },
  draftText: { color: '#f59e0b' },
  cardDesc: { color: MUTED, fontSize: 13, lineHeight: 18, marginBottom: 4 },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 14 },

  fieldWrap: { marginBottom: 14 },
  fieldLabel: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  fieldInput: { backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: DARK_TEXT, fontSize: 14 },

  primaryBtn: { backgroundColor: EMERALD, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  primaryBtnText: { color: DARK_TEXT, fontSize: 14, fontWeight: '700' },
  secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  secondaryBtnText: { color: MUTED, fontSize: 14, fontWeight: '600' },
  dangerBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3D1C1C', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  dangerBtnText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: MUTED, fontSize: 14, textAlign: 'center' },
});
