import { Tabs } from 'expo-router';
import { BookOpen, CalendarDays, Home, Settings, Sparkles } from 'lucide-react-native';

import { AuthGuard } from '@/components/yatara/auth-guard';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.antiqueGold,
          tabBarInactiveTintColor: '#d8e2dc',
          tabBarStyle: { backgroundColor: Colors.deepEmerald, borderTopColor: Colors.emerald },
          headerStyle: { backgroundColor: Colors.deepEmerald },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '800' },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
        <Tabs.Screen name="packages" options={{ title: 'Packages', tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} /> }} />
        <Tabs.Screen name="bookings" options={{ title: 'Bookings', tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }} />
        <Tabs.Screen name="settings" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }} />
        <Tabs.Screen name="build" options={{ title: 'Build Tour', tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} /> }} />
      </Tabs>
    </AuthGuard>
  );
}
