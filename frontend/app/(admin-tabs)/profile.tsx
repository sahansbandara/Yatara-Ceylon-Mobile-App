import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Car, ChevronLeft, ChevronRight, Compass, Handshake, LayoutDashboard, LogOut, MapPin, Settings, User } from 'lucide-react-native';

import { useAuth } from '@/lib/auth';

const DARK_BG = '#0B100E';
const DARK_CARD = '#161B19';
const DARK_TEXT = '#F8F4EA';
const MUTED = '#69736F';
const BORDER = '#1D2522';
const GOLD = '#D4AF37';

export default function AdminProfileScreen() {
  const { user, logout } = useAuth();

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

        {/* Logo */}
        <View style={s.logoHeader}>
          <Compass size={24} color={DARK_TEXT} />
          <View style={{ marginLeft: 10 }}>
            <Text style={s.logoTitle}>YATARA</Text>
            <Text style={s.logoSub}>CEYLON</Text>
          </View>
        </View>

        {/* Admin Info */}
        <View style={s.userBox}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={s.signedLabel}>SIGNED IN AS</Text>
            <Text style={s.userName}>{user?.name || 'Admin'}</Text>
            <Text style={s.userRole}>({user?.role === 'ADMIN' ? 'Administrator' : 'Staff'})</Text>
          </View>
        </View>

        {/* Overview */}
        <Text style={s.sectionTitle}>OVERVIEW</Text>
        <MenuItem icon={LayoutDashboard} label="Dashboard" onPress={() => router.push('/(admin-tabs)' as any)} />

        {/* Operations */}
        <Text style={[s.sectionTitle, { marginTop: 24 }]}>OPERATIONS</Text>
        <MenuItem icon={Car} label="Manage Vehicles" onPress={() => router.push('/admin/vehicles' as any)} />
        <MenuItem icon={MapPin} label="Manage Destinations" onPress={() => router.push('/admin/destinations' as any)} />
        <MenuItem icon={Handshake} label="Manage Partners" onPress={() => router.push('/admin/partners' as any)} />

        {/* Account */}
        <Text style={[s.sectionTitle, { marginTop: 24 }]}>ACCOUNT</Text>
        <MenuItem icon={User} label="Profile Settings" />
        <MenuItem icon={Settings} label="App Settings" />

      </ScrollView>

      {/* Bottom */}
      <View style={s.bottomContainer}>
        <Pressable style={s.bottomBtn} onPress={() => router.replace('/(tabs)')}>
          <ChevronLeft size={18} color={MUTED} />
          <Text style={s.bottomBtnText}>Back to Website</Text>
        </Pressable>
        <Pressable style={s.bottomBtn} onPress={signOut}>
          <LogOut size={18} color={MUTED} />
          <Text style={s.bottomBtnText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MenuItem({ icon: Icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [s.menuItem, pressed && { opacity: 0.7 }]}
      onPress={onPress}>
      <Icon size={18} color={MUTED} />
      <Text style={s.menuText}>{label}</Text>
      <ChevronRight size={16} color={MUTED} style={{ marginLeft: 'auto' }} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DARK_BG },
  scroll: { padding: 24, paddingTop: 40, paddingBottom: 40 },

  logoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logoTitle: { color: DARK_TEXT, fontSize: 20, fontWeight: '800', letterSpacing: 3 },
  logoSub: { color: MUTED, fontSize: 9, fontWeight: '700', letterSpacing: 4, marginTop: -2 },

  userBox: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: BORDER, marginBottom: 30 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1810', borderWidth: 1, borderColor: '#302A18', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { color: GOLD, fontSize: 16, fontWeight: '800' },
  signedLabel: { color: MUTED, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 2 },
  userName: { color: GOLD, fontSize: 15, fontWeight: '700' },
  userRole: { color: MUTED, fontSize: 12 },

  sectionTitle: { color: '#4A5550', fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 12, marginLeft: 16 },

  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 4, backgroundColor: DARK_CARD, borderWidth: 1, borderColor: BORDER },
  menuText: { color: DARK_TEXT, fontSize: 15, fontWeight: '500', marginLeft: 14, letterSpacing: 0.3 },

  bottomContainer: { padding: 24, paddingBottom: 40, borderTopWidth: 1, borderColor: BORDER, backgroundColor: DARK_BG },
  bottomBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  bottomBtnText: { color: MUTED, fontSize: 14, fontWeight: '500', marginLeft: 14, letterSpacing: 0.5 },
});
