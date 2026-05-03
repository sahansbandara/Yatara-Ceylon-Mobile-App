import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Field } from '@/components/yatara/ui';
import { HeroImages } from '@/constants/images';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function BookingRequestScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [pax, setPax] = useState('2');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [pickupLocation, setPickupLocation] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name.trim()) {
      Alert.alert('Required', 'Enter your name.');
      return;
    }
    if (phone.trim().length < 7) {
      Alert.alert('Required', 'Enter a valid phone number.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) {
      Alert.alert('Invalid date', 'Start date must be YYYY-MM-DD format.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateTo)) {
      Alert.alert('Invalid date', 'End date must be YYYY-MM-DD format.');
      return;
    }
    if (!Number.isFinite(Number(pax)) || Number(pax) < 1) {
      Alert.alert('Required', 'Passenger count must be at least 1.');
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
        customerName: name,
        phone,
        pax: Number(pax),
        dateFrom,
        dateTo,
        pickupLocation,
        specialRequests,
      });
      Alert.alert('Booking Submitted', 'Your request is now visible in My Bookings.');
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
        <Image source={HeroImages.backdrop} style={s.headerImage} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(6,63,50,0.3)', Colors.offWhite]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Request{'\n'}Booking</Text>
          <Text style={s.headerSub}>Secure your curated Sri Lanka journey</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.formArea}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Card>
            <Field label="Your Name" value={name} onChangeText={setName} placeholder="Full name" />
            <Field label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+94 77 123 4567" />
            <Field label="Number of Guests" value={pax} onChangeText={setPax} keyboardType="numeric" placeholder="2" />
            <Field label="Travel Start Date (YYYY-MM-DD)" value={dateFrom} onChangeText={setDateFrom} placeholder="2026-06-15" />
            <Field label="Travel End Date (YYYY-MM-DD)" value={dateTo} onChangeText={setDateTo} placeholder="2026-06-22" />
            <Field label="Pickup Location" value={pickupLocation} onChangeText={setPickupLocation} placeholder="Colombo Airport / Hotel name" />
            <Field label="Special Requests (Optional)" value={specialRequests} onChangeText={setSpecialRequests} multiline placeholder="Dietary needs, celebrations…" />
          </Card>

          <Button title="Submit Booking" onPress={submit} loading={loading} />
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  headerWrap: { height: 180, justifyContent: 'flex-end' },
  headerImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  headerContent: { padding: 22, paddingBottom: 16 },
  headerTitle: { color: Colors.white, ...Typography.h1, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  headerSub: { color: 'rgba(255,255,255,0.8)', ...Typography.caption, marginTop: 4 },
  formArea: { padding: 20 },
});
