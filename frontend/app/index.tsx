import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import { Colors, Typography } from '@/constants/theme';
import { HeroImages } from '@/constants/images';
import { useAuth } from '@/lib/auth';

export default function SplashScreen() {
  const { user, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
      ]),
    ).start();
  }, [fadeAnim, slideAnim, pulseAnim]);

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      router.replace(user ? '/(tabs)' : '/auth/login');
    }, 1200);
    return () => clearTimeout(timer);
  }, [loading, user]);

  return (
    <View style={s.container}>
      <Image source={HeroImages.dawn} style={s.bgImage} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(6,63,50,0.4)', 'rgba(6,63,50,0.95)']}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View
        style={[
          s.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
        <View style={s.brandLine} />
        <Text style={s.overline}>LUXURY TRAVEL OPERATIONS</Text>
        <Text style={s.title}>Yatara{'\n'}Ceylon</Text>
        <Text style={s.tagline}>Curated Sri Lanka journeys,{'\n'}now in your pocket.</Text>
        <Animated.View style={[s.loader, { opacity: pulseAnim }]}>
          <View style={s.loaderDot} />
          <View style={s.loaderDot} />
          <View style={s.loaderDot} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepEmerald,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 32,
    paddingBottom: 80,
  },
  brandLine: {
    width: 48,
    height: 3,
    backgroundColor: Colors.antiqueGold,
    borderRadius: 2,
    marginBottom: 16,
  },
  overline: {
    color: Colors.antiqueGold,
    ...Typography.overline,
    marginBottom: 12,
  },
  title: {
    color: Colors.white,
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 52,
    letterSpacing: -1,
    marginBottom: 16,
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    ...Typography.body,
    lineHeight: 24,
    marginBottom: 40,
  },
  loader: {
    flexDirection: 'row',
    gap: 8,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.antiqueGold,
  },
});
