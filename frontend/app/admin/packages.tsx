import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Divider, Field, Screen, SectionHeader } from '@/components/yatara/ui';
import { HeroImages } from '@/constants/images';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { PackageItem } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

export default function ManagePackagesScreen() {
  const [items, setItems] = useState<PackageItem[]>([]);

  // Create form
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState('3 Days');
  const [priceMin, setPriceMin] = useState('50000');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  // Inline edit state
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
    try {
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
      appendImage(form, image);
      await api.post('/packages', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTitle(''); setSummary(''); setImage(null);
      load();
    } catch (error) {
      Alert.alert('Create failed', getApiError(error));
    }
  }

  async function saveEdit(id: string) {
    try {
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

  return (
    <Screen>
      <SectionHeader title="Manage Packages" subtitle={`${items.length} listed journeys`} />
      <FlatList
        ListHeaderComponent={
          <Card style={{ marginBottom: 20 }}>
            <Text style={s.sectionTitle}>Add Package</Text>
            <Field label="Title" value={title} onChangeText={setTitle} />
            <Field label="Summary" value={summary} onChangeText={setSummary} multiline />
            <Field label="Duration (e.g. 3 Days)" value={duration} onChangeText={setDuration} />
            <Field label="Price Min (LKR)" value={priceMin} onChangeText={setPriceMin} keyboardType="numeric" />
            <Button title={image ? '✓ Image Selected' : 'Pick Image'} variant="secondary" onPress={async () => setImage(await pickImage())} />
            <View style={{ height: 10 }} />
            <Button title="Create Package" onPress={create} />
          </Card>
        }
        data={items}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card>
            {editingId === item._id ? (
              /* ── Edit form ── */
              <View>
                <Text style={s.sectionTitle}>Edit Package</Text>
                <Field label="Title" value={editTitle} onChangeText={setEditTitle} />
                <Field label="Summary" value={editSummary} onChangeText={setEditSummary} multiline />
                <Field label="Duration" value={editDuration} onChangeText={setEditDuration} />
                <Field label="Price Min (LKR)" value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" />
                <Button title={editImage ? '✓ New Image Selected' : 'Change Image'} variant="secondary" onPress={async () => setEditImage(await pickImage())} />
                <View style={{ height: 10 }} />
                <View style={s.actionRow}>
                  <Button title="Save" onPress={() => saveEdit(item._id)} fullWidth={false} />
                  <Button title="Cancel" variant="secondary" onPress={cancelEdit} fullWidth={false} />
                </View>
              </View>
            ) : (
              /* ── Display card ── */
              <View>
                <Image
                  source={item.images?.[0] ? { uri: item.images[0] } : HeroImages.dawn}
                  style={s.thumb}
                  resizeMode="cover"
                />
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.itemSub}>{item.duration} · LKR {item.priceMin?.toLocaleString()}</Text>
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
  thumb: { width: '100%', height: 140, borderRadius: 10, marginBottom: 10, backgroundColor: Colors.emerald },
  itemTitle: { color: Colors.deepEmerald, ...Typography.h4, marginBottom: 2 },
  itemSub: { color: Colors.muted, ...Typography.caption },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
