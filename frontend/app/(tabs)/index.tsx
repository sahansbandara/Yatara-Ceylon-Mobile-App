import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Button, Card, EmptyState, Screen, Subtitle, Title } from '@/components/yatara/ui';
import { Colors } from '@/constants/theme';
import { api, getApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Destination, PackageItem } from '@/lib/types';

export default function HomeScreen() {
  const { user, isAdmin } = useAuth();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [packageRes, destinationRes] = await Promise.all([
          api.get('/packages?public=true'),
          api.get('/destinations'),
        ]);
        setPackages(packageRes.data.data.slice(0, 3));
        setDestinations(destinationRes.data.data.slice(0, 3));
      } catch (error) {
        Alert.alert('Could not load home data', getApiError(error));
      }
    }
    load();
  }, []);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Ayubowan, {user?.name?.split(' ')[0]}</Title>
        <Subtitle>Browse packages, request bookings, and manage Yatara Ceylon operations from mobile.</Subtitle>
        {isAdmin ? <Button title="Open Admin Dashboard" onPress={() => router.push('/admin')} /> : null}

        <Text style={{ color: Colors.deepEmerald, fontWeight: '900', fontSize: 18, marginTop: 22, marginBottom: 10 }}>Featured packages</Text>
        {packages.length ? packages.map((item) => (
          <Card key={item._id}>
            <Text style={{ color: Colors.deepEmerald, fontWeight: '900', fontSize: 17 }}>{item.title}</Text>
            <Text style={{ color: Colors.muted, marginVertical: 6 }}>{item.duration} • LKR {item.priceMin?.toLocaleString()}</Text>
            <Text style={{ color: Colors.ink }}>{item.summary}</Text>
            <Link href={`/packages/${item._id}`} style={{ color: Colors.deepEmerald, fontWeight: '900', marginTop: 10 }}>View details</Link>
          </Card>
        )) : <EmptyState text="No packages loaded yet." />}

        <Text style={{ color: Colors.deepEmerald, fontWeight: '900', fontSize: 18, marginTop: 12, marginBottom: 10 }}>Destinations</Text>
        <View>
          {destinations.map((item) => (
            <Card key={item._id}>
              <Text style={{ color: Colors.deepEmerald, fontWeight: '900' }}>{item.title}</Text>
              <Text style={{ color: Colors.muted }}>{item.region || 'Sri Lanka'} • {item.bestSeason || 'Year round'}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
