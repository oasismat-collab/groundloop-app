import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, View, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../src/hooks/useProfile';
import { REGIONS } from '../../src/data/regions';
import { searchItems, verdictFor } from '../../src/lib/verdict';
import { recordCheck } from '../../src/lib/checked';
import type { Item } from '../../src/data/items';
import { Button } from '../../src/components/ui';
import { useTheme } from '../../src/theme';

const LABEL = { bin: ['Yes.', 'Into the food waste'], not: ['No.', 'Keep it out'], share: ['Share it.', 'Too good to compost'], ask: ['It depends.', 'Check one thing first'] } as const;

export default function Check() {
  const t = useTheme();
  const { profile } = useProfile();
  const regionId = profile?.currentRegion ?? 'boston';
  const region = REGIONS[regionId] ?? REGIONS.boston!;
  const [q, setQ] = useState('');
  const [item, setItem] = useState<Item | null>(null);
  const [option, setOption] = useState<number | undefined>();

  const v = item ? verdictFor(item, regionId, option) : null;
  const tone = v ? { bin: t.forestSoft, not: t.noSoft, share: t.bananaSoft, ask: t.skySoft }[v.verdict] : t.card;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={[styles.h1, { color: t.ink }]}>Can it go in?</Text>
        <Text style={{ color: t.muted }}>{region.name} · {region.programme}</Text>
        <TextInput value={q} onChangeText={(s) => { setQ(s); setItem(null); }} placeholder="Type an item, e.g. tea bag" placeholderTextColor={t.muted}
          style={[styles.input, { color: t.ink, backgroundColor: t.card, borderColor: t.line }]} accessibilityLabel="Search for an item" />
        {item && v ? (
          <View style={[styles.answer, { backgroundColor: tone }]}>
            <Text style={{ color: t.muted }}>{item.emoji} {item.name}</Text>
            <Text style={[styles.v, { color: t.ink }]}>{v.unverified ? 'Check locally.' : LABEL[v.verdict][0]}</Text>
            {item.options && option === undefined ? (
              <>
                <Text style={{ color: t.ink }}>{item.question}</Text>
                {item.options.map((o, i) => <Button key={o.label} title={o.label} kind="secondary" onPress={() => setOption(i)} />)}
              </>
            ) : <Text style={{ color: t.ink }}>{v.why}</Text>}
            {v.unverified && <Text style={{ color: t.sky, fontWeight: '700' }} onPress={() => Linking.openURL(region.source)}>Open the {region.programme} guide</Text>}
            <Button title="Check another item" kind="secondary" onPress={() => { setItem(null); setOption(undefined); setQ(''); }} />
          </View>
        ) : (
          <View style={styles.grid}>
            {searchItems(q).map((i) => (
              <Pressable key={i.name} onPress={() => { setItem(i); setOption(undefined); recordCheck(i.name); }} style={[styles.tile, { backgroundColor: t.card, borderColor: t.line }]} accessibilityRole="button">
                <Text style={{ fontSize: 28 }}>{i.emoji}</Text>
                <Text style={{ color: t.ink, textAlign: 'center', fontSize: 13, fontWeight: '600' }}>{i.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  h1: { fontSize: 26, fontWeight: '800' },
  input: { borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 16 },
  answer: { borderRadius: 16, padding: 20, gap: 10 },
  v: { fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { width: '31.5%', borderWidth: 1, borderRadius: 14, padding: 10, alignItems: 'center', gap: 4 },
});
