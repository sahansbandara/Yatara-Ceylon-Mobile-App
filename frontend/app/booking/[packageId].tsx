import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Field } from '@/components/yatara/ui';
import { getPackageImage } from '@/constants/images';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { PackageItem } from '@/lib/types';

export default function BookingRequestScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const { user } = useAuth();
  const [pkg, setPkg] = useState<PackageItem | null>(null);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().slice(0, 10));
  const [travelers, setTravelers] = useState('2');
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!packageId) return;
    api.get(`/packages/${packageId}`)
      .then((response) => setPkg(response.data.data))
      .catch((error) => Alert.alert('Could not load package', getApiError(error)));
  }, [packageId]);

  async function submit() {
    if (!name.trim()) {
      Alert.alert('Required', 'Enter your full name.');
      return;
    }
    if (phone.trim().length < 7) {
      Alert.alert('Required', 'Enter a valid phone number.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(travelDate)) {
      Alert.alert('Invalid date', 'Travel date must use YYYY-MM-DD format.');
      return;
    }
    if (!Number.isFinite(Number(travelers)) || Number(travelers) < 1) {
      Alert.alert('Required', 'Number of travelers must be at least 1.');
      return;
    }
    if (!pickupLocation.trim()) {
      Alert.alert('Required', 'Enter a pickup location.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/bookings', {
        packageId,
        customerName: name.trim(),
        phone: phone.trim(),
        pax: Number(travelers),
        dateFrom: travelDate,
        pickupLocation: pickupLocation.trim(),
        notes: notes.trim(),
      });
      Alert.alert('Booking Submitted', 'Your booking is now visible in My Bookings.');
      router.replace('/(tabs)/bookings');
    } catch (error) {
      Alert.alert('Booking failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.container}>
      <View style={s.headerWrap}>
        {pkg ? <Image source={getPackageImage(pkg)} style={s.headerImage} resizeMode="cover" /> : null}
        <LinearGradient colors={['rgba(6,63,50,0.2)', 'rgba(6,63,50,0.95)']} style={StyleSheet.absoluteFillObject} />
        <View style={s.headerContent}>
          <Text style={s.kicker}>REQUEST BOOKING</Text>
          <Text style={s.headerTitle}>{pkg?.title || 'Package Booking'}</Text>
          <Text style={s.headerSub}>{pkg ? `${pkg.duration} | From LKR ${pkg.priceMin?.toLocaleString()}` : 'Create your travel request'}</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.formArea} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Card>
            <Field label="Package" value={pkg?.title || 'Loading package...'} onChangeText={() => undefined} />
            <Field label="Full Name" value={name} onChangeText={setName} placeholder="Full name" />
            <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+94 77 123 4567" />
            <Field label="Travel Date (YYYY-MM-DD)" value={travelDate} onChangeText={setTravelDate} placeholder="2026-05-20" />
            <Field label="Number of Travelers" value={travelers} onChangeText={setTravelers} keyboardType="numeric" placeholder="2" />
            <Field label="Pickup Location" value={pickupLocation} onChangeText={setPickupLocation} placeholder="Colombo Airport / Hotel name" />
            <Field label="Special Notes" value={notes} onChangeText={setNotes} multiline placeholder="Dietary needs, celebrations, preferred route" />
          </Card>

          <Button title="Submit Booking" onPress={submit} loading={loading} />
          <Button title="Cancel" variant="secondary" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  headerWrap: { height: 230, justifyContent: 'flex-end', backgroundColor: Colors.deepEmerald },
  headerImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  headerContent: { padding: 22 },
  kicker: { color: Colors.antiqueGold, ...Typography.overline, marginBottom: 8 },
  headerTitle: { color: Colors.white, ...Typography.h1 },
  headerSub: { color: 'rgba(255,255,255,0.8)', ...Typography.caption, marginTop: 6 },
  formArea: { padding: 20, gap: 12, paddingBottom: 36 },
});
