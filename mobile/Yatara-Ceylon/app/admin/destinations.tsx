import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Text } from 'react-native';

import { Button, Card, Field, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Destination } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

export default function ManageDestinationsScreen() {
  const [items, setItems] = useState<Destination[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Hill Country');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const load = useCallback(() => {
    api.get('/destinations').then((response) => setItems(response.data.data)).catch((error) => Alert.alert('Load failed', getApiError(error)));
  }, []);

  useFocusEffect(load);

  async function create() {
    if (title.trim().length < 2 || description.trim().length < 3) {
      Alert.alert('Missing destination details', 'Enter a title and description.');
      return;
    }
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('region', region);
    form.append('isPublished', 'true');
    appendImage(form, image);
    await api.post('/destinations', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setTitle('');
    setDescription('');
    setImage(null);
    load();
  }

  async function remove(id: string) {
    await api.delete(`/destinations/${id}`);
    load();
  }

  async function update(item: Destination) {
    await api.put(`/destinations/${item._id}`, {
      title: item.title,
      description: `${item.description} Updated from mobile admin.`,
      region: item.region === 'Hill Country' ? 'Cultural Triangle' : 'Hill Country',
      isPublished: true,
    });
    load();
  }

  return (
    <Screen>
      <Title>Manage Destinations</Title>
      <Subtitle>Member 5 destination CRUD and upload.</Subtitle>
      <FlatList
        ListHeaderComponent={
          <Card>
            <Field label="Title" value={title} onChangeText={setTitle} />
            <Field label="Description" value={description} onChangeText={setDescription} multiline />
            <Field label="Region" value={region} onChangeText={setRegion} />
            <Button title={image ? 'Image Selected' : 'Pick Image'} variant="secondary" onPress={async () => setImage(await pickImage())} />
            <Button title="Create Destination" onPress={() => create().catch((error) => Alert.alert('Create failed', getApiError(error)))} />
          </Card>
        }
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: Colors.deepEmerald, fontWeight: '900' }}>{item.title}</Text>
            <Text style={{ color: Colors.muted }}>{item.region}</Text>
            <Button title="Update Region" variant="secondary" onPress={() => update(item).catch((error) => Alert.alert('Update failed', getApiError(error)))} />
            <Button title="Delete" variant="danger" onPress={() => remove(item._id)} />
          </Card>
        )}
      />
    </Screen>
  );
}
