import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Divider, Field, Screen, SectionHeader } from '@/components/yatara/ui';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { Partner } from '@/lib/types';
import { appendImage, pickImage } from '@/lib/upload';

const PARTNER_TYPES = ['HOTEL', 'RESTAURANT', 'ACTIVITY', 'SUPPLIER'];

export default function ManagePartnersScreen() {
  const [items, setItems] = useState<Partner[]>([]);

  // Create form
  const [name, setName] = useState('');
  const [partnerType, setPartnerType] = useState('HOTEL');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  // Inline edit state
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
      setName(''); setContactPerson(''); setPhone(''); setEmail(''); setAddress(''); setImage(null);
      load();
    } catch (e) { Alert.alert('Create failed', getApiError(e)); }
  }

  async function saveEdit(id: string) {
    if (editName.trim().length < 2) { Alert.alert('Required', 'Name must be at least 2 characters.'); return; }
    try {
      await api.put(`/partners/${id}`, {
        type: editType,
        name: editName,
        contactPerson: editContact,
        phone: editPhone,
        email: editEmail,
        address: editAddress,
        status: editStatus,
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

  return (
    <Screen>
      <SectionHeader title="Manage Partners" subtitle={`${items.length} listed partners`} />
      <FlatList
        ListHeaderComponent={
          <Card style={{ marginBottom: 20 }}>
            <Text style={s.sectionTitle}>Add Partner</Text>
            <View style={s.typeRow}>
              {PARTNER_TYPES.map((t) => (
                <Button key={t} title={t} variant={partnerType === t ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setPartnerType(t)} />
              ))}
            </View>
            <Field label="Partner Name" value={name} onChangeText={setName} placeholder="e.g. Cinnamon Grand" />
            <Field label="Contact Person" value={contactPerson} onChangeText={setContactPerson} placeholder="e.g. Mr. Perera" />
            <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+94 11 234 5678" />
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="contact@hotel.lk" />
            <Field label="Address" value={address} onChangeText={setAddress} placeholder="e.g. Colombo 3" />
            <Button title={image ? '✓ Image Selected' : 'Pick Image'} variant="secondary" onPress={async () => setImage(await pickImage())} />
            <View style={{ height: 10 }} />
            <Button title="Create Partner" onPress={create} />
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
                <Text style={s.sectionTitle}>Edit Partner</Text>
                <View style={s.typeRow}>
                  {PARTNER_TYPES.map((t) => (
                    <Button key={t} title={t} variant={editType === t ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setEditType(t)} />
                  ))}
                </View>
                <Field label="Name" value={editName} onChangeText={setEditName} />
                <Field label="Contact Person" value={editContact} onChangeText={setEditContact} />
                <Field label="Phone" value={editPhone} onChangeText={setEditPhone} keyboardType="phone-pad" />
                <Field label="Email" value={editEmail} onChangeText={setEditEmail} keyboardType="email-address" />
                <Field label="Address" value={editAddress} onChangeText={setEditAddress} />
                <Field label="Status (ACTIVE / INACTIVE)" value={editStatus} onChangeText={setEditStatus} />
                <View style={{ height: 10 }} />
                <View style={s.actionRow}>
                  <Button title="Save" onPress={() => saveEdit(item._id)} fullWidth={false} />
                  <Button title="Cancel" variant="secondary" onPress={cancelEdit} fullWidth={false} />
                </View>
              </View>
            ) : (
              <View>
                <View style={s.headerRow}>
                  <View style={s.typeBadge}>
                    <Text style={s.typeText}>{item.type}</Text>
                  </View>
                  <View style={[s.typeBadge, { backgroundColor: item.status === 'ACTIVE' ? '#167a4520' : '#b4231820' }]}>
                    <Text style={[s.typeText, { color: item.status === 'ACTIVE' ? '#167a45' : '#b42318' }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={s.itemTitle}>{item.name}</Text>
                <Text style={s.itemSub}>{item.phone}</Text>
                {item.email ? <Text style={s.itemMeta}>{item.email}</Text> : null}
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
  headerRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  typeBadge: { backgroundColor: Colors.offWhite, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  typeText: { color: Colors.deepEmerald, ...Typography.tiny, fontWeight: '700' },
  itemTitle: { color: Colors.deepEmerald, ...Typography.h4, marginBottom: 2 },
  itemSub: { color: Colors.muted, ...Typography.caption },
  itemMeta: { color: Colors.muted, ...Typography.tiny, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
