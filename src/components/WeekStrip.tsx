import React from 'react';
import { View, StyleSheet } from 'react-native';
import { weekKey } from '../lib/streak';
import { useTheme } from '../theme';

/** Last `n` ISO weeks: filled = composted, blue = paused, outlined = current week. */
export function WeekStrip({ weeks, paused, n = 8 }: { weeks: string[]; paused: string[]; n?: number }) {
  const t = useTheme();
  const done = new Set(weeks);
  const pz = new Set(paused);
  const cells = Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.now() - (n - 1 - i) * 7 * 86_400_000);
    const k = weekKey(d);
    return { k, done: done.has(k), paused: pz.has(k), current: i === n - 1 };
  });
  return (
    <View style={styles.row} accessibilityLabel={`${cells.filter((c) => c.done).length} of the last ${n} weeks composted`}>
      {cells.map((c) => (
        <View
          key={c.k}
          style={[
            styles.cell,
            { backgroundColor: c.done ? t.forest : c.paused ? t.skySoft : t.soft, borderColor: c.current ? t.banana : 'transparent' },
          ]}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  cell: { flex: 1, aspectRatio: 1, borderRadius: 9, borderWidth: 2 },
});
