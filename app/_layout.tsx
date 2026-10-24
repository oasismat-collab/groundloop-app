import React, { useEffect, useRef, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { AccessibilityInfo, Pressable, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../src/hooks/useAuth';
import { ensureProfile } from '../src/lib/api';
import { Mascot, MASCOT_ORDER, MASCOT_NAMES, type MascotId } from '../src/components/Mascot';
import { useTheme } from '../src/theme';

export default function RootLayout() {
  const { user, ready } = useAuth();
  const segments = useSegments();
  const t = useTheme();
  const [mascot, setMascot] = useState<MascotId>('peel');
  const [greeting, setGreeting] = useState(false);
  const greetedFor = useRef<string | null>(null);

  // Gate: signed-out users go to sign-in, signed-in users leave it.
  useEffect(() => {
    if (!ready) return;
    const onSignIn = segments[0] === 'sign-in';
    if (!user && !onSignIn) router.replace('/sign-in');
    if (user && onSignIn) router.replace('/');
  }, [user, ready, segments]);

  // New session: rotate Peel → Bram → Cora, greet by first name, create the profile
  // on first sign-in and ask for the home city (Req 1.5).
  useEffect(() => {
    if (!user || greetedFor.current === user.uid) return;
    greetedFor.current = user.uid;
    (async () => {
      const last = Number((await AsyncStorage.getItem('mascotIndex')) ?? '-1');
      const next = (last + 1) % MASCOT_ORDER.length;
      await AsyncStorage.setItem('mascotIndex', String(next));
      setMascot(MASCOT_ORDER[next]!);
      setGreeting(true);
      const reduce = await AccessibilityInfo.isReduceMotionEnabled();
      setTimeout(() => setGreeting(false), reduce ? 1500 : 2000);
      // Create the profile with neutral defaults; send first-time users to the
      // required city picker so their home city is set before they reach the app.
      try {
        const { needsHomeRegion } = await ensureProfile(user.uid, user.displayName ?? '');
        if (needsHomeRegion) router.push('/region?first=1');
      } catch {
        // Offline/first write failed: leave the user signed in; they can pick a
        // city later from the You tab once the write succeeds.
      }
    })();
  }, [user]);

  const first = (user?.displayName ?? '').split(' ')[0] || 'there';

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="log" options={{ presentation: 'modal' }} />
        <Stack.Screen name="region" options={{ presentation: 'modal' }} />
        <Stack.Screen name="host" options={{ presentation: 'modal' }} />
      </Stack>
      {greeting && (
        <Pressable style={[StyleSheet.absoluteFill, styles.splash, { backgroundColor: t.bg }]} onPress={() => setGreeting(false)} accessibilityRole="button" accessibilityLabel="Dismiss greeting">
          <Mascot id={mascot} size={150} />
          <Text style={[styles.hi, { color: t.ink }]}>Hi, {first}!</Text>
          <View><Text style={{ color: t.muted, fontWeight: '600' }}>{MASCOT_NAMES[mascot]} says welcome back.</Text></View>
        </Pressable>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  splash: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  hi: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
});
