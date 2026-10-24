import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, View, StyleSheet, Pressable, Switch, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfile } from '../../src/hooks/useProfile';
import { watchFeed, createPost, cheer, reportPost, latestProofPhotoPath, proofPhotoUrl } from '../../src/lib/api';
import { REGIONS } from '../../src/data/regions';
import { Button, Card } from '../../src/components/ui';
import { useTheme } from '../../src/theme';

type Post = { id: string; uid: string; kind: string; text: string; region: string; createdAt: number; cheerCount?: number; photoPath?: string };
const KINDS = ['Reflection', 'Tip', 'Question'] as const;
const HIDDEN_KEY = 'hiddenPosts';

/** Renders a stored proof photo once its download URL resolves. */
function ProofImage({ path }: { path: string }) {
  const t = useTheme();
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    proofPhotoUrl(path).then((u) => live && setUri(u)).catch(() => undefined);
    return () => { live = false; };
  }, [path]);
  if (!uri) return <View style={[styles.photo, { backgroundColor: t.soft }]} />;
  return <Image source={{ uri }} style={styles.photo} accessibilityLabel="Attached proof photo" />;
}

// Kiro task 11.2: photo attach + report/hide. Board is task 11.1.
export default function Community() {
  const t = useTheme();
  const { user, profile } = useProfile();
  const [cityOnly, setCityOnly] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [kind, setKind] = useState<(typeof KINDS)[number]>('Reflection');
  const [attachProof, setAttachProof] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const region = profile?.currentRegion ?? 'boston';

  useEffect(() => watchFeed(cityOnly ? region : null, (p) => setPosts(p as unknown as Post[])), [cityOnly, region]);

  // Load the set of posts this user has hidden (Req 7.6) so they stay hidden.
  useEffect(() => {
    AsyncStorage.getItem(HIDDEN_KEY).then((v) => setHidden(v ? (JSON.parse(v) as string[]) : [])).catch(() => setHidden([]));
  }, []);

  const send = async () => {
    if (!user || !text.trim()) return;
    let photoPath: string | undefined;
    if (attachProof) {
      photoPath = (await latestProofPhotoPath(user.uid).catch(() => null)) ?? undefined;
      if (!photoPath) Alert.alert('No proof photo yet', 'Log a drop-off with a photo first, then you can attach it.');
    }
    await createPost(user.uid, kind, text.trim(), region, photoPath);
    setText('');
    setAttachProof(false);
  };

  // Report a post and hide it for this user (Req 7.6).
  const report = (postId: string) => {
    if (!user) return;
    Alert.alert('Report this post?', 'We’ll hide it for you and send it to moderators.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report',
        style: 'destructive',
        onPress: async () => {
          const next = Array.from(new Set([...hidden, postId]));
          setHidden(next);
          await AsyncStorage.setItem(HIDDEN_KEY, JSON.stringify(next)).catch(() => undefined);
          await reportPost(user.uid, postId, 'user_report').catch(() => undefined);
        },
      },
    ]);
  };

  const visible = posts.filter((p) => !hidden.includes(p.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <FlatList
        contentContainerStyle={styles.wrap}
        data={visible}
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
              <View style={styles.between}>
                <Text style={{ color: t.ink, flex: 1 }}>Attach my latest proof photo</Text>
                <Switch value={attachProof} onValueChange={setAttachProof} />
              </View>
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
            {item.photoPath && <ProofImage path={item.photoPath} />}
            <View style={styles.actions}>
              {item.uid !== user?.uid && user && (
                <Pressable onPress={() => cheer(item.id, user.uid)} accessibilityRole="button"><Text style={{ color: t.no, fontWeight: '700' }}>♥ Cheer {item.cheerCount ? `· ${item.cheerCount}` : ''}</Text></Pressable>
              )}
              {item.uid !== user?.uid && (
                <Pressable onPress={() => report(item.id)} accessibilityRole="button" accessibilityLabel="Report this post"><Text style={{ color: t.muted, fontWeight: '600' }}>Report</Text></Pressable>
              )}
            </View>
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
  between: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  photo: { width: '100%', height: 200, borderRadius: 12 },
});
