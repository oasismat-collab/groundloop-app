/**
 * Full-screen greeting shown at the start of a session (Req 2.1–2.4).
 *
 * - "Hi, {first name}!" with the session's mascot (Req 2.1).
 * - Auto-dismisses after ~2s and is dismissible by tap (Req 2.1).
 * - Normally fades and scales in; WHERE reduce motion is on it appears with no
 *   animation (Req 2.4).
 *
 * The mascot itself is chosen by the session and passed in, so it matches the
 * header logo mark (Req 2.3).
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Mascot, MASCOT_NAMES, type MascotId } from './Mascot';
import { useTheme } from '../theme';

const VISIBLE_MS = 2000;

export function GreetingOverlay({
  mascot,
  firstName,
  reduceMotion,
  onDismiss,
}: {
  mascot: MascotId;
  firstName: string;
  reduceMotion: boolean;
  onDismiss: () => void;
}) {
  const t = useTheme();
  // Start fully visible when reduced motion is on, so nothing animates (Req 2.4).
  const opacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(reduceMotion ? 1 : 0.92)).current;

  useEffect(() => {
    if (!reduceMotion) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
      ]).start();
    }
    const id = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(id);
    // Run once per mount; mascot/name are fixed for the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pressable
      style={[StyleSheet.absoluteFill, styles.splash, { backgroundColor: t.bg }]}
      onPress={onDismiss}
      accessibilityRole="button"
      accessibilityLabel="Dismiss greeting"
    >
      <Animated.View style={[styles.inner, { opacity, transform: [{ scale }] }]}>
        <Mascot id={mascot} size={150} />
        <Text style={[styles.hi, { color: t.ink }]} accessibilityRole="header">
          Hi, {firstName}!
        </Text>
        <View>
          <Text style={{ color: t.muted, fontWeight: '600' }}>{MASCOT_NAMES[mascot]} says welcome back.</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  splash: { alignItems: 'center', justifyContent: 'center' },
  inner: { alignItems: 'center', gap: 8 },
  hi: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
});
