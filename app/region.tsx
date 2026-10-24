import React, { useState } from 'react';
import { ScrollView, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { REGIONS } from '../src/data/regions';
import { updateProfile } from '../src/lib/api';
import { useProfile } from '../src/hooks/useProfile';
import { useTheme } from '../src/theme';

export default function RegionPicker() {
  const t = useTheme();
  const { first } = useLocalSearchParams<{ first?: string }>();
  const isFirst = first === '1';
  const { user, profile } = useProfile();
  const [busy, setBusy] = useState(false);
  const groups = Object.values(REGIONS).reduce<Record<string, typeof REGIONS[string][]>>((acc, r) => {
    (acc[r.country] ??= []).push(r);
    return acc;
  }, {});

  const pick = async (id: string) => {
    if (!user || busy) return;
    setBusy(true);
    try {
      // On first sign-in this is the home city, so set both home and current (Req 1.5).
      await updateProfile(user.uid, isFirst ? { homeRegion: id, currentRegion: id } : { currentRegion: id });
      router.back();
    } catch (e) {
      Alert.alert('Couldn’t save your city', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      {/* First-run picker is required: don't let the user swipe it away without choosing a home city. */}
      <Stack.Screen options={{ gestureEnabled: !isFirst }} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={[styles.h1, { color: t.ink }]}>{isFirst ? 'Where do you live?' : 'Where are you now?'}</Text>
        <Text style={{ color: t.muted }}>
          {isFirst
            ? 'Pick your home city to finish setting up. We’ll show its local rules and places to compost — and your streak comes with you wherever you go.'
            : 'We’ll show local rules and places to compost. Your streak comes with you.'}
        </Text>
        {Object.entries(groups).map(([country, list]) => (
          <React.Fragment key={country}>
            <Text style={[styles.country, { color: t.muted }]}>{country}</Text>
            {list.map((r) => (
              <Pressable key={r.id} disabled={busy} onPress={() => pick(r.id)} style={[styles.row, { backgroundColor: t.card, borderColor: profile?.currentRegion === r.id ? t.forest2 : t.line, opacity: busy ? 0.6 : 1 }]} accessibilityRole="button">
                <Text style={{ color: t.ink, fontWeight: '700' }}>{r.name}</Text>
                <Text style={{ color: t.muted }}>{r.programme}</Text>
              </Pressable>
            ))}
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 10 },
  h1: { fontSize: 26, fontWeight: '800' },
  country: { marginTop: 10, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  row: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 2 },
});
