import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, Image, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../src/hooks/useProfile';
import { REGIONS, type Site } from '../src/data/regions';
import { submitDropoff, watchDropoff, updateProfile } from '../src/lib/api';
import { Button, Card, Eyebrow } from '../src/components/ui';
import { Peel } from '../src/components/Mascot';
import { useTheme } from '../src/theme';

type Step = 'where' | 'proof' | 'sending' | 'done';
const SITE_LABEL = { curb: 'Curbside collection', station: 'Neighbourhood collection station', rfid: 'Building food waste bin', none: 'Home composter' } as const;

export default function Log() {
  const t = useTheme();
  const { user, profile } = useProfile();
  const region = REGIONS[profile?.currentRegion ?? 'boston'] ?? REGIONS.boston!;
  const [step, setStep] = useState<Step>(region.kind === 'drop' ? 'where' : 'proof');
  const [site, setSite] = useState<Site | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [useLocation, setUseLocation] = useState(true);
  const [careful, setCareful] = useState(true);
  const [result, setResult] = useState<{ proofLevel?: string; seedsAwarded?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (region.kind !== 'drop') setStep('proof'); }, [region.kind]);

  const usualId = profile?.usualSite?.region === region.id ? profile.usualSite.siteId : null;
  const sites = [...region.sites].sort((a, b) => Number(b.id === usualId) - Number(a.id === usualId));

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { setError('Camera access is off, so this drop-off will be self-reported.'); return; }
    // Camera only (no gallery) so the photo is taken now. EXIF lets the server check the capture time.
    const r = await ImagePicker.launchCameraAsync({ quality: 0.6, exif: true, allowsEditing: false });
    if (!r.canceled && r.assets[0]) setPhoto(r.assets[0].uri);
  }

  async function submit() {
    if (!user) return;
    setStep('sending');
    setError(null);
    let geo: { lat: number; lng: number; accuracy: number } | undefined;
    if (useLocation) {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.granted) {
        const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        geo = { lat: fix.coords.latitude, lng: fix.coords.longitude, accuracy: fix.coords.accuracy ?? 999 };
      }
    }
    try {
      const id = await submitDropoff(user.uid, {
        region: region.id,
        siteId: site?.id,
        siteLabel: site ? `${site.label} · ${site.area}` : `${SITE_LABEL[region.kind as keyof typeof SITE_LABEL]} · ${region.name}`,
        geo,
        photoUri: photo ?? undefined,
        careful,
      });
      if (site && !usualId) updateProfile(user.uid, { usualSite: { region: region.id, siteId: site.id } }).catch(() => undefined);
      const stop = watchDropoff(user.uid, id, (d) => {
        if (d.status === 'verified') { setResult(d as never); setStep('done'); stop(); }
      });
      // Offline or slow function: show the saved state after a short wait.
      setTimeout(() => setStep((s) => (s === 'sending' ? 'done' : s)), 8000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setStep('proof');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        {step === 'where' && (
          <>
            <Text style={[styles.h1, { color: t.ink }]}>Where did you drop off?</Text>
            <Text style={{ color: t.muted }}>{region.programme} · {region.name}</Text>
            {sites.map((s) => (
              <Pressable key={s.id} onPress={() => { setSite(s); setStep('proof'); }} style={[styles.row, { backgroundColor: t.card, borderColor: t.line }]} accessibilityRole="button">
                <Text style={{ color: t.ink, fontWeight: '700' }}>{s.label}</Text>
                <Text style={{ color: t.muted }}>{s.area}{s.id === usualId ? ' · Your usual spot' : ''}</Text>
              </Pressable>
            ))}
          </>
        )}
        {step === 'proof' && (
          <>
            <Text style={[styles.h1, { color: t.ink }]}>Add proof</Text>
            <Text style={{ color: t.muted }}>{site ? `${site.label} · ${site.area}` : region.name}</Text>
            <Pressable onPress={takePhoto} style={[styles.photo, { borderColor: t.line, backgroundColor: t.card }]} accessibilityRole="button" accessibilityLabel="Take a photo of your scraps going in">
              {photo ? <Image source={{ uri: photo }} style={styles.img} /> : <Text style={{ color: t.ink, fontWeight: '700' }}>Take a photo of your scraps going in</Text>}
            </Pressable>
            <Card>
              <View style={styles.between}><Text style={{ color: t.ink, fontWeight: '700', flex: 1 }}>Check my location</Text><Switch value={useLocation} onValueChange={setUseLocation} /></View>
              <Text style={{ color: t.muted, fontSize: 13 }}>Confirms you’re within 75 m of {region.kind === 'drop' ? 'the bin' : 'home or your station'}. Read once, never tracked.</Text>
              <View style={styles.between}><Text style={{ color: t.ink, flex: 1 }}>I kept out stickers, plastic and packaging</Text><Switch value={careful} onValueChange={setCareful} /></View>
            </Card>
            <Eyebrow>{photo && useLocation ? 'Aiming for: photo + location' : photo ? 'Aiming for: photo' : 'Self-reported'}</Eyebrow>
            {error && <Text style={{ color: t.no }}>{error}</Text>}
            <Button title="Log it" onPress={submit} />
          </>
        )}
        {step === 'sending' && (
          <View style={styles.center}><ActivityIndicator /><Text style={{ color: t.muted }}>Checking your proof…</Text></View>
        )}
        {step === 'done' && (
          <View style={styles.center}>
            <Peel ripeness="fresh" width={180} />
            {result?.seedsAwarded ? <Text style={[styles.big, { color: t.forest2 }]}>+{result.seedsAwarded}</Text> : null}
            <Text style={{ color: t.ink, fontWeight: '700', fontSize: 18 }}>{result ? `Logged · ${result.proofLevel === 'verified' ? 'Photo + location' : result.proofLevel === 'photo' ? 'Photo' : 'Self-reported'}` : 'Saved. We’ll verify it when you’re back online.'}</Text>
            <Button title="Done" onPress={() => router.back()} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  h1: { fontSize: 26, fontWeight: '800' },
  big: { fontSize: 52, fontWeight: '800' },
  row: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 2 },
  photo: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, minHeight: 160, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: '100%', height: 240 },
  between: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  center: { alignItems: 'center', gap: 12, paddingTop: 40 },
});
