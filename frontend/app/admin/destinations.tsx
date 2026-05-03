import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Divider, Field, Screen, SectionHeader } from '@/components/yatara/ui';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Destination } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

export default function ManageDestinationsScreen() {
  const [items, setItems] = useState<Destination[]>([]);

  // Create form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [bestSeason, setBestSeason] = useState('');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  // Inline edit state
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
      setTitle(''); setDescription(''); setRegion(''); setBestSeason(''); setImage(null);
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
    <Screen>
      <SectionHeader title="Manage Destinations" subtitle={`${items.length} listed destinations`} />
      <FlatList
        ListHeaderComponent={
          <Card style={{ marginBottom: 20 }}>
            <Text style={s.sectionTitle}>Add Destination</Text>
            <Field label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Sigiriya" />
            <Field label="Description" value={description} onChangeText={setDescription} multiline placeholder="Short description…" />
            <Field label="Region" value={region} onChangeText={setRegion} placeholder="e.g. Cultural Triangle" />
            <Field label="Best Season" value={bestSeason} onChangeText={setBestSeason} placeholder="e.g. Dec – Mar" />
            <Button title={image ? '✓ Image Selected' : 'Pick Image'} variant="secondary" onPress={async () => setImage(await pickImage())} />
            <View style={{ height: 10 }} />
            <Button title="Create Destination" onPress={create} />
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
                <Text style={s.sectionTitle}>Edit Destination</Text>
                <Field label="Title" value={editTitle} onChangeText={setEditTitle} />
                <Field label="Description" value={editDescription} onChangeText={setEditDescription} multiline />
                <Field label="Region" value={editRegion} onChangeText={setEditRegion} />
                <Field label="Best Season" value={editBestSeason} onChangeText={setEditBestSeason} />
                <Button title={editImage ? '✓ New Image' : 'Change Image'} variant="secondary" onPress={async () => setEditImage(await pickImage())} />
                <View style={{ height: 10 }} />
                <View style={s.actionRow}>
                  <Button title="Save" onPress={() => saveEdit(item._id)} fullWidth={false} />
                  <Button title="Cancel" variant="secondary" onPress={cancelEdit} fullWidth={false} />
                </View>
              </View>
            ) : (
              <View>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.itemSub}>{item.region || 'No region'}</Text>
                {item.bestSeason ? <Text style={s.itemMeta}>Best season: {item.bestSeason}</Text> : null}
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
  itemTitle: { color: Colors.deepEmerald, ...Typography.h4, marginBottom: 2 },
  itemSub: { color: Colors.muted, ...Typography.caption },
  itemMeta: { color: Colors.muted, ...Typography.tiny, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
