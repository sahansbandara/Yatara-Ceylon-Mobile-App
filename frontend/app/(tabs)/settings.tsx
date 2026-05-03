import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { CalendarCheck, ChevronRight, CreditCard, Heart, Map, Settings, LogOut, ShieldAlert } from 'lucide-react-native';

import { Card, Divider, Screen, SectionHeader, StatusBadge } from '@/components/yatara/ui';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { API_URL, api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Booking } from '@/lib/types';

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
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  const upcomingCount = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Header Profile Section */}
        <View style={s.headerProfile}>
          <View style={s.avatarWrapper}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            {isAdmin && (
              <View style={s.adminBadge}>
                <ShieldAlert size={12} color={Colors.white} />
              </View>
            )}
          </View>
          <Text style={s.userName}>{user?.name}</Text>
          <Text style={s.userEmail}>{user?.email}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleText}>{user?.role || 'Traveler'}</Text>
          </View>
        </View>

        {/* Travel Stats Grid */}
        <View style={s.statsGrid}>
          <View style={[s.statCard, Shadows.sm]}>
            <View style={[s.iconBox, { backgroundColor: '#3b82f615' }]}>
              <CalendarCheck size={18} color="#3b82f6" />
            </View>
            <View>
              <Text style={s.statValue}>{bookings.length}</Text>
              <Text style={s.statLabel}>Trips</Text>
            </View>
          </View>

          <View style={[s.statCard, Shadows.sm]}>
            <View style={[s.iconBox, { backgroundColor: '#10b98115' }]}>
              <Map size={18} color="#10b981" />
            </View>
            <View>
              <Text style={s.statValue}>{upcomingCount}</Text>
              <Text style={s.statLabel}>Upcoming</Text>
            </View>
          </View>

          <View style={[s.statCard, Shadows.sm]}>
            <View style={[s.iconBox, { backgroundColor: '#8b5cf615' }]}>
              <Heart size={18} color="#8b5cf6" />
            </View>
            <View>
              <Text style={s.statValue}>1</Text>
              <Text style={s.statLabel}>Saved</Text>
            </View>
          </View>
        </View>

        <SectionHeader title="My Journey" />
        <Card style={s.menuCard}>
          <Pressable style={s.menuRow} onPress={() => router.push('/(tabs)/bookings')}>
            <View style={s.menuLeft}>
              <CalendarCheck size={20} color={Colors.deepEmerald} />
              <Text style={s.menuText}>My Bookings</Text>
            </View>
            <ChevronRight size={18} color={Colors.muted} />
          </Pressable>
          <Divider />
          <Pressable style={s.menuRow} onPress={() => router.push('/(tabs)/packages')}>
            <View style={s.menuLeft}>
              <Map size={20} color={Colors.deepEmerald} />
              <Text style={s.menuText}>Explore Packages</Text>
            </View>
            <ChevronRight size={18} color={Colors.muted} />
          </Pressable>
          <Divider />
          <View style={s.menuRow}>
            <View style={s.menuLeft}>
              <CreditCard size={20} color={Colors.deepEmerald} />
              <Text style={s.menuText}>Total Spent</Text>
            </View>
            <Text style={s.spentValue}>LKR {totalSpent.toLocaleString()}</Text>
          </View>
        </Card>

        <SectionHeader title="Settings & Admin" />
        <Card style={s.menuCard}>
          {isAdmin && (
            <>
              <Pressable style={s.menuRow} onPress={() => router.push('/admin')}>
                <View style={s.menuLeft}>
                  <ShieldAlert size={20} color={Colors.antiqueGold} />
                  <Text style={[s.menuText, { color: Colors.antiqueGold, fontWeight: '700' }]}>Command Center</Text>
                </View>
                <ChevronRight size={18} color={Colors.antiqueGold} />
              </Pressable>
              <Divider />
            </>
          )}
          
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>App Version</Text>
            <Text style={s.infoValue}>Yatara Mobile v1.0.0</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Environment</Text>
            <Text style={s.infoValue}>Production Render</Text>
          </View>
        </Card>

        <View style={{ height: 20 }} />
        
        <Pressable style={s.logoutBtn} onPress={signOut}>
          <LogOut size={18} color={Colors.danger} />
          <Text style={s.logoutText}>Sign Out Securely</Text>
        </Pressable>

      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  headerProfile: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.deepEmerald,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.gold,
  },
  avatarText: { color: Colors.antiqueGold, ...Typography.h1 },
  adminBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: Colors.danger,
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userName: { color: Colors.deepEmerald, ...Typography.h2, marginBottom: 2 },
  userEmail: { color: Colors.muted, ...Typography.caption },
  roleBadge: {
    backgroundColor: Colors.antiqueGold + '30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  roleText: { color: Colors.antiqueGold, ...Typography.captionBold, textTransform: 'uppercase' },
  
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: Colors.deepEmerald, ...Typography.h3 },
  statLabel: { color: Colors.muted, ...Typography.tiny, fontWeight: '600' },
  
  menuCard: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: { color: Colors.ink, ...Typography.bodyBold },
  spentValue: { color: Colors.deepEmerald, ...Typography.bodyBold },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: { color: Colors.muted, ...Typography.caption },
  infoValue: { color: Colors.ink, ...Typography.captionBold },
  
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.danger + '15',
    paddingVertical: 16,
    borderRadius: 14,
  },
  logoutText: { color: Colors.danger, ...Typography.bodyBold },
});
