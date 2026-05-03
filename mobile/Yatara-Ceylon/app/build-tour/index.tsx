import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button, Field, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { api, getApiError } from '@/lib/api';

export default function BuildTourScreen() {
  const [phone, setPhone] = useState('');
  const [regions, setRegions] = useState('Kandy, Ella, Galle');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (phone.trim().length < 7) {
      Alert.alert('Invalid phone', 'Enter a valid phone number.');
      return;
    }
    if (regions.trim().length < 3) {
      Alert.alert('Missing regions', 'Enter at least one preferred region.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD format.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/bookings', {
        type: 'CUSTOM',
        phone,
        pax: 2,
        dateFrom,
        notes: `Custom tour regions: ${regions}. ${notes}`,
      });
      Alert.alert('Custom tour requested', 'The request was saved as a booking.');
      router.replace('/(tabs)/bookings');
    } catch (error) {
      Alert.alert('Request failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title>Build Tour</Title>
      <Subtitle>Simple mobile version of the custom tour planner for assignment scope.</Subtitle>
      <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Field label="Preferred Regions" value={regions} onChangeText={setRegions} />
      <Field label="Start Date YYYY-MM-DD" value={dateFrom} onChangeText={setDateFrom} />
      <Field label="Notes" value={notes} onChangeText={setNotes} multiline />
      <Button title="Request Custom Tour" onPress={submit} loading={loading} />
    </Screen>
  );
}
