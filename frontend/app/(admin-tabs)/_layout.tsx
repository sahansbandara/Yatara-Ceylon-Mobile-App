import { Tabs, Redirect } from 'expo-router';
import { ActivityIndicator, Platform, View } from 'react-native';
import { BookOpen, CalendarDays, Home, User } from 'lucide-react-native';

import { useAuth } from '@/lib/auth';

const TAB_BG = '#063F32';
const ACTIVE = '#D4AF37';
const INACTIVE = '#8B9A96';

export default function AdminTabLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B100E' }}>
        <ActivityIndicator color={ACTIVE} />
      </View>
    );
  }

  if (!user) return <Redirect href="/auth/login" />;
  if (!isAdmin) return <Redirect href="/(tabs)" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopColor: '#0a4d3d',
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
          backgroundColor: TAB_BG,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#F8F4EA',
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
