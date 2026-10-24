import React from 'react';
import { ScrollView, Text, View, Switch, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../src/hooks/useProfile';
import { updateProfile } from '../../src/lib/api';
import { signOut } from '../../src/lib/auth';
import { REGIONS } from '../../src/data/regions';
import { streakInfo } from '../../src/lib/streak';
import { WeekStrip } from '../../src/components/WeekStrip';
import { Button, Card, Eyebrow } from '../../src/components/ui';
import { useTheme } from '../../src/theme';

// Kiro task 12: add history list, proof mix, badges, host-a-bin form and recap.
export default function You() {
  const t = useTheme();
  const { user, profile } = useProfile();
  if (!profile || !user) return <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} />;
  const st = streakInfo(profile.weeks ?? [], profile.paused ?? []);
  const pc = profile.proofCounts ?? { self: 0, photo: 0, verified: 0 };
  const total = pc.self + pc.photo + pc.verified;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={[styles.h1, { color: t.ink }]}>{profile.displayName || user.displayName || 'You'}</Text>
        <Text style={{ color: t.muted }}>{user.email}</Text>
        <Card>
          <Eyebrow>Where you compost</Eyebrow>
          <Text style={{ color: t.ink }} onPress={() => router.push('/region?first=1')}>Home: {(profile.homeRegion && REGIONS[profile.homeRegion]?.name) || 'Choose your city'} ›</Text>
          <Text style={{ color: t.ink }} onPress={() => router.push('/region')}>Right now: {(profile.currentRegion && REGIONS[profile.currentRegion]?.name) || 'Choose your city'} ›</Text>
          <View style={styles.between}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.ink, fontWeight: '700' }}>Travel mode</Text>
              <Text style={{ color: t.muted, fontSize: 13 }}>Pauses your streak while you can’t compost. Paused weeks don’t count and don’t break it.</Text>
            </View>
            <Switch value={profile.travel} onValueChange={(v) => updateProfile(user.uid, { travel: v })} />
          </View>
          <Text style={{ color: t.ink }}>Streak freezes: {profile.freezes ?? 0} of 2</Text>
        </Card>
        <Card>
          <Eyebrow>Last 16 weeks · best {Math.max(profile.best ?? 0, st.count)}</Eyebrow>
          <WeekStrip weeks={profile.weeks ?? []} paused={profile.paused ?? []} n={16} />
          <Text style={{ color: t.muted }}>{total ? Math.round(((pc.photo + pc.verified) / total) * 100) : 0}% of your drop-offs have photo proof.</Text>
        </Card>
        <Button title="Sign out" kind="secondary" onPress={() => signOut()} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  h1: { fontSize: 26, fontWeight: '800' },
  between: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
