import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../src/hooks/useProfile';
import { REGIONS } from '../../src/data/regions';
import { streakInfo, ripeness } from '../../src/lib/streak';
import { Peel, peelLine, Mascot } from '../../src/components/Mascot';
import { WeekStrip } from '../../src/components/WeekStrip';
import { Button, Card, Eyebrow } from '../../src/components/ui';
import { useSessionMascot } from '../../src/hooks/useSessionMascot';
import { useTheme } from '../../src/theme';

const LOG_LABEL = { drop: 'I dropped off food scraps', curb: 'I put my food waste out', station: 'I emptied my bucket at the station', rfid: 'I used my building’s food waste bin', none: 'I added to my home composter' } as const;

export default function Home() {
  const t = useTheme();
  const { mascot } = useSessionMascot();
  const { user, profile } = useProfile();
  // Wait for the profile, and for a city to be chosen on first sign-in (Req 1.5).
  const region = profile?.currentRegion ? REGIONS[profile.currentRegion] : undefined;
  if (!profile || !region) return <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} />;
  const st = streakInfo(profile.weeks ?? [], profile.paused ?? []);
  const ripe = ripeness(profile.lastDropAt ?? null);
  const first = (profile.displayName || user?.displayName || '').split(' ')[0] || 'there';
  const away = profile.currentRegion !== profile.homeRegion;
  const msg = st.thisWeekDone ? 'This week is done. See you next week.'
    : st.thisWeekPaused ? 'Your streak is paused while you travel.'
    : st.count ? `Compost by Sunday to keep your ${st.count}-week streak. ${st.daysLeft} day${st.daysLeft === 1 ? '' : 's'} left.`
    : 'Compost once this week to start a streak.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        {/* Header shows the current session's mascot as the logo mark (Req 2.3). */}
        <View style={styles.header}>
          <Mascot id={mascot} size={34} />
          <Text style={[styles.h1, { color: t.ink }]}>Hi, {first}</Text>
        </View>
        <Text style={{ color: t.muted }} onPress={() => router.push('/region')}>{region.name} · {region.programme} ›</Text>
        {away && <Card style={{ backgroundColor: t.bananaSoft }}><Text style={{ color: t.ink }}>You’re in {region.name}. Your streak travels with you.</Text></Card>}
        <Card>
          <Eyebrow>Weekly streak</Eyebrow>
          <Text style={[styles.big, { color: t.ink }]}>{st.count} <Text style={{ fontSize: 16, color: t.muted }}>week{st.count === 1 ? '' : 's'}</Text></Text>
          <WeekStrip weeks={profile.weeks ?? []} paused={profile.paused ?? []} />
          <Text style={{ color: t.muted }}>{msg}</Text>
        </Card>
        <Card>
          <View style={styles.row}>
            <Peel ripeness={ripe} width={160} />
            <View style={[styles.bubble, { backgroundColor: t.soft }]}><Text style={{ color: t.ink, fontWeight: '600' }}>{peelLine(ripe)}</Text></View>
          </View>
        </Card>
        <Button title={LOG_LABEL[region.kind]} onPress={() => router.push('/log')} />
        <Card>
          <View style={styles.between}>
            <Text style={{ color: t.ink, fontWeight: '700' }}>Seeds</Text>
            <Text style={{ color: t.ink, fontWeight: '700' }}>{profile.seeds ?? 0}</Text>
          </View>
          <Text style={{ color: t.muted, fontSize: 13 }}>Seeds reward proof and showing up every week, never how much waste you make.</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  big: { fontSize: 44, fontWeight: '800', letterSpacing: -1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bubble: { flex: 1, borderRadius: 14, padding: 10 },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
});
