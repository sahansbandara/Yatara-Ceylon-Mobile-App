import { Tabs } from 'expo-router';
import { BookOpen, CalendarDays, Home, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

import { AuthGuard } from '@/components/yatara/auth-guard';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.antiqueGold,
          tabBarInactiveTintColor: '#8ea39b',
          tabBarStyle: {
            backgroundColor: Colors.deepEmerald,
            borderTopColor: Colors.emerald,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.3,
          },
          headerStyle: {
            backgroundColor: Colors.deepEmerald,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 18,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="packages"
          options={{
            title: 'Packages',
            tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
