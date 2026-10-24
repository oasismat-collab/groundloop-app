/**
 * Season recap (Req 9): a story-style card the user can share as an image.
 *
 * The card shows drop-off count, an estimated kg diverted (explicitly labelled
 * an estimate, Req 9.1), photo-proof share, longest streak, most-checked items,
 * cities composted in, the local processor and a personality. "Share" captures
 * the card with react-native-view-shot and opens the system share sheet via
 * expo-sharing (Req 9.2).
 */
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useProfile } from '../src/hooks/useProfile';
import { recapCities } from '../src/lib/api';
import { getCheckedCounts } from '../src/lib/checked';
import { buildRecap, type Recap } from '../src/lib/recap';
import { streakInfo } from '../src/lib/streak';
import { REGIONS } from '../src/data/regions';
import { Button, Card, Eyebrow } from '../src/components/ui';
import { useTheme } from '../src/theme';

export default function RecapScreen() {
  const t = useTheme();
  const { user, profile } = useProfile();
  const shotRef = useRef<ViewShot>(null);
  const [recap, setRecap] = useState<Recap | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (!user || !profile) return;
    (async () => {
      const [cities, checkedCounts] = await Promise.all([
        recapCities(user.uid).catch(() => [] as string[]),
        getCheckedCounts(),
      ]);
      const allCities = Array.from(new Set([...(cities ?? []), profile.homeRegion, profile.currentRegion].filter(Boolean) as string[]));
      const streak = streakInfo(profile.weeks ?? [], profile.paused ?? []).count;
      setRecap(
        buildRecap({
          profile: { proofCounts: profile.proofCounts, best: profile.best, streak },
          cities: allCities,
          regionName: (id) => REGIONS[id]?.name,
          processorFor: (id) => REGIONS[id]?.processor,
          currentRegion: profile.currentRegion,
          checkedCounts,
        }),
      );
    })();
  }, [user, profile]);

  const share = async () => {
    if (!shotRef.current || sharing) return;
    setSharing(true);
    try {
      const uri = await captureRef(shotRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your GroundLoop season' });
      } else {
        Alert.alert('Sharing unavailable', 'Sharing isn’t available on this device.');
      }
    } catch (e) {
      Alert.alert('Couldn’t share', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setSharing(false);
    }
  };

  if (!recap) return <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={[styles.h1, { color: t.ink }]}>Your season</Text>

        {/* The shareable card. */}
        <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
          <View style={[styles.cardImg, { backgroundColor: t.forest }]}>
            <Text style={styles.brand}>GroundLoop · Season recap</Text>
            <Text style={styles.personality}>{recap.personality.title}</Text>
            <Text style={styles.blurb}>{recap.personality.blurb}</Text>

            <View style={styles.stats}>
              <Stat big value={String(recap.dropoffs)} label="drop-offs" />
              <Stat big value={`${recap.longestStreak}`} label="week best streak" />
              <Stat big value={`${recap.photoProofPct}%`} label="with photo proof" />
            </View>

            <Text style={styles.kg}>~{recap.estimatedKg} kg of scraps diverted <Text style={styles.est}>(estimate)</Text></Text>

            {recap.cities.length > 0 && <Text style={styles.line}>Composted in {recap.cities.join(', ')}</Text>}
            {recap.processor && <Text style={styles.line}>Processed by {recap.processor}</Text>}
            {recap.mostChecked.length > 0 && <Text style={styles.line}>Most checked: {recap.mostChecked.join(', ')}</Text>}
            <Text style={styles.footer}>Rewards consistency and careful sorting — never how much you throw away.</Text>
          </View>
        </ViewShot>

        <Card>
          <Eyebrow>About the estimate</Eyebrow>
          <Text style={{ color: t.muted, fontSize: 13 }}>
            The weight is an estimate: your {recap.dropoffs} drop-off{recap.dropoffs === 1 ? '' : 's'} × an average kg per drop-off. It’s for a sense of scale, not a precise measurement, and it never affects your streak or seeds.
          </Text>
        </Card>

        <Button title={sharing ? 'Preparing…' : 'Share as image'} onPress={share} disabled={sharing} />
        <Button title="Close" kind="secondary" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label, big }: { value: string; label: string; big?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, big && styles.statBig]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  h1: { fontSize: 26, fontWeight: '800' },
  cardImg: { borderRadius: 20, padding: 22, gap: 10 },
  brand: { color: '#CFE8D8', fontWeight: '700', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  personality: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', letterSpacing: -1 },
  blurb: { color: '#E3F1E8', fontSize: 15 },
  stats: { flexDirection: 'row', gap: 12, marginTop: 8 },
  stat: { flex: 1 },
  statValue: { color: '#FFFFFF', fontWeight: '800' },
  statBig: { fontSize: 30, letterSpacing: -1 },
  statLabel: { color: '#CFE8D8', fontSize: 12 },
  kg: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 6 },
  est: { color: '#CFE8D8', fontWeight: '600', fontSize: 13 },
  line: { color: '#E3F1E8', fontSize: 14 },
  footer: { color: '#CFE8D8', fontSize: 12, marginTop: 8 },
});
