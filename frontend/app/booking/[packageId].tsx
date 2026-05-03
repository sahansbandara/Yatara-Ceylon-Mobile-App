import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Field } from '@/components/yatara/ui';
import { HeroImages } from '@/constants/images';
import { Colors, Typography } from '@/constants/theme';
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
    <View style={s.container}>
      {/* Decorative header */}
      <View style={s.headerWrap}>
        <Image source={HeroImages.backdrop} style={s.headerImage} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(6,63,50,0.3)', Colors.offWhite]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Booking{'\n'}Request</Text>
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
          {/* Step indicators */}
          <View style={s.steps}>
            {['Contact', 'Travel', 'Preferences'].map((step, idx) => (
              <View key={step} style={s.stepItem}>
                <View style={s.stepDot}>
                  <Text style={s.stepNum}>{idx + 1}</Text>
                </View>
                <Text style={s.stepLabel}>{step}</Text>
              </View>
            ))}
          </View>

          <Card>
            <Field label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+94 77 123 4567" />
            <Field label="Number of Guests" value={pax} onChangeText={setPax} keyboardType="numeric" placeholder="2" />
            <Field label="Start Date (YYYY-MM-DD)" value={dateFrom} onChangeText={setDateFrom} placeholder="2026-06-15" />
            <Field label="Pickup Location" value={pickupLocation} onChangeText={setPickupLocation} placeholder="Colombo Airport / Hotel name" />
            <Field label="Special Requests" value={specialRequests} onChangeText={setSpecialRequests} multiline placeholder="Dietary needs, accessibility, celebrations..." />
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
  steps: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  stepItem: { alignItems: 'center', gap: 6 },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.deepEmerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { color: Colors.antiqueGold, ...Typography.captionBold },
  stepLabel: { color: Colors.muted, ...Typography.tiny },
});
