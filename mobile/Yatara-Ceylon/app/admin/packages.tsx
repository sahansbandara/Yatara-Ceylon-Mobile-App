import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Text } from 'react-native';

import { Button, Card, Field, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { PackageItem } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

export default function ManagePackagesScreen() {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState('3 Days');
  const [priceMin, setPriceMin] = useState('50000');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const load = useCallback(() => {
    api.get('/packages').then((response) => setItems(response.data.data)).catch((error) => Alert.alert('Load failed', getApiError(error)));
  }, []);

  useFocusEffect(load);

  async function create() {
    try {
      if (title.trim().length < 2 || summary.trim().length < 3) {
        Alert.alert('Missing package details', 'Enter a title and summary.');
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
      appendImage(form, image);
      await api.post('/packages', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTitle('');
      setSummary('');
      setImage(null);
      load();
    } catch (error) {
      Alert.alert('Create failed', getApiError(error));
    }
  }

  async function remove(id: string) {
    await api.delete(`/packages/${id}`);
    load();
  }

  async function update(item: PackageItem) {
    await api.put(`/packages/${item._id}`, {
      title: item.title,
      summary: `${item.summary} Updated from mobile admin.`,
      duration: item.duration,
      durationDays: item.durationDays || 3,
      priceMin: Number(item.priceMin || 0) + 1000,
      priceMax: Number(item.priceMax || item.priceMin || 0) + 1000,
    });
    load();
  }

  return (
    <Screen>
      <Title>Manage Packages</Title>
      <Subtitle>Member 2 CRUD with optional image upload.</Subtitle>
      <FlatList
        ListHeaderComponent={
          <Card>
            <Field label="Title" value={title} onChangeText={setTitle} />
            <Field label="Summary" value={summary} onChangeText={setSummary} multiline />
            <Field label="Duration" value={duration} onChangeText={setDuration} />
            <Field label="Price LKR" value={priceMin} onChangeText={setPriceMin} keyboardType="numeric" />
            <Button title={image ? 'Image Selected' : 'Pick Image'} variant="secondary" onPress={async () => setImage(await pickImage())} />
            <Button title="Create Package" onPress={create} />
          </Card>
        }
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: Colors.deepEmerald, fontWeight: '900' }}>{item.title}</Text>
            <Text style={{ color: Colors.muted }}>{item.duration} • LKR {item.priceMin?.toLocaleString()}</Text>
            <Button title="Update Price/Summary" variant="secondary" onPress={() => update(item).catch((error) => Alert.alert('Update failed', getApiError(error)))} />
            <Button title="Delete" variant="danger" onPress={() => remove(item._id)} />
          </Card>
        )}
      />
    </Screen>
  );
}
