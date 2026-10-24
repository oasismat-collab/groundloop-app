import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfile } from '../../src/hooks/useProfile';
import { REGIONS } from '../../src/data/regions';
import { streakInfo, ripeness } from '../../src/lib/streak';
import { Peel, peelLine, Mascot } from '../../src/components/Mascot';
import { WeekStrip } from '../../src/components/WeekStrip';
import { Button, Card, Eyebrow } from '../../src/components/ui';
import { watchFeed } from '../../src/lib/api';
import { useSessionMascot } from '../../src/hooks/useSessionMascot';
import { useTheme } from '../../src/theme';

const LOG_LABEL = { drop: 'I dropped off food scraps', curb: 'I put my food waste out', station: 'I emptied my bucket at the station', rfid: 'I used my building’s food waste bin', none: 'I added to my home composter' } as const;

type PreviewPost = { id: string; kind: string; text: string; region: string };

export default function Home() {
  const t = useTheme();
  const { mascot } = useSessionMascot();
  const { user, profile } = useProfile();
  const [preview, setPreview] = useState<PreviewPost[]>([]);
  const [freezeDismissed, setFreezeDismissed] = useState(true);

  const currentRegion = profile?.currentRegion;

  // Community preview: the latest posts in the user's current city (Req 7.2 feed).
  useEffect(() => {
    if (!currentRegion) return;
    return watchFeed(currentRegion, (p) => setPreview((p as unknown as PreviewPost[]).slice(0, 2)));
  }, [currentRegion]);

  // Freeze-used notice (Req 5.5): show once per freeze event, remembering dismissal.
  const freezeUsedAt = profile?.freezeUsedAt;
  useEffect(() => {
    if (!freezeUsedAt) { setFreezeDismissed(true); return; }
    // Only surface a freeze spent in the last two weeks, so an old event never
    // reappears for a long-returning user.
    const recent = Date.now() - freezeUsedAt < 14 * 86_400_000;
    if (!recent) { setFreezeDismissed(true); return; }
    AsyncStorage.getItem('freezeNoticeSeen').then((seen) => setFreezeDismissed(seen === String(freezeUsedAt)));
  }, [freezeUsedAt]);

  const dismissFreeze = () => {
    setFreezeDismissed(true);
    if (freezeUsedAt) AsyncStorage.setItem('freezeNoticeSeen', String(freezeUsedAt)).catch(() => undefined);
  };

  // Wait for the profile, and for a city to be chosen on first sign-in (Req 1.5).
  const region = currentRegion ? REGIONS[currentRegion] : undefined;
  if (!profile || !region) return <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} />;
  const st = streakInfo(profile.weeks ?? [], profile.paused ?? []);
  const ripe = ripeness(profile.lastDropAt ?? null);
  const first = (profile.displayName || user?.displayName || '').split(' ')[0] || 'there';
  const away = profile.currentRegion !== profile.homeRegion;
  const msg = st.thisWeekDone ? 'This week is done. See you next week.'
    : st.thisWeekPaused ? 'Your streak is paused while you travel.'
    : st.count ? `Compost by Sunday to keep your ${st.count}-week streak. ${st.daysLeft} day${st.daysLeft === 1 ? '' : 's'} left.`
    : 'Compost once this week to start a streak.';

  // Usual site: the drop-off the user logs most, shown first for a one-tap log (Req 7.2).
  const usual = profile.usualSite && REGIONS[profile.usualSite.region]?.sites.find((s) => s.id === profile.usualSite!.siteId);
  const showFreezeNotice = !freezeDismissed && !!freezeUsedAt;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        {/* Header shows the current session's mascot as the logo mark (Req 2.3). */}
        <View style={styles.header}>
          <Mascot id={mascot} size={34} />
          <Text style={[styles.h1, { color: t.ink }]} accessibilityRole="header">Hi, {first}</Text>
        </View>
        <Text
          style={{ color: t.muted }}
          onPress={() => router.push('/region')}
          accessibilityRole="button"
          accessibilityHint="Change your current city"
          accessibilityLabel={`Current city: ${region.name}, ${region.programme}`}
        >
          {region.name} · {region.programme} ›
        </Text>

        {/* Travel notice — your streak follows you (Req 3.2). */}
        {away && <Card style={{ backgroundColor: t.bananaSoft }}><Text style={{ color: t.ink }}>You’re in {region.name}. Your streak travels with you.</Text></Card>}

        {/* Freeze-used notice (Req 5.5). */}
        {showFreezeNotice && (
          <Card style={{ backgroundColor: t.skySoft }}>
            <View style={styles.between}>
              <Text style={{ color: t.ink, fontWeight: '700' }}>Streak freeze used</Text>
              <Pressable onPress={dismissFreeze} accessibilityRole="button" accessibilityLabel="Dismiss freeze notice"><Text style={{ color: t.sky, fontWeight: '700' }}>Got it</Text></Pressable>
            </View>
            <Text style={{ color: t.muted }}>We spent a streak freeze to cover the week you missed, so your {st.count}-week streak is safe. You have {profile.freezes ?? 0} freeze{(profile.freezes ?? 0) === 1 ? '' : 's'} left.</Text>
          </Card>
        )}

        <Card>
          <Eyebrow>Weekly streak</Eyebrow>
          <Text style={[styles.big, { color: t.ink }]} maxFontSizeMultiplier={1.6} accessibilityLabel={`Weekly streak: ${st.count} week${st.count === 1 ? '' : 's'}`}>{st.count} <Text style={{ fontSize: 16, color: t.muted }}>week{st.count === 1 ? '' : 's'}</Text></Text>
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

        {/* Usual site card (Req 7.2): the drop-off site the user returns to. */}
        {usual && (
          <Pressable onPress={() => router.push('/log')} accessibilityRole="button">
            <Card>
              <Eyebrow>Your usual spot</Eyebrow>
              <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16 }}>{usual.label}</Text>
              <Text style={{ color: t.muted, fontSize: 13 }}>{usual.area}{usual.note ? ` · ${usual.note}` : ''}</Text>
            </Card>
          </Pressable>
        )}

        <Card>
          <View style={styles.between}>
            <Text style={{ color: t.ink, fontWeight: '700' }}>Seeds</Text>
            <Text style={{ color: t.ink, fontWeight: '700' }}>{profile.seeds ?? 0}</Text>
          </View>
          <Text style={{ color: t.muted, fontSize: 13 }}>Seeds reward proof and showing up every week, never how much waste you make.</Text>
        </Card>

        {/* Community preview (Req 7.2): a peek at the current city's feed. */}
        <Card>
          <View style={styles.between}>
            <Eyebrow>From {region.name}</Eyebrow>
            <Pressable onPress={() => router.push('/community')} accessibilityRole="button"><Text style={{ color: t.forest2, fontWeight: '700' }}>See all ›</Text></Pressable>
          </View>
          {preview.length === 0 ? (
            <Text style={{ color: t.muted, fontSize: 13 }}>No posts here yet. Be the first to share something.</Text>
          ) : (
            preview.map((p) => (
              <View key={p.id} style={{ gap: 2 }}>
                <Text style={{ color: t.forest2, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{p.kind.toUpperCase()}</Text>
                <Text style={{ color: t.ink }} numberOfLines={2}>{p.text}</Text>
              </View>
            ))
          )}
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
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
