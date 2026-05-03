import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Text } from 'react-native';

import { Button, Card, Field, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Partner } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

export default function ManagePartnersScreen() {
  const [items, setItems] = useState<Partner[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const load = useCallback(() => {
    api.get('/partners').then((response) => setItems(response.data.data)).catch((error) => Alert.alert('Load failed', getApiError(error)));
  }, []);

  useFocusEffect(load);

  async function create() {
    if (name.trim().length < 2) {
      Alert.alert('Missing partner name', 'Enter the partner name.');
      return;
    }
    if (phone.trim().length < 7) {
      Alert.alert('Invalid phone', 'Enter a valid phone number.');
      return;
    }
    if (email && !email.includes('@')) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }
    const form = new FormData();
    form.append('type', 'HOTEL');
    form.append('name', name);
    form.append('phone', phone);
    form.append('email', email);
    form.append('status', 'ACTIVE');
    appendImage(form, image);
    await api.post('/partners', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setName('');
    setPhone('');
    setEmail('');
    setImage(null);
    load();
  }

  async function remove(id: string) {
    await api.delete(`/partners/${id}`);
    load();
  }

  async function update(item: Partner) {
    await api.put(`/partners/${item._id}`, {
      type: item.type || 'HOTEL',
      name: item.name,
      phone: item.phone,
      email: item.email,
      status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      notes: 'Updated from mobile admin CRUD screen.',
    });
    load();
  }

  return (
    <Screen>
      <Title>Manage Partners</Title>
      <Subtitle>Member 6 partner CRUD and logo/image upload.</Subtitle>
      <FlatList
        ListHeaderComponent={
          <Card>
            <Field label="Name" value={name} onChangeText={setName} />
            <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Button title={image ? 'Image Selected' : 'Pick Image'} variant="secondary" onPress={async () => setImage(await pickImage())} />
            <Button title="Create Partner" onPress={() => create().catch((error) => Alert.alert('Create failed', getApiError(error)))} />
          </Card>
        }
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: Colors.deepEmerald, fontWeight: '900' }}>{item.name}</Text>
            <Text style={{ color: Colors.muted }}>{item.type} • {item.status}</Text>
            <Button title="Toggle Status" variant="secondary" onPress={() => update(item).catch((error) => Alert.alert('Update failed', getApiError(error)))} />
            <Button title="Delete" variant="danger" onPress={() => remove(item._id)} />
          </Card>
        )}
      />
    </Screen>
  );
}
