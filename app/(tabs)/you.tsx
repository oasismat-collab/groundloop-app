import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Switch, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDownloadURL, ref } from 'firebase/storage';
import { useProfile } from '../../src/hooks/useProfile';
import { updateProfile, watchDropoffs, type DropoffRecord } from '../../src/lib/api';
import { storage } from '../../src/lib/firebase';
import { signOut } from '../../src/lib/auth';
import { REGIONS } from '../../src/data/regions';
import { streakInfo } from '../../src/lib/streak';
import { WeekStrip } from '../../src/components/WeekStrip';
import { Card, Button, Eyebrow } from '../../src/components/ui';
import { useTheme } from '../../src/theme';

const PROOF_LABEL = { verified: 'Photo + location', photo: 'Photo', self: 'Self-reported', partner: 'Partner-verified' } as const;

/** Small square thumbnail for a stored proof photo. */
function ProofThumb({ path }: { path: string }) {
  const t = useTheme();
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    getDownloadURL(ref(storage, path)).then((u) => live && setUri(u)).catch(() => undefined);
    return () => { live = false; };
  }, [path]);
  return <View style={[styles.thumb, { backgroundColor: t.soft }]}>{uri && <Image source={{ uri }} style={styles.thumb} accessibilityLabel="Proof photo" />}</View>;
}

/** Lifetime achievement badges, derived from the user's own server-written totals. */
function lifetimeBadges(pc: { self: number; photo: number; verified: number }, best: number) {
  const total = pc.self + pc.photo + pc.verified;
  const out: { id: string; label: string }[] = [];
  if (total >= 1) out.push({ id: 'started', label: 'Started composting' });
  if (pc.verified >= 1) out.push({ id: 'verified', label: 'Location-verified' });
  if (pc.photo + pc.verified >= 10) out.push({ id: 'photo10', label: '10 photo proofs' });
  if (total >= 25) out.push({ id: 'drop25', label: '25 drop-offs' });
  if (best >= 4) out.push({ id: 'streak4', label: '4-week streak' });
  if (best >= 12) out.push({ id: 'streak12', label: '12-week streak' });
  return out;
}

export default function You() {
  const t = useTheme();
  const { user, profile } = useProfile();
  const [history, setHistory] = useState<DropoffRecord[]>([]);

  useEffect(() => (user ? watchDropoffs(user.uid, setHistory) : undefined), [user]);

  if (!profile || !user) return <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} />;
  const st = streakInfo(profile.weeks ?? [], profile.paused ?? []);
  const pc = profile.proofCounts ?? { self: 0, photo: 0, verified: 0 };
  const total = pc.self + pc.photo + pc.verified;
  const best = Math.max(profile.best ?? 0, st.count);
  const badges = lifetimeBadges(pc, best);

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
          <Eyebrow>Last 16 weeks · best {best}</Eyebrow>
          <WeekStrip weeks={profile.weeks ?? []} paused={profile.paused ?? []} n={16} />
          <Text style={{ color: t.muted }}>{total ? Math.round(((pc.photo + pc.verified) / total) * 100) : 0}% of your drop-offs have photo proof.</Text>
        </Card>

        {/* Badges grid (Req 4). */}
        {badges.length > 0 && (
          <Card>
            <Eyebrow>Badges</Eyebrow>
            <View style={styles.grid}>
              {badges.map((b) => (
                <View key={b.id} style={[styles.badge, { backgroundColor: t.forestSoft, borderColor: t.line }]}>
                  <Text style={{ color: t.forest, fontWeight: '800', textAlign: 'center' }}>{b.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* History list with proof badges and thumbnails (Req 4). */}
        <Card>
          <Eyebrow>History</Eyebrow>
          {history.length === 0 ? (
            <Text style={{ color: t.muted, fontSize: 13 }}>Your drop-offs will show up here once you log one.</Text>
          ) : (
            history.map((d) => {
              const proof = d.proofLevel ?? (d.status === 'pending' ? undefined : 'self');
              return (
                <View key={d.id} style={styles.histRow}>
                  {d.photoPath ? <ProofThumb path={d.photoPath} /> : <View style={[styles.thumb, { backgroundColor: t.soft }]} />}
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ color: t.ink, fontWeight: '700' }} numberOfLines={1}>{d.siteLabel}</Text>
                    <Text style={{ color: t.muted, fontSize: 12 }}>{new Date(d.createdAt).toLocaleDateString()} · {REGIONS[d.region]?.name ?? d.region}</Text>
                    <View style={styles.histTags}>
                      <View style={[styles.tag, { backgroundColor: proof === 'verified' ? t.forestSoft : t.soft }]}>
                        <Text style={{ color: proof === 'verified' ? t.forest : t.muted, fontSize: 11, fontWeight: '700' }}>
                          {d.status === 'pending' ? 'Verifying…' : PROOF_LABEL[proof ?? 'self']}
                        </Text>
                      </View>
                      {d.careful && <View style={[styles.tag, { backgroundColor: t.soft }]}><Text style={{ color: t.muted, fontSize: 11, fontWeight: '700' }}>Careful</Text></View>}
                      {d.seedsAwarded ? <Text style={{ color: t.forest2, fontSize: 12, fontWeight: '700' }}>+{d.seedsAwarded}</Text> : null}
                    </View>
                  </View>
                </View>
              );
            })
          )}
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, minWidth: 100, alignItems: 'center' },
  histRow: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 6 },
  histTags: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  tag: { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 },
  thumb: { width: 54, height: 54, borderRadius: 10, overflow: 'hidden' },
});
