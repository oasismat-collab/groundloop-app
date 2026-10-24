import React from 'react';
import { Pressable, Text, View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const t = useTheme();
  return <View style={[styles.card, { backgroundColor: t.card, borderColor: t.line }, style]}>{children}</View>;
}
export function Button({ title, onPress, kind = 'primary', disabled }: { title: string; onPress: () => void; kind?: 'primary' | 'secondary' | 'dark'; disabled?: boolean }) {
  const t = useTheme();
  const bg = kind === 'primary' ? t.forest : kind === 'dark' ? t.ink : t.card;
  const fg = kind === 'secondary' ? t.ink : kind === 'dark' ? t.bg : t.onAccent;
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.btn, { backgroundColor: bg, borderColor: t.line, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }]}>
      <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return <Text style={[styles.eyebrow, { color: t.muted }]}>{children}</Text>;
}
const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 18, gap: 12 },
  btn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 18, alignItems: 'center', borderWidth: 1 },
  btnText: { fontSize: 17, fontWeight: '700' },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
});
