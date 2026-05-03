import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { api, getApiError } from '@/lib/api';
import { Partner } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED = '#8B9A96';
const BORDER = '#222B28';
const GOLD = '#D4AF37';
const INPUT_BG = '#121715';
const EMERALD = '#063f32';

const PARTNER_TYPES = ['HOTEL', 'RESTAURANT', 'ACTIVITY', 'SUPPLIER'];

export default function ManagePartnersScreen() {
  const [items, setItems] = useState<Partner[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [partnerType, setPartnerType] = useState('HOTEL');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const load = useCallback(() => {
    api.get('/partners').then((r) => setItems(r.data.data)).catch((e) => Alert.alert('Load failed', getApiError(e)));
  }, []);

  useFocusEffect(load);

  function startEdit(item: Partner) {
    setEditingId(item._id);
    setEditName(item.name);
    setEditType(item.type || 'HOTEL');
    setEditContact('');
    setEditPhone(item.phone);
    setEditEmail(item.email || '');
    setEditAddress('');
    setEditStatus(item.status);
  }

  function cancelEdit() { setEditingId(null); }

  async function create() {
    if (name.trim().length < 2) { Alert.alert('Required', 'Enter the partner name.'); return; }
    if (phone.trim().length < 7) { Alert.alert('Required', 'Enter a valid phone number.'); return; }
    if (email && !email.includes('@')) { Alert.alert('Invalid', 'Enter a valid email address.'); return; }
    const form = new FormData();
    form.append('type', partnerType);
    form.append('name', name);
    form.append('contactPerson', contactPerson);
    form.append('phone', phone);
    form.append('email', email);
    form.append('address', address);
    form.append('status', 'ACTIVE');
    appendImage(form, image);
    try {
      await api.post('/partners', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setName(''); setContactPerson(''); setPhone(''); setEmail(''); setAddress(''); setImage(null); setShowForm(false);
      load();
    } catch (e) { Alert.alert('Create failed', getApiError(e)); }
  }

  async function saveEdit(id: string) {
    if (editName.trim().length < 2) { Alert.alert('Required', 'Name must be at least 2 characters.'); return; }
    try {
      await api.put(`/partners/${id}`, {
        type: editType, name: editName, contactPerson: editContact,
        phone: editPhone, email: editEmail, address: editAddress, status: editStatus,
      });
      cancelEdit();
      load();
    } catch (e) { Alert.alert('Update failed', getApiError(e)); }
  }

  async function remove(id: string) {
    Alert.alert('Delete Partner', 'This cannot be undone.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/partners/${id}`); load(); }
        catch (e) { Alert.alert('Delete failed', getApiError(e)); }
      }},
    ]);
  }

  const statusColor = (status: string) => status === 'ACTIVE' ? '#10b981' : status === 'PENDING' ? '#f59e0b' : '#ef4444';

  return (
    <View style={s.screen}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={s.headerRow}>
              <View>
                <Text style={s.headerTitle}>Partners</Text>
                <Text style={s.headerSub}>{items.length} listed partners</Text>
              </View>
              <Pressable style={s.addBtn} onPress={() => setShowForm(!showForm)}>
                <Text style={s.addBtnText}>+ Add</Text>
              </Pressable>
            </View>

            {showForm && (
              <View style={s.formCard}>
                <Text style={s.formTitle}>Add Partner</Text>
                <View style={s.typeRow}>
                  {PARTNER_TYPES.map((t) => (
                    <Pressable key={t} style={[s.typePill, partnerType === t && s.typePillActive]} onPress={() => setPartnerType(t)}>
                      <Text style={[s.typePillText, partnerType === t && s.typePillTextActive]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
                <DarkField label="Partner Name" value={name} onChangeText={setName} placeholder="e.g. Cinnamon Grand" />
                <DarkField label="Contact Person" value={contactPerson} onChangeText={setContactPerson} placeholder="e.g. Mr. Perera" />
                <DarkField label="Phone" value={phone} onChangeText={setPhone} placeholder="+94 11 234 5678" keyboardType="numeric" />
                <DarkField label="Email" value={email} onChangeText={setEmail} placeholder="contact@hotel.lk" />
                <DarkField label="Address" value={address} onChangeText={setAddress} placeholder="e.g. Colombo 3" />
                <Pressable style={[s.secondaryBtn, image && { borderColor: '#10b981' }]} onPress={async () => setImage(await pickImage())}>
                  <Text style={[s.secondaryBtnText, image && { color: '#10b981' }]}>{image ? 'Image Selected' : 'Pick Image'}</Text>
                </Pressable>
                <View style={{ height: 8 }} />
                <View style={s.formActions}>
                  <Pressable style={s.primaryBtn} onPress={create}><Text style={s.primaryBtnText}>Create Partner</Text></Pressable>
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
                <Text style={s.formTitle}>Edit Partner</Text>
                <View style={s.typeRow}>
                  {PARTNER_TYPES.map((t) => (
                    <Pressable key={t} style={[s.typePill, editType === t && s.typePillActive]} onPress={() => setEditType(t)}>
                      <Text style={[s.typePillText, editType === t && s.typePillTextActive]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
                <DarkField label="Name" value={editName} onChangeText={setEditName} />
                <DarkField label="Contact Person" value={editContact} onChangeText={setEditContact} />
                <DarkField label="Phone" value={editPhone} onChangeText={setEditPhone} keyboardType="numeric" />
                <DarkField label="Email" value={editEmail} onChangeText={setEditEmail} />
                <DarkField label="Address" value={editAddress} onChangeText={setEditAddress} />
                <DarkField label="Status (ACTIVE / INACTIVE)" value={editStatus} onChangeText={setEditStatus} />
                <View style={{ height: 8 }} />
                <View style={s.formActions}>
                  <Pressable style={s.primaryBtn} onPress={() => saveEdit(item._id)}><Text style={s.primaryBtnText}>Save</Text></Pressable>
                  <Pressable style={s.secondaryBtn} onPress={cancelEdit}><Text style={s.secondaryBtnText}>Cancel</Text></Pressable>
                </View>
              </View>
            ) : (
              <View>
                <View style={s.cardTopRow}>
                  <View style={s.badge}><Text style={s.badgeText}>{item.type}</Text></View>
                  <View style={[s.badge, { backgroundColor: statusColor(item.status) + '20' }]}>
                    <Text style={[s.badgeText, { color: statusColor(item.status) }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={s.cardTitle}>{item.name}</Text>
                <Text style={s.cardSub}>{item.phone}</Text>
                {item.email ? <Text style={s.cardMeta}>{item.email}</Text> : null}
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
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  typePill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: INPUT_BG, borderWidth: 1, borderColor: BORDER },
  typePillActive: { backgroundColor: EMERALD, borderColor: '#0a4d3d' },
  typePillText: { color: MUTED, fontSize: 12, fontWeight: '700' },
  typePillTextActive: { color: GOLD },

  card: { backgroundColor: DARK_CARD, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#1D2522', marginBottom: 14 },
  cardTopRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  badge: { backgroundColor: INPUT_BG, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: BORDER },
  badgeText: { color: DARK_TEXT, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardTitle: { color: DARK_TEXT, fontSize: 17, fontWeight: '700', marginBottom: 4 },
  cardSub: { color: GOLD, fontSize: 13, fontWeight: '600' },
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
