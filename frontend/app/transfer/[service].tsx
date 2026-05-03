import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Card, Field } from '@/components/yatara/ui';
import { Colors, Typography } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const TRANSFER_META: Record<string, { title: string; subtitle: string; image: number }> = {
  airport: {
    title: 'Airport Pickup',
    subtitle: 'Arrivals and departures with meet-and-greet support',
    image: require('@/assets/transfers/cat-chauffeur.webp'),
  },
  intercity: {
    title: 'Intercity Transfer',
    subtitle: 'Private transfers between Colombo, Kandy, Galle and Ella',
    image: require('@/assets/transfers/route-kandy-day.webp'),
  },
  hourly: {
    title: 'Hourly Chauffeur',
    subtitle: 'Reserve a driver and vehicle for flexible city travel',
    image: require('@/assets/transfers/route-colombo-hourly.webp'),
  },
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function minimumTravelDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 2);
  return date;
}

function normalizeSriLankanLocalPhone(value?: string) {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.startsWith('94')) return digits.slice(2, 11);
  if (digits.startsWith('0')) return digits.slice(1, 10);
  return digits.slice(0, 9);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function monthLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function isValidLocation(value: string) {
  const trimmed = value.trim();
  return trimmed.length >= 3 && /[A-Za-z]/.test(trimmed);
}

export default function TransferRequestScreen() {
  const { service } = useLocalSearchParams<{ service: string }>();
  const { user } = useAuth();
  const meta = TRANSFER_META[service || ''] || TRANSFER_META.airport;
  const [name, setName] = useState(user?.name || '');
  const [phoneDigits, setPhoneDigits] = useState(normalizeSriLankanLocalPhone(user?.phone));
  const [travelDate, setTravelDate] = useState(formatDate(minimumTravelDate()));
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(minimumTravelDate()));
  const [travelers, setTravelers] = useState('2');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name.trim()) {
      Alert.alert('Required', 'Enter your full name.');
      return;
    }
    if (!/^\d{9}$/.test(phoneDigits)) {
      Alert.alert('Invalid phone', 'Enter exactly 9 digits after +94. Example: 771234567.');
      return;
    }
    const selectedDate = new Date(`${travelDate}T00:00:00`);
    const minDate = minimumTravelDate();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(travelDate) || Number.isNaN(selectedDate.getTime()) || selectedDate < minDate) {
      Alert.alert('Invalid travel date', `Travel date must be ${formatDate(minDate)} or later.`);
      return;
    }
    if (!Number.isFinite(Number(travelers)) || Number(travelers) < 1) {
      Alert.alert('Required', 'Number of travelers must be at least 1.');
      return;
    }
    if (!isValidLocation(pickupLocation)) {
      Alert.alert('Invalid pickup location', 'Pickup location must be a text location with at least 3 characters.');
      return;
    }
    if (!isValidLocation(dropoffLocation)) {
      Alert.alert('Invalid drop-off location', 'Drop-off location must be a text location with at least 3 characters.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/bookings', {
        customerName: name.trim(),
        phone: `+94${phoneDigits}`,
        type: 'TRANSFER',
        pax: Number(travelers),
        dateFrom: travelDate,
        pickupLocation: `${pickupLocation.trim()} to ${dropoffLocation.trim()}`,
        notes: `${meta.title}. ${notes.trim()}`.trim(),
        totalCost: 0,
      });
      Alert.alert('Transfer Requested', 'Your transfer request is now visible in My Bookings.');
      router.replace('/(tabs)/bookings');
    } catch (error) {
      Alert.alert('Transfer request failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.container}>
      <View style={s.headerWrap}>
        <Image source={meta.image} style={s.headerImage} resizeMode="cover" />
        <LinearGradient colors={['rgba(6,63,50,0.2)', 'rgba(6,63,50,0.95)']} style={StyleSheet.absoluteFillObject} />
        <View style={s.headerContent}>
          <Text style={s.kicker}>TRANSFER REQUEST</Text>
          <Text style={s.headerTitle}>{meta.title}</Text>
          <Text style={s.headerSub}>{meta.subtitle}</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.formArea} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Card>
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>Transfer Service</Text>
              <View style={s.fixedField}>
                <Text style={s.fixedFieldText}>{meta.title}</Text>
              </View>
            </View>
            <Field label="Full Name" value={name} onChangeText={setName} placeholder="Full name" />
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>Phone</Text>
              <View style={s.phoneRow}>
                <View style={s.phonePrefix}>
                  <Text style={s.phonePrefixText}>+94</Text>
                </View>
                <TextInput
                  value={phoneDigits}
                  onChangeText={(value) => setPhoneDigits(value.replace(/\D/g, '').slice(0, 9))}
                  keyboardType="number-pad"
                  placeholder="771234567"
                  placeholderTextColor={Colors.mutedLight}
                  maxLength={9}
                  style={s.phoneInput}
                />
              </View>
              <Text style={s.helpText}>Enter 9 digits only after +94.</Text>
            </View>
            <TravelCalendar
              month={calendarMonth}
              selectedDate={travelDate}
              minDate={minimumTravelDate()}
              onPrevious={() => setCalendarMonth((current) => addMonths(current, -1))}
              onNext={() => setCalendarMonth((current) => addMonths(current, 1))}
              onSelect={setTravelDate}
            />
            <Field label="Number of Travelers" value={travelers} onChangeText={setTravelers} keyboardType="numeric" placeholder="2" />
            <Field label="Pickup Location" value={pickupLocation} onChangeText={setPickupLocation} placeholder="Airport / hotel / city" />
            <Field label="Drop-off Location" value={dropoffLocation} onChangeText={setDropoffLocation} placeholder="Destination" />
            <Field label="Special Notes" value={notes} onChangeText={setNotes} multiline placeholder="Flight number, luggage, vehicle preference" />
          </Card>

          <Button title="Submit Transfer Request" onPress={submit} loading={loading} />
          <Button title="Cancel" variant="secondary" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function TravelCalendar({
  month,
  selectedDate,
  minDate,
  onPrevious,
  onNext,
  onSelect,
}: {
  month: Date;
  selectedDate: string;
  minDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (value: string) => void;
}) {
  const selected = new Date(`${selectedDate}T00:00:00`);
  const firstDay = startOfMonth(month);
  const monthStartOffset = firstDay.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: monthStartOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)),
  ];
  const canGoPrevious = addMonths(month, -1) >= startOfMonth(minDate);

  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>Travel Date</Text>
      <View style={s.calendar}>
        <View style={s.calendarHeader}>
          <Pressable
            disabled={!canGoPrevious}
            onPress={onPrevious}
            style={[s.monthButton, !canGoPrevious && s.monthButtonDisabled]}>
            <Text style={[s.monthButtonText, !canGoPrevious && s.monthButtonTextDisabled]}>Prev</Text>
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={s.monthTitle}>{monthLabel(month)}</Text>
            <Text style={s.helpText}>First available: {formatDate(minDate)}</Text>
          </View>
          <Pressable onPress={onNext} style={s.monthButton}>
            <Text style={s.monthButtonText}>Next</Text>
          </Pressable>
        </View>

        <View style={s.weekRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={s.weekText}>{day}</Text>
          ))}
        </View>

        <View style={s.dayGrid}>
          {cells.map((date, index) => {
            if (!date) return <View key={`empty-${index}`} style={s.dayCell} />;
            const disabled = date < minDate;
            const selectedCell = isSameDate(date, selected);
            return (
              <Pressable
                key={formatDate(date)}
                disabled={disabled}
                onPress={() => onSelect(formatDate(date))}
                style={[s.dayCell, selectedCell && s.dayCellSelected, disabled && s.dayCellDisabled]}>
                <Text style={[s.dayText, selectedCell && s.dayTextSelected, disabled && s.dayTextDisabled]}>
                  {date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
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
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { color: Colors.deepEmerald, ...Typography.captionBold, marginBottom: 6 },
  fixedField: { borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.offWhite, paddingHorizontal: 14, paddingVertical: 13 },
  fixedFieldText: { color: Colors.deepEmerald, ...Typography.bodyBold },
  phoneRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.white, overflow: 'hidden' },
  phonePrefix: { alignSelf: 'stretch', justifyContent: 'center', paddingHorizontal: 14, backgroundColor: Colors.offWhite, borderRightWidth: 1, borderRightColor: Colors.border },
  phonePrefixText: { color: Colors.deepEmerald, ...Typography.bodyBold },
  phoneInput: { flex: 1, color: Colors.ink, ...Typography.body, paddingHorizontal: 14, paddingVertical: 12 },
  helpText: { color: Colors.muted, ...Typography.tiny, marginTop: 5 },
  calendar: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.white,
    padding: 12,
  },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 },
  monthTitle: { color: Colors.deepEmerald, ...Typography.captionBold },
  monthButton: {
    borderWidth: 1,
    borderColor: Colors.deepEmerald,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  monthButtonDisabled: { borderColor: Colors.border, backgroundColor: Colors.offWhite },
  monthButtonText: { color: Colors.deepEmerald, ...Typography.tiny, fontWeight: '900' },
  monthButtonTextDisabled: { color: Colors.mutedLight },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekText: { width: `${100 / 7}%`, textAlign: 'center', color: Colors.muted, ...Typography.tiny },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  dayCellSelected: { backgroundColor: Colors.deepEmerald },
  dayCellDisabled: { opacity: 0.35 },
  dayText: { color: Colors.ink, ...Typography.captionBold },
  dayTextSelected: { color: Colors.antiqueGold },
  dayTextDisabled: { color: Colors.mutedLight },
});
