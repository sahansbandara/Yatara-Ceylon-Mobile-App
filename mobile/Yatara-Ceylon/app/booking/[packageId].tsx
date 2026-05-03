import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Button, Field, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { api, getApiError } from '@/lib/api';

export default function BookingRequestScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const [phone, setPhone] = useState('');
  const [pax, setPax] = useState('2');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().slice(0, 10));
  const [pickupLocation, setPickupLocation] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (phone.trim().length < 7) {
      Alert.alert('Invalid phone', 'Enter a valid phone number.');
      return;
    }
    if (!Number.isFinite(Number(pax)) || Number(pax) < 1) {
      Alert.alert('Invalid passenger count', 'Passengers must be at least 1.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD format.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/bookings', {
        packageId,
        phone,
        pax: Number(pax || 1),
        dateFrom,
        pickupLocation,
        specialRequests,
      });
      Alert.alert('Booking created', 'Your request is now visible in My Bookings.');
      router.replace('/(tabs)/bookings');
    } catch (error) {
      Alert.alert('Booking failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Booking Request</Title>
        <Subtitle>Create a booking through the hosted Express API.</Subtitle>
        <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label="Passengers" value={pax} onChangeText={setPax} keyboardType="numeric" />
        <Field label="Start Date YYYY-MM-DD" value={dateFrom} onChangeText={setDateFrom} />
        <Field label="Pickup Location" value={pickupLocation} onChangeText={setPickupLocation} />
        <Field label="Special Requests" value={specialRequests} onChangeText={setSpecialRequests} multiline />
        <Button title="Submit Booking" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}
