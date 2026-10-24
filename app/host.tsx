/**
 * Host-a-bin form (Req 8.2). A business offers a space for a drop-off bin; we
 * save the organisation name, type, address and city with status "Under review"
 * (the status is set by offerHost and enforced by the firestore rules).
 */
import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../src/hooks/useProfile';
import { offerHost } from '../src/lib/api';
import { REGIONS } from '../src/data/regions';
import { Button, Card, Eyebrow } from '../src/components/ui';
import { useTheme } from '../src/theme';

const TYPES = ['Café or restaurant', 'Shop', 'Office', 'School', 'Community space', 'Other'] as const;

export default function HostABin() {
  const t = useTheme();
  const { user, profile } = useProfile();
  const region = profile?.currentRegion ?? 'boston';
  const [name, setName] = useState('');
  const [type, setType] = useState<(typeof TYPES)[number]>(TYPES[0]);
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const canSubmit = !!name.trim() && !!address.trim() && !busy;

  const submit = async () => {
    if (!user || !canSubmit) return;
    setBusy(true);
    try {
      await offerHost(user.uid, region, name.trim(), type, address.trim());
      setDone(true);
    } catch (e) {
      Alert.alert('Couldn’t send your offer', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <View style={styles.center}>
          <Text style={[styles.h1, { color: t.ink }]}>Thanks for offering a space</Text>
          <Text style={{ color: t.muted, textAlign: 'center' }}>
            Your offer for {name.trim()} in {REGIONS[region]?.name ?? region} is under review. We’ll be in touch about hosting a drop-off bin.
          </Text>
          <Button title="Done" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={[styles.h1, { color: t.ink }]}>Offer a space</Text>
        <Text style={{ color: t.muted }}>
          Got a spot where a food-scrap bin would help? Tell us about it and we’ll review it for {REGIONS[region]?.name ?? region}.
        </Text>
        <Card>
          <Eyebrow>Organisation</Eyebrow>
          <TextInput value={name} onChangeText={setName} placeholder="Name of your business or group" placeholderTextColor={t.muted}
            style={[styles.input, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]} />

          <Eyebrow>Type</Eyebrow>
          <View style={styles.chips}>
            {TYPES.map((k) => (
              <Pressable key={k} onPress={() => setType(k)} style={[styles.chip, { backgroundColor: k === type ? t.ink : t.soft }]} accessibilityRole="button">
                <Text style={{ color: k === type ? t.bg : t.ink, fontWeight: '700' }}>{k}</Text>
              </Pressable>
            ))}
          </View>

          <Eyebrow>Address</Eyebrow>
          <TextInput value={address} onChangeText={setAddress} placeholder="Street address" placeholderTextColor={t.muted} multiline
            style={[styles.input, { color: t.ink, borderColor: t.line, backgroundColor: t.bg, minHeight: 60 }]} />

          <Text style={{ color: t.muted, fontSize: 13 }}>City: {REGIONS[region]?.name ?? region}. Submitted offers start as “Under review”.</Text>
        </Card>
        <Button title="Submit offer" onPress={submit} disabled={!canSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  h1: { fontSize: 26, fontWeight: '800' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { borderRadius: 999, paddingVertical: 7, paddingHorizontal: 14 },
});
