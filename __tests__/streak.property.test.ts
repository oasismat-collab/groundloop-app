/**
 * Property-based tests for the weekly streak maths (src/lib/streak.ts), the same
 * pure logic the Cloud Function (functions/src/index.ts → finalizeDropoff) and the
 * web demo (docs/prototype/logic.js) use to turn drop-offs into a streak.
 *
 * Linked requirements:
 *   - web-demo  Requirement 4.1  — "weekly streak computed with streak.ts
 *     (ISO week keys, consecutive done weeks)".
 *   - groundloop-mvp streak logic — finalizeDropoff records one ISO week per
 *     drop-off via `weeks = new Set([...weeks, weekKey(day)])` and derives the
 *     count with streakInfo().
 *
 * Properties under test (from the task):
 *   1. For any sequence of drop-off dates in any time zones, the weekly streak
 *      never increases by more than 1 per ISO week.
 *   2. The same ISO week is never counted twice.
 */
import fc from 'fast-check';
import { weekKey, streakInfo } from '../src/lib/streak';

// Run each property with plenty of cases; override with FC_NUM_RUNS if desired.
fc.configureGlobal({ numRuns: Number(process.env.FC_NUM_RUNS ?? 1000) });

/** A spread of real IANA zones across the UTC offset range, incl. half-hour and
 *  negative offsets, so "the user's calendar day" varies the way it does in prod. */
const TZS = [
  'Pacific/Kiritimati',   // +14
  'Pacific/Auckland',     // +12/+13
  'Australia/Sydney',     // +10/+11
  'Asia/Tokyo',           // +9
  'Asia/Kolkata',         // +5:30
  'Europe/London',        // 0/+1
  'UTC',
  'America/New_York',     // -5/-4
  'America/Los_Angeles',  // -8/-7
  'Pacific/Honolulu',     // -10
];

const DAY = 86_400_000;

/** Wall-clock day in `tz`, expressed as a UTC Date, mirroring functions/src/index.ts
 *  `userDay()`. weekKey() reads only the local (here, UTC) Y/M/D, so this reproduces
 *  the exact Date that the backend feeds to weekKey for a drop-off at epoch `ms`. */
function userDay(ms: number, tz: string): Date {
  const parts = new Map<string, string>();
  for (const p of new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(ms))) {
    parts.set(p.type, p.value);
  }
  const n = (k: string) => Number(parts.get(k));
  return new Date(Date.UTC(
    n('year'), n('month') - 1, n('day'),
    n('hour'), n('minute'), n('second'),
  ));
}

/** One drop-off: an epoch time and the time zone the user was in. */
const dropoffArb = fc.record({
  // ~1990-01-01 .. ~2035-12-31, wide enough to cross DST, year and ISO-week boundaries.
  ms: fc.integer({ min: 631_152_000_000, max: 2_082_758_399_000 }),
  tz: fc.constantFrom(...TZS),
});

/** Replay a sequence of drop-offs exactly as finalizeDropoff does: each drop-off
 *  adds weekKey(userDay(ms, tz)) to a Set of done weeks. Returns the week keys in
 *  arrival order and the final done-week set. */
function recordWeeks(drops: { ms: number; tz: string }[]) {
  const done = new Set<string>();
  const keysInOrder: string[] = [];
  for (const d of drops) {
    const wk = weekKey(userDay(d.ms, d.tz));
    keysInOrder.push(wk);
    done.add(wk);
  }
  return { done, keysInOrder };
}

describe('streak property: never +1 per ISO week, never the same week twice', () => {
  it('a single drop-off adds at most one ISO week to the done set', () => {
    fc.assert(
      fc.property(dropoffArb, (d) => {
        const wk = weekKey(userDay(d.ms, d.tz));
        // weekKey is always a well-formed ISO week key.
        expect(wk).toMatch(/^\d{4}-W\d{2}$/);
        // Recording it yields a set of exactly one week.
        const { done } = recordWeeks([d]);
        expect(done.size).toBe(1);
      }),
    );
  });

  it('processing a drop-off for a week already done is idempotent (no double count)', () => {
    fc.assert(
      fc.property(fc.array(dropoffArb, { minLength: 1, maxLength: 40 }), dropoffArb, (base, extra) => {
        const first = recordWeeks(base);
        // Re-process `extra` twice. The second time, its week is already present.
        const afterOne = recordWeeks([...base, extra]);
        const afterTwo = recordWeeks([...base, extra, extra]);
        // The done-week set is a Set: the same ISO week is stored once, never twice.
        expect(afterTwo.done.size).toBe(afterOne.done.size);
        expect([...afterTwo.done].sort()).toEqual([...afterOne.done].sort());
        // Adding a drop-off never shrinks or removes previously-done weeks.
        for (const wk of first.done) expect(afterOne.done.has(wk)).toBe(true);
      }),
    );
  });

  it('the streak count never jumps by more than 1 when one drop-off is added', () => {
    fc.assert(
      fc.property(
        fc.array(dropoffArb, { maxLength: 60 }),
        dropoffArb,
        fc.constantFrom(...TZS),
        (history, next, nowTz) => {
          const before = recordWeeks(history);
          const after = recordWeeks([...history, next]);

          // Evaluate the streak as of the new drop-off's own calendar day (this is
          // the `now` finalizeDropoff passes to streakInfo). No paused weeks here —
          // pausing only ever skips gaps, it cannot inflate the count.
          const now = userDay(next.ms, next.tz);
          const countBefore = streakInfo([...before.done], [], now).count;
          const countAfter = streakInfo([...after.done], [], now).count;

          // Adding exactly one drop-off adds at most one new ISO week, so the
          // consecutive-week count can rise by at most 1 (and never fall).
          expect(countAfter).toBeGreaterThanOrEqual(countBefore);
          expect(countAfter - countBefore).toBeLessThanOrEqual(1);
        },
      ),
    );
  });

  it('count equals the number of distinct consecutive done weeks (same week not counted twice)', () => {
    fc.assert(
      fc.property(fc.array(dropoffArb, { minLength: 1, maxLength: 60 }), fc.constantFrom(...TZS), (drops, nowTz) => {
        const { done } = recordWeeks(drops);
        // Anchor "now" at the most recent drop-off's calendar day.
        const latestMs = Math.max(...drops.map((d) => d.ms));
        const now = userDay(latestMs, nowTz);
        const count = streakInfo([...done], [], now).count;

        // Re-derive the expected count: walk back week by week from the current
        // week (if done) and tally consecutive done weeks. Because `done` is a Set,
        // each week contributes at most 1 — the same week cannot be counted twice.
        const current = weekKey(now);
        let cursor = done.has(current) ? now : new Date(now.getTime() - 7 * DAY);
        let expected = 0;
        for (let i = 0; i < 520; i++) {
          if (done.has(weekKey(cursor))) expected++;
          else break;
          cursor = new Date(cursor.getTime() - 7 * DAY);
        }
        expect(count).toBe(expected);
        // The count can never exceed the number of distinct weeks ever recorded.
        expect(count).toBeLessThanOrEqual(done.size);
      }),
    );
  });
});
