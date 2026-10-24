import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { REGIONS } from '../src/data/regions';
import { updateProfile } from '../src/lib/api';
import { useProfile } from '../src/hooks/useProfile';
import { useTheme } from '../src/theme';

export default function RegionPicker() {
  const t = useTheme();
  const { first } = useLocalSearchParams<{ first?: string }>();
  const { user, profile } = useProfile();
  const groups = Object.values(REGIONS).reduce<Record<string, typeof REGIONS[string][]>>((acc, r) => {
    (acc[r.country] ??= []).push(r);
    return acc;
  }, {});

  const pick = async (id: string) => {
    if (!user) return;
    await updateProfile(user.uid, first ? { homeRegion: id, currentRegion: id } : { currentRegion: id });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={[styles.h1, { color: t.ink }]}>{first ? 'Where do you live?' : 'Where are you now?'}</Text>
        <Text style={{ color: t.muted }}>We’ll show local rules and places to compost. Your streak comes with you.</Text>
        {Object.entries(groups).map(([country, list]) => (
          <React.Fragment key={country}>
            <Text style={[styles.country, { color: t.muted }]}>{country}</Text>
            {list.map((r) => (
              <Pressable key={r.id} onPress={() => pick(r.id)} style={[styles.row, { backgroundColor: t.card, borderColor: profile?.currentRegion === r.id ? t.forest2 : t.line }]} accessibilityRole="button">
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
