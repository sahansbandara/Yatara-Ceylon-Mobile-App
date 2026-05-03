import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';

import { Button, Card, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function AdminDashboardScreen() {
  const { isAdmin } = useAuth();
  const [counts, setCounts] = useState({ packages: 0, bookings: 0, vehicles: 0, destinations: 0, partners: 0 });

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      try {
        const [packages, bookings, vehicles, destinations, partners] = await Promise.all([
          api.get('/packages'),
          api.get('/bookings'),
          api.get('/vehicles'),
          api.get('/destinations'),
          api.get('/partners'),
        ]);
        setCounts({
          packages: packages.data.data.length,
          bookings: bookings.data.data.length,
          vehicles: vehicles.data.data.length,
          destinations: destinations.data.data.length,
          partners: partners.data.data.length,
        });
      } catch (error) {
        Alert.alert('Could not load dashboard', getApiError(error));
      }
    }
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Screen>
        <Title>Admin Dashboard</Title>
        <Subtitle>This area is only for admin and staff accounts.</Subtitle>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Admin Dashboard</Title>
        <Subtitle>Assignment CRUD modules connected to Express API.</Subtitle>
        {Object.entries(counts).map(([label, value]) => (
          <Card key={label}>
            <Text style={{ color: Colors.muted, textTransform: 'uppercase', fontWeight: '800' }}>{label}</Text>
            <Text style={{ color: Colors.deepEmerald, fontSize: 30, fontWeight: '900' }}>{value}</Text>
          </Card>
        ))}
        <Button title="Manage Packages" onPress={() => router.push('/admin/packages')} />
        <Button title="Manage Bookings" onPress={() => router.push('/admin/bookings')} />
        <Button title="Manage Vehicles" onPress={() => router.push('/admin/vehicles')} />
        <Button title="Manage Destinations" onPress={() => router.push('/admin/destinations')} />
        <Button title="Manage Partners" onPress={() => router.push('/admin/partners')} />
      </ScrollView>
    </Screen>
  );
}
