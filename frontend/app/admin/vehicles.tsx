import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { api, getApiError } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED = '#8B9A96';
const BORDER = '#222B28';
const GOLD = '#D4AF37';
const INPUT_BG = '#121715';
const EMERALD = '#063f32';

const VEHICLE_TYPES = ['SUV', 'CAR', 'VAN', 'BUS', 'MINIBUS'];

export default function ManageVehiclesScreen() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [model, setModel] = useState('');
  const [type, setType] = useState('SUV');
  const [plateNumber, setPlateNumber] = useState('');
  const [seats, setSeats] = useState('4');
  const [dailyRate, setDailyRate] = useState('35000');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editModel, setEditModel] = useState('');
  const [editType, setEditType] = useState('');
  const [editPlate, setEditPlate] = useState('');
  const [editSeats, setEditSeats] = useState('');
  const [editRate, setEditRate] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const load = useCallback(() => {
    api.get('/vehicles').then((r) => setItems(r.data.data)).catch((e) => Alert.alert('Load failed', getApiError(e)));
  }, []);

  useFocusEffect(load);

  function startEdit(item: Vehicle) {
    setEditingId(item._id);
    setEditModel(item.model);
    setEditType(item.type || 'SUV');
    setEditPlate(item.plateNumber || '');
    setEditSeats(String(item.seats));
    setEditRate(String(item.dailyRate));
    setEditStatus(item.status);
  }

  function cancelEdit() { setEditingId(null); }

  async function create() {
    if (model.trim().length < 2) { Alert.alert('Required', 'Enter the vehicle model.'); return; }
    if (!Number.isFinite(Number(seats)) || Number(seats) < 1) { Alert.alert('Invalid', 'Seats must be at least 1.'); return; }
    if (!Number.isFinite(Number(dailyRate)) || Number(dailyRate) < 0) { Alert.alert('Invalid', 'Enter a valid daily rate.'); return; }
    const form = new FormData();
    form.append('type', type);
    form.append('model', model);
    form.append('plateNumber', plateNumber);
    form.append('seats', seats);
    form.append('dailyRate', dailyRate);
    form.append('status', 'AVAILABLE');
    appendImage(form, image);
    try {
      await api.post('/vehicles', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setModel(''); setPlateNumber(''); setImage(null); setShowForm(false);
      load();
    } catch (e) { Alert.alert('Create failed', getApiError(e)); }
  }

  async function saveEdit(id: string) {
    if (editModel.trim().length < 2) { Alert.alert('Required', 'Enter a model name.'); return; }
    try {
      await api.put(`/vehicles/${id}`, {
        type: editType, model: editModel, plateNumber: editPlate,
        seats: Number(editSeats), dailyRate: Number(editRate), status: editStatus,
      });
      cancelEdit();
      load();
    } catch (e) { Alert.alert('Update failed', getApiError(e)); }
  }

  async function remove(id: string) {
    Alert.alert('Delete Vehicle', 'This cannot be undone.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/vehicles/${id}`); load(); }
        catch (e) { Alert.alert('Delete failed', getApiError(e)); }
      }},
    ]);
  }

  const statusColor = (status: string) => status === 'AVAILABLE' ? '#10b981' : status === 'MAINTENANCE' ? '#f59e0b' : '#ef4444';

  return (
    <View style={s.screen}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={s.headerRow}>
              <View>
                <Text style={s.headerTitle}>Fleet Management</Text>
                <Text style={s.headerSub}>{items.length} vehicles</Text>
              </View>
              <Pressable style={s.addBtn} onPress={() => setShowForm(!showForm)}>
                <Text style={s.addBtnText}>+ Add</Text>
              </Pressable>
            </View>

            {showForm && (
              <View style={s.formCard}>
                <Text style={s.formTitle}>Add Vehicle</Text>
                <View style={s.typeRow}>
                  {VEHICLE_TYPES.map((t) => (
                    <Pressable key={t} style={[s.typePill, type === t && s.typePillActive]} onPress={() => setType(t)}>
                      <Text style={[s.typePillText, type === t && s.typePillTextActive]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
                <DarkField label="Model" value={model} onChangeText={setModel} placeholder="e.g. Toyota Prado" />
                <DarkField label="Plate Number" value={plateNumber} onChangeText={setPlateNumber} placeholder="ABC-1234" />
                <DarkField label="Seats" value={seats} onChangeText={setSeats} keyboardType="numeric" />
                <DarkField label="Daily Rate (LKR)" value={dailyRate} onChangeText={setDailyRate} keyboardType="numeric" />
                <Pressable style={[s.secondaryBtn, image && { borderColor: '#10b981' }]} onPress={async () => setImage(await pickImage())}>
                  <Text style={[s.secondaryBtnText, image && { color: '#10b981' }]}>{image ? 'Image Selected' : 'Pick Image'}</Text>
                </Pressable>
                <View style={{ height: 8 }} />
                <View style={s.formActions}>
                  <Pressable style={s.primaryBtn} onPress={create}><Text style={s.primaryBtnText}>Create Vehicle</Text></Pressable>
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
                <Text style={s.formTitle}>Edit Vehicle</Text>
                <View style={s.typeRow}>
                  {VEHICLE_TYPES.map((t) => (
                    <Pressable key={t} style={[s.typePill, editType === t && s.typePillActive]} onPress={() => setEditType(t)}>
                      <Text style={[s.typePillText, editType === t && s.typePillTextActive]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
                <DarkField label="Model" value={editModel} onChangeText={setEditModel} />
                <DarkField label="Plate Number" value={editPlate} onChangeText={setEditPlate} />
                <DarkField label="Seats" value={editSeats} onChangeText={setEditSeats} keyboardType="numeric" />
                <DarkField label="Daily Rate (LKR)" value={editRate} onChangeText={setEditRate} keyboardType="numeric" />
                <DarkField label="Status (AVAILABLE / MAINTENANCE)" value={editStatus} onChangeText={setEditStatus} />
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
                <Text style={s.cardTitle}>{item.model}</Text>
                <Text style={s.cardSub}>{item.seats} seats · LKR {Number(item.dailyRate).toLocaleString()}/day</Text>
                <Text style={s.cardMeta}>{item.plateNumber || 'No plate'}</Text>
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
