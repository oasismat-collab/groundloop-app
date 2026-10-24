/**
 * A small on-device tally of which items the user looks up in the Check tab,
 * so the season recap can show their most-checked items (Req 9.1). Stored
 * locally only — we don't send a user's browsing to the server.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'checkedCounts';

export async function getCheckedCounts(): Promise<Record<string, number>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export async function recordCheck(itemName: string): Promise<void> {
  try {
    const counts = await getCheckedCounts();
    counts[itemName] = (counts[itemName] ?? 0) + 1;
    await AsyncStorage.setItem(KEY, JSON.stringify(counts));
  } catch {
    /* best-effort; the recap simply shows fewer items */
  }
}
