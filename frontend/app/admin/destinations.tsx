import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getDestinationImage } from '@/constants/images';
import { api, getApiError } from '@/lib/api';
import { Destination } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED = '#8B9A96';
const BORDER = '#222B28';
const GOLD = '#D4AF37';
const INPUT_BG = '#121715';
const EMERALD = '#063f32';

export default function ManageDestinationsScreen() {
  const [items, setItems] = useState<Destination[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [bestSeason, setBestSeason] = useState('');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRegion, setEditRegion] = useState('');
  const [editBestSeason, setEditBestSeason] = useState('');
  const [editImage, setEditImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const load = useCallback(() => {
    api.get('/destinations').then((r) => setItems(r.data.data)).catch((e) => Alert.alert('Load failed', getApiError(e)));
  }, []);

  useFocusEffect(load);

  function startEdit(item: Destination) {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditRegion(item.region || '');
    setEditBestSeason(item.bestSeason || '');
    setEditImage(null);
  }

  function cancelEdit() { setEditingId(null); setEditImage(null); }

  async function create() {
    if (title.trim().length < 2 || description.trim().length < 3) {
      Alert.alert('Required', 'Enter a title and description.');
      return;
    }
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('region', region);
    form.append('bestSeason', bestSeason);
    form.append('isPublished', 'true');
    appendImage(form, image);
    try {
      await api.post('/destinations', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTitle(''); setDescription(''); setRegion(''); setBestSeason(''); setImage(null); setShowForm(false);
      load();
    } catch (e) { Alert.alert('Create failed', getApiError(e)); }
  }

  async function saveEdit(id: string) {
    if (editTitle.trim().length < 2) { Alert.alert('Required', 'Title must be at least 2 characters.'); return; }
    const form = new FormData();
    form.append('title', editTitle);
    form.append('description', editDescription);
    form.append('region', editRegion);
    form.append('bestSeason', editBestSeason);
    form.append('isPublished', 'true');
    appendImage(form, editImage);
    try {
      await api.put(`/destinations/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      cancelEdit();
      load();
    } catch (e) { Alert.alert('Update failed', getApiError(e)); }
  }

  async function remove(id: string) {
    Alert.alert('Delete Destination', 'This cannot be undone.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/destinations/${id}`); load(); }
        catch (e) { Alert.alert('Delete failed', getApiError(e)); }
      }},
    ]);
  }

  return (
    <View style={s.screen}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={s.headerRow}>
              <View>
                <Text style={s.headerTitle}>Destinations</Text>
                <Text style={s.headerSub}>{items.length} listed destinations</Text>
              </View>
              <Pressable style={s.addBtn} onPress={() => setShowForm(!showForm)}>
                <Text style={s.addBtnText}>+ Add</Text>
              </Pressable>
            </View>

            {showForm && (
              <View style={s.formCard}>
                <Text style={s.formTitle}>Add Destination</Text>
                <DarkField label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Sigiriya" />
                <DarkField label="Description" value={description} onChangeText={setDescription} multiline placeholder="Short description..." />
                <DarkField label="Region" value={region} onChangeText={setRegion} placeholder="e.g. Cultural Triangle" />
                <DarkField label="Best Season" value={bestSeason} onChangeText={setBestSeason} placeholder="e.g. Dec - Mar" />
                <Pressable style={[s.secondaryBtn, image && { borderColor: '#10b981' }]} onPress={async () => setImage(await pickImage())}>
                  <Text style={[s.secondaryBtnText, image && { color: '#10b981' }]}>{image ? 'Image Selected' : 'Pick Image'}</Text>
                </Pressable>
                <View style={{ height: 8 }} />
                <View style={s.formActions}>
                  <Pressable style={s.primaryBtn} onPress={create}><Text style={s.primaryBtnText}>Create Destination</Text></Pressable>
                  <Pressable style={s.secondaryBtn} onPress={() => setShowForm(false)}><Text style={s.secondaryBtnText}>Cancel</Text></Pressable>
                </View>
              </View>
            )}
          </View>
        }
        data={items}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={s.card}>
            {editingId === item._id ? (
              <View>
                <Text style={s.formTitle}>Edit Destination</Text>
                <DarkField label="Title" value={editTitle} onChangeText={setEditTitle} />
                <DarkField label="Description" value={editDescription} onChangeText={setEditDescription} multiline />
                <DarkField label="Region" value={editRegion} onChangeText={setEditRegion} />
                <DarkField label="Best Season" value={editBestSeason} onChangeText={setEditBestSeason} />
                <Pressable style={[s.secondaryBtn, editImage && { borderColor: '#10b981' }]} onPress={async () => setEditImage(await pickImage())}>
                  <Text style={[s.secondaryBtnText, editImage && { color: '#10b981' }]}>{editImage ? 'New Image' : 'Change Image'}</Text>
                </Pressable>
                <View style={{ height: 8 }} />
                <View style={s.formActions}>
                  <Pressable style={s.primaryBtn} onPress={() => saveEdit(item._id)}><Text style={s.primaryBtnText}>Save</Text></Pressable>
                  <Pressable style={s.secondaryBtn} onPress={cancelEdit}><Text style={s.secondaryBtnText}>Cancel</Text></Pressable>
                </View>
              </View>
            ) : (
              <View>
                <Image source={getDestinationImage(item)} style={s.cardImage} resizeMode="cover" />
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={s.cardSub}>{item.region || 'No region'}</Text>
                <Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text>
                {item.bestSeason ? <Text style={s.cardMeta}>Best season: {item.bestSeason}</Text> : null}
                <View style={s.divider} />
                <View style={s.cardActions}>
                  <Pressable style={s.secondaryBtn} onPress={() => startEdit(item)}><Text style={s.secondaryBtnText}>Edit</Text></Pressable>
                  <Pressable style={s.dangerBtn} onPress={() => remove(item._id)}><Text style={s.dangerBtnText}>Delete</Text></Pressable>
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
        value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor="#4A5550" multiline={multiline} keyboardType={keyboardType}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DARK_BG },
  listContent: { padding: 20, paddingBottom: 40 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: DARK_TEXT, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  headerSub: { color: MUTED, fontSize: 13, fontWeight: '500', marginTop: 2 },
  addBtn: { backgroundColor: EMERALD, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18 },
  addBtnText: { color: DARK_TEXT, fontSize: 13, fontWeight: '700' },

  formCard: { backgroundColor: DARK_CARD, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: BORDER, marginBottom: 20 },
  formTitle: { color: GOLD, fontSize: 16, fontWeight: '700', marginBottom: 16, letterSpacing: 0.3 },
  formActions: { flexDirection: 'row', gap: 10 },

  card: { backgroundColor: DARK_CARD, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#1D2522', marginBottom: 14 },
  cardImage: { width: '100%', height: 150, borderRadius: 12, backgroundColor: INPUT_BG, marginBottom: 14 },
  cardTitle: { color: DARK_TEXT, fontSize: 17, fontWeight: '700', marginBottom: 4 },
  cardSub: { color: GOLD, fontSize: 13, fontWeight: '600' },
  cardDesc: { color: MUTED, fontSize: 13, lineHeight: 18, marginTop: 6 },
  cardMeta: { color: MUTED, fontSize: 11, fontWeight: '500', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#1D2522', marginVertical: 14 },
  cardActions: { flexDirection: 'row', gap: 10 },

  fieldWrap: { marginBottom: 14 },
  fieldLabel: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  fieldInput: { backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: DARK_TEXT, fontSize: 14 },

  primaryBtn: { backgroundColor: EMERALD, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  primaryBtnText: { color: DARK_TEXT, fontSize: 14, fontWeight: '700' },
  secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  secondaryBtnText: { color: MUTED, fontSize: 14, fontWeight: '600' },
  dangerBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3D1C1C', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  dangerBtnText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
});
