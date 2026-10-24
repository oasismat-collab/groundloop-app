/** Weekly streak maths. Pure functions, shared with Cloud Functions (functions/src/streak.ts is a copy). */

const DAY = 86_400_000;

/** ISO 8601 week key, e.g. "2026-W43", for the calendar date of `d` in local time. */
export function weekKey(d: Date): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const year = t.getUTCFullYear();
  const week = Math.ceil(((t.getTime() - Date.UTC(year, 0, 1)) / DAY + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export interface StreakInfo {
  /** Consecutive done weeks, paused weeks skipped. */
  count: number;
  thisWeekDone: boolean;
  thisWeekPaused: boolean;
  /** Days left in the current ISO week after today (Sunday = 0). */
  daysLeft: number;
}

export function streakInfo(weeks: Iterable<string>, paused: Iterable<string>, now: Date = new Date()): StreakInfo {
  const done = new Set(weeks);
  const pz = new Set(paused);
  const current = weekKey(now);
  const thisWeekDone = done.has(current);
  let cursor = thisWeekDone ? now : new Date(now.getTime() - 7 * DAY);
  let count = 0;
  for (let i = 0; i < 520; i++) {
    const k = weekKey(cursor);
    if (done.has(k)) count++;
    else if (!pz.has(k)) break;
    cursor = new Date(cursor.getTime() - 7 * DAY);
  }
  const dow = (now.getDay() + 6) % 7; // Monday = 0
  return { count, thisWeekDone, thisWeekPaused: pz.has(current), daysLeft: 6 - dow };
}

/** A freeze is earned each time the streak reaches a new multiple of 4, up to 2 held. */
export function freezesAfter(prevCount: number, newCount: number, held: number): number {
  if (newCount > prevCount && newCount > 0 && newCount % 4 === 0) return Math.min(2, held + 1);
  return held;
}

/** Week key of the previous ISO week. */
export function lastWeekKey(now: Date = new Date()): string {
  return weekKey(new Date(now.getTime() - 7 * DAY));
}

export type Ripeness = 'fresh' | 'ripe' | 'spotty' | 'browning' | 'rotten';
export function ripeness(lastDropAt: number | null, now: number = Date.now()): Ripeness {
  if (lastDropAt === null) return 'rotten';
  const days = Math.floor((now - lastDropAt) / DAY);
  if (days <= 3) return 'fresh';
  if (days <= 7) return 'ripe';
  if (days <= 13) return 'spotty';
  if (days <= 20) return 'browning';
  return 'rotten';
}
