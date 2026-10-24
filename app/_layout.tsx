import React, { useEffect, useRef, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../src/hooks/useAuth';
import { ensureProfile } from '../src/lib/api';
import { GreetingOverlay } from '../src/components/GreetingOverlay';
import { MASCOT_ORDER, type MascotId } from '../src/components/Mascot';
import { SessionMascotContext, nextSessionMascot } from '../src/hooks/useSessionMascot';
import { useTheme } from '../src/theme';

export default function RootLayout() {
  const { user, ready } = useAuth();
  const segments = useSegments();
  const t = useTheme();
  const [mascot, setMascot] = useState<MascotId>(MASCOT_ORDER[0]!);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const greetedFor = useRef<string | null>(null);

  // Keep the reduced-motion flag live so the greeting and any future motion honour it (Req 2.4).
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

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
      setMascot(await nextSessionMascot(AsyncStorage));
      setGreeting(true);
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
    <SessionMascotContext.Provider value={{ mascot, reduceMotion }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="log" options={{ presentation: 'modal' }} />
        <Stack.Screen name="region" options={{ presentation: 'modal' }} />
        <Stack.Screen name="recap" options={{ presentation: 'modal' }} />
        <Stack.Screen name="host" options={{ presentation: 'modal' }} />
      </Stack>
      {greeting && (
        <GreetingOverlay mascot={mascot} firstName={first} reduceMotion={reduceMotion} onDismiss={() => setGreeting(false)} />
      )}
    </SessionMascotContext.Provider>
  );
}
