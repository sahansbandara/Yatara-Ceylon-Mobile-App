import { Redirect } from 'expo-router';
import { PropsWithChildren } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export function AuthGuard({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.offWhite }}>
        <ActivityIndicator color={Colors.deepEmerald} />
      </View>
    );
  }

  if (!user) return <Redirect href="/auth/login" />;

  return children;
}
