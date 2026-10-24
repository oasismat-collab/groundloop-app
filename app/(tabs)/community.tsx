import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../src/hooks/useProfile';
import { watchFeed, createPost, cheer } from '../../src/lib/api';
import { REGIONS } from '../../src/data/regions';
import { Button, Card } from '../../src/components/ui';
import { useTheme } from '../../src/theme';

type Post = { id: string; uid: string; kind: string; text: string; region: string; createdAt: number; cheerCount?: number };
const KINDS = ['Reflection', 'Tip', 'Question'] as const;

// Kiro task 11: add the consistency board (members), photo attachments, report and hide.
export default function Community() {
  const t = useTheme();
  const { user, profile } = useProfile();
  const [cityOnly, setCityOnly] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [kind, setKind] = useState<(typeof KINDS)[number]>('Reflection');
  const region = profile?.currentRegion ?? 'boston';

  useEffect(() => watchFeed(cityOnly ? region : null, (p) => setPosts(p as unknown as Post[])), [cityOnly, region]);

  const send = async () => {
    if (!user || !text.trim()) return;
    await createPost(user.uid, kind, text.trim(), region);
    setText('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <FlatList
        contentContainerStyle={styles.wrap}
        data={posts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            <Text style={[styles.h1, { color: t.ink }]}>Community</Text>
            <Card>
              <View style={styles.chips}>{KINDS.map((k) => (
                <Pressable key={k} onPress={() => setKind(k)} style={[styles.chip, { backgroundColor: k === kind ? t.ink : t.soft }]}><Text style={{ color: k === kind ? t.bg : t.ink, fontWeight: '700' }}>{k}</Text></Pressable>
              ))}</View>
              <TextInput value={text} onChangeText={setText} maxLength={280} multiline placeholder="What did you notice this week?" placeholderTextColor={t.muted}
                style={[styles.input, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]} />
              <Button title="Post" onPress={send} disabled={!text.trim()} />
            </Card>
            <View style={styles.chips}>
              {[false, true].map((c) => (
                <Pressable key={String(c)} onPress={() => setCityOnly(c)} style={[styles.chip, { backgroundColor: c === cityOnly ? t.ink : t.card }]}>
                  <Text style={{ color: c === cityOnly ? t.bg : t.ink, fontWeight: '700' }}>{c ? REGIONS[region]?.name : 'Everyone'}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={<Text style={{ color: t.muted, textAlign: 'center' }}>No posts yet. Share the first one.</Text>}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: t.forest2, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{item.kind.toUpperCase()} · {REGIONS[item.region]?.name}</Text>
            <Text style={{ color: t.ink, fontSize: 16 }}>{item.text}</Text>
            {item.uid !== user?.uid && user && (
              <Pressable onPress={() => cheer(item.id, user.uid)} accessibilityRole="button"><Text style={{ color: t.no, fontWeight: '700' }}>♥ Cheer {item.cheerCount ? `· ${item.cheerCount}` : ''}</Text></Pressable>
            )}
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  h1: { fontSize: 26, fontWeight: '800' },
  chips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { borderRadius: 999, paddingVertical: 7, paddingHorizontal: 14 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 80, fontSize: 16, textAlignVertical: 'top' },
});
