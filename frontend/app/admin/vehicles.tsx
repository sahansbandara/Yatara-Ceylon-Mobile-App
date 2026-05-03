import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Text } from 'react-native';

import { Button, Card, Field, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

export default function ManageVehiclesScreen() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [seats, setSeats] = useState('4');
  const [dailyRate, setDailyRate] = useState('35000');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const load = useCallback(() => {
    api.get('/vehicles').then((response) => setItems(response.data.data)).catch((error) => Alert.alert('Load failed', getApiError(error)));
  }, []);

  useFocusEffect(load);

  async function create() {
    if (model.trim().length < 2) {
      Alert.alert('Missing model', 'Enter the vehicle model.');
      return;
    }
    if (!Number.isFinite(Number(seats)) || Number(seats) < 1) {
      Alert.alert('Invalid seats', 'Seats must be at least 1.');
      return;
    }
    if (!Number.isFinite(Number(dailyRate)) || Number(dailyRate) < 0) {
      Alert.alert('Invalid rate', 'Enter a valid daily rate.');
      return;
    }
    const form = new FormData();
    form.append('type', 'SUV');
    form.append('model', model);
    form.append('plateNumber', plateNumber);
    form.append('seats', seats);
    form.append('dailyRate', dailyRate);
    form.append('status', 'AVAILABLE');
    appendImage(form, image);
    await api.post('/vehicles', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setModel('');
    setPlateNumber('');
    setImage(null);
    load();
  }

  async function remove(id: string) {
    await api.delete(`/vehicles/${id}`);
    load();
  }

  async function update(item: Vehicle) {
    await api.put(`/vehicles/${item._id}`, {
      type: item.type || 'SUV',
      model: item.model,
      plateNumber: item.plateNumber,
      seats: item.seats,
      dailyRate: Number(item.dailyRate || 0) + 1000,
      status: item.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE',
    });
    load();
  }

  return (
    <Screen>
      <Title>Manage Vehicles</Title>
      <Subtitle>Member 4 vehicle CRUD and upload.</Subtitle>
      <FlatList
        ListHeaderComponent={
          <Card>
            <Field label="Model" value={model} onChangeText={setModel} />
            <Field label="Plate Number" value={plateNumber} onChangeText={setPlateNumber} />
            <Field label="Seats" value={seats} onChangeText={setSeats} keyboardType="numeric" />
            <Field label="Daily Rate" value={dailyRate} onChangeText={setDailyRate} keyboardType="numeric" />
            <Button title={image ? 'Image Selected' : 'Pick Image'} variant="secondary" onPress={async () => setImage(await pickImage())} />
            <Button title="Create Vehicle" onPress={() => create().catch((error) => Alert.alert('Create failed', getApiError(error)))} />
          </Card>
        }
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: Colors.deepEmerald, fontWeight: '900' }}>{item.model}</Text>
            <Text style={{ color: Colors.muted }}>{item.plateNumber} • {item.seats} seats • {item.status}</Text>
            <Button title="Update Status/Rate" variant="secondary" onPress={() => update(item).catch((error) => Alert.alert('Update failed', getApiError(error)))} />
            <Button title="Delete" variant="danger" onPress={() => remove(item._id)} />
          </Card>
        )}
      />
    </Screen>
  );
}
