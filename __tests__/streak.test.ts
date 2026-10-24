import { weekKey, streakInfo, freezesAfter, ripeness } from '../src/lib/streak';

const d = (s: string) => new Date(`${s}T12:00:00`);

describe('weekKey', () => {
  it('follows ISO 8601 across the new year', () => {
    expect(weekKey(d('2026-01-01'))).toBe('2026-W01');
    expect(weekKey(d('2027-01-01'))).toBe('2026-W53');
    expect(weekKey(d('2026-10-24'))).toBe('2026-W43');
  });
});

describe('streakInfo', () => {
  const now = d('2026-10-24'); // Saturday of W43
  it('counts back from last week when this week is not done yet', () => {
    expect(streakInfo(['2026-W42', '2026-W41', '2026-W40'], [], now).count).toBe(3);
  });
  it('includes this week once done', () => {
    const s = streakInfo(['2026-W43', '2026-W42'], [], now);
    expect(s.count).toBe(2);
    expect(s.thisWeekDone).toBe(true);
  });
  it('skips paused weeks without breaking', () => {
    expect(streakInfo(['2026-W42', '2026-W40'], ['2026-W41'], now).count).toBe(2);
  });
  it('breaks on a missed week', () => {
    expect(streakInfo(['2026-W42', '2026-W40'], [], now).count).toBe(1);
  });
  it('reports days left in the week', () => {
    expect(streakInfo([], [], now).daysLeft).toBe(1);
  });
});

describe('freezesAfter', () => {
  it('grants one at multiples of 4, max 2', () => {
    expect(freezesAfter(3, 4, 0)).toBe(1);
    expect(freezesAfter(7, 8, 2)).toBe(2);
    expect(freezesAfter(4, 5, 1)).toBe(1);
  });
});

describe('ripeness', () => {
  const day = 86_400_000;
  it('maps days to Peel’s states', () => {
    const now = Date.now();
    expect(ripeness(now - 1 * day, now)).toBe('fresh');
    expect(ripeness(now - 6 * day, now)).toBe('ripe');
    expect(ripeness(now - 10 * day, now)).toBe('spotty');
    expect(ripeness(now - 15 * day, now)).toBe('browning');
    expect(ripeness(now - 30 * day, now)).toBe('rotten');
  });
});
