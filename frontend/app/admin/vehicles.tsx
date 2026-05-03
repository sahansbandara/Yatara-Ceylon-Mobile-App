import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Divider, Field, Screen, SectionHeader } from '@/components/yatara/ui';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

const VEHICLE_TYPES = ['SUV', 'CAR', 'VAN', 'BUS', 'MINIBUS'];

export default function ManageVehiclesScreen() {
  const [items, setItems] = useState<Vehicle[]>([]);

  // Create form
  const [model, setModel] = useState('');
  const [type, setType] = useState('SUV');
  const [plateNumber, setPlateNumber] = useState('');
  const [seats, setSeats] = useState('4');
  const [dailyRate, setDailyRate] = useState('35000');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  // Inline edit state
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
      setModel(''); setPlateNumber(''); setImage(null);
      load();
    } catch (e) { Alert.alert('Create failed', getApiError(e)); }
  }

  async function saveEdit(id: string) {
    if (editModel.trim().length < 2) { Alert.alert('Required', 'Enter a model name.'); return; }
    try {
      await api.put(`/vehicles/${id}`, {
        type: editType,
        model: editModel,
        plateNumber: editPlate,
        seats: Number(editSeats),
        dailyRate: Number(editRate),
        status: editStatus,
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

  return (
    <Screen>
      <SectionHeader title="Manage Vehicles" subtitle={`${items.length} listed vehicles`} />
      <FlatList
        ListHeaderComponent={
          <Card style={{ marginBottom: 20 }}>
            <Text style={s.sectionTitle}>Add Vehicle</Text>
            <Field label={`Type: ${type} (tap to cycle)`} value={type} onChangeText={setType} placeholder="SUV / CAR / VAN / BUS" />
            <View style={s.typeRow}>
              {VEHICLE_TYPES.map((t) => (
                <Button key={t} title={t} variant={type === t ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setType(t)} />
              ))}
            </View>
            <Field label="Model" value={model} onChangeText={setModel} placeholder="e.g. Toyota Prado" />
            <Field label="Plate Number" value={plateNumber} onChangeText={setPlateNumber} placeholder="ABC-1234" />
            <Field label="Seats" value={seats} onChangeText={setSeats} keyboardType="numeric" />
            <Field label="Daily Rate (LKR)" value={dailyRate} onChangeText={setDailyRate} keyboardType="numeric" />
            <Button title={image ? '✓ Image Selected' : 'Pick Image'} variant="secondary" onPress={async () => setImage(await pickImage())} />
            <View style={{ height: 10 }} />
            <Button title="Create Vehicle" onPress={create} />
          </Card>
        }
        data={items}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card>
            {editingId === item._id ? (
              <View>
                <Text style={s.sectionTitle}>Edit Vehicle</Text>
                <View style={s.typeRow}>
                  {VEHICLE_TYPES.map((t) => (
                    <Button key={t} title={t} variant={editType === t ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setEditType(t)} />
                  ))}
                </View>
                <Field label="Model" value={editModel} onChangeText={setEditModel} />
                <Field label="Plate Number" value={editPlate} onChangeText={setEditPlate} />
                <Field label="Seats" value={editSeats} onChangeText={setEditSeats} keyboardType="numeric" />
                <Field label="Daily Rate (LKR)" value={editRate} onChangeText={setEditRate} keyboardType="numeric" />
                <Field label="Status (AVAILABLE / MAINTENANCE)" value={editStatus} onChangeText={setEditStatus} />
                <View style={{ height: 10 }} />
                <View style={s.actionRow}>
                  <Button title="Save" onPress={() => saveEdit(item._id)} fullWidth={false} />
                  <Button title="Cancel" variant="secondary" onPress={cancelEdit} fullWidth={false} />
                </View>
              </View>
            ) : (
              <View>
                <Text style={s.itemTitle}>{item.model}</Text>
                <Text style={s.itemSub}>{item.type} · {item.seats} seats · LKR {Number(item.dailyRate).toLocaleString()}/day</Text>
                <Text style={s.itemStatus}>{item.plateNumber || 'No plate'} · {item.status}</Text>
                <Divider />
                <View style={s.actionRow}>
                  <Button title="Edit" variant="secondary" onPress={() => startEdit(item)} fullWidth={false} />
                  <Button title="Delete" variant="danger" onPress={() => remove(item._id)} fullWidth={false} />
                </View>
              </View>
            )}
          </Card>
        )}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  sectionTitle: { color: Colors.deepEmerald, ...Typography.h4, marginBottom: 10 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  itemTitle: { color: Colors.deepEmerald, ...Typography.h4, marginBottom: 2 },
  itemSub: { color: Colors.muted, ...Typography.caption },
  itemStatus: { color: Colors.muted, ...Typography.tiny, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
