import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { CalendarCheck, ChevronLeft, LogOut, Compass, Map, User } from 'lucide-react-native';

import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Booking } from '@/lib/types';

const DARK_BG = '#0B100E';
const DARK_CARD = '#121715';
const BORDER = '#1D2522';
const GOLD = '#D4AF37';
const MUTED = '#69736F';
const TEXT = '#F8F4EA';

export default function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useFocusEffect(
    useCallback(() => {
      api.get('/bookings/my').then((res) => {
        setBookings(res.data.data);
      }).catch(() => {});
    }, [])
  );

  async function signOut() {
    await logout();
    router.replace('/auth/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        
        {/* Yatara Logo Header */}
        <View style={s.logoHeader}>
          <Compass size={24} color={TEXT} />
          <View style={{ marginLeft: 10 }}>
            <Text style={s.logoTitle}>YATARA</Text>
            <Text style={s.logoSubtitle}>CEYLON</Text>
          </View>
        </View>

        {/* Signed In As */}
        <View style={s.signedInBox}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={s.signedInLabel}>SIGNED IN AS</Text>
            <Text style={s.signedInName}>{user?.name}</Text>
            <Text style={s.signedInRole}>({user?.role === 'ADMIN' ? 'Administrator' : 'Customer'})</Text>
          </View>
        </View>

        {/* MY TRAVEL Section */}
        <Text style={s.sectionTitle}>MY TRAVEL</Text>
        
        <Pressable 
          style={({ pressed }) => [s.menuItem, s.menuItemActive, pressed && { opacity: 0.8 }]}
          onPress={() => router.push('/(tabs)/bookings')}
        >
          <View style={s.activeIndicator} />
          <CalendarCheck size={18} color={GOLD} />
          <Text style={[s.menuText, { color: GOLD }]}>My Bookings</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [s.menuItem, pressed && { opacity: 0.8 }]}
          onPress={() => router.push('/(tabs)/packages')}
        >
          <Map size={18} color={MUTED} />
          <Text style={s.menuText}>Explore Plans</Text>
        </Pressable>

        {/* ACCOUNT Section */}
        <Text style={[s.sectionTitle, { marginTop: 24 }]}>ACCOUNT</Text>
        
        <Pressable style={s.menuItem}>
          <User size={18} color={MUTED} />
          <Text style={s.menuText}>Profile Settings</Text>
        </Pressable>

        {isAdmin && (
          <Pressable 
            style={({ pressed }) => [s.menuItem, pressed && { opacity: 0.8 }]}
            onPress={() => router.push('/admin')}
          >
            <Compass size={18} color={MUTED} />
            <Text style={s.menuText}>Admin Command Center</Text>
          </Pressable>
        )}

      </ScrollView>

      {/* Bottom Buttons */}
      <View style={s.bottomContainer}>
        <Pressable style={s.bottomButton} onPress={() => router.replace('/(tabs)')}>
          <ChevronLeft size={18} color={MUTED} />
          <Text style={s.bottomButtonText}>Back to Home</Text>
        </Pressable>
        <Pressable style={s.bottomButton} onPress={signOut}>
          <LogOut size={18} color={MUTED} />
          <Text style={s.bottomButtonText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scroll: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoTitle: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 3,
  },
  logoSubtitle: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: -2,
  },
  signedInBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    marginBottom: 30,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1810',
    borderWidth: 1,
    borderColor: '#302A18',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: '800',
  },
  signedInLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  signedInName: {
    color: GOLD,
    fontSize: 15,
    fontWeight: '700',
  },
  signedInRole: {
    color: MUTED,
    fontSize: 12,
  },
  sectionTitle: {
    color: '#4A5550',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#161B19',
    borderWidth: 1,
    borderColor: '#222B28',
    position: 'relative',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: GOLD,
  },
  menuText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 14,
    letterSpacing: 0.5,
  },
  bottomContainer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: BORDER,
    backgroundColor: DARK_BG,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  bottomButtonText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 14,
    letterSpacing: 0.5,
  },
});
