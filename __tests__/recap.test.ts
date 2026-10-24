import { buildRecap, AVG_KG_PER_DROP } from '../src/lib/recap';

const names: Record<string, string> = { boston: 'Boston', toronto: 'Toronto' };
const procs: Record<string, string> = { boston: 'Black Earth Compost', toronto: 'Anaerobic digestion' };

const base = {
  cities: ['boston', 'toronto'],
  regionName: (id: string) => names[id],
  processorFor: (id: string) => procs[id],
  currentRegion: 'boston',
  checkedCounts: { 'Tea bag': 5, 'Banana peel': 9, 'Pizza box': 2, Eggshells: 9 },
};

describe('recap', () => {
  it('counts drop-offs and estimates weight as drops × average kg', () => {
    const r = buildRecap({ ...base, profile: { proofCounts: { self: 2, photo: 3, verified: 5 }, best: 6, streak: 4 } });
    expect(r.dropoffs).toBe(10);
    expect(r.estimatedKg).toBe(Math.round(10 * AVG_KG_PER_DROP * 10) / 10);
  });

  it('computes photo-proof share from photo + verified', () => {
    const r = buildRecap({ ...base, profile: { proofCounts: { self: 2, photo: 3, verified: 5 }, best: 6, streak: 4 } });
    expect(r.photoProofPct).toBe(80); // (3 + 5) / 10
  });

  it('takes the longest streak as the max of best and current', () => {
    expect(buildRecap({ ...base, profile: { proofCounts: { self: 1, photo: 0, verified: 0 }, best: 2, streak: 7 } }).longestStreak).toBe(7);
    expect(buildRecap({ ...base, profile: { proofCounts: { self: 1, photo: 0, verified: 0 }, best: 9, streak: 3 } }).longestStreak).toBe(9);
  });

  it('ranks most-checked items, breaking ties by name, top 3', () => {
    const r = buildRecap({ ...base, profile: { proofCounts: { self: 1, photo: 0, verified: 0 }, best: 1, streak: 1 } });
    expect(r.mostChecked).toEqual(['Banana peel', 'Eggshells', 'Tea bag']);
  });

  it('maps cities to display names and surfaces the current processor', () => {
    const r = buildRecap({ ...base, profile: { proofCounts: { self: 1, photo: 0, verified: 0 }, best: 1, streak: 1 } });
    expect(r.cities).toEqual(['Boston', 'Toronto']);
    expect(r.processor).toBe('Black Earth Compost');
  });

  it('picks a personality from proof mix and streak', () => {
    expect(buildRecap({ ...base, profile: { proofCounts: { self: 0, photo: 0, verified: 8 }, best: 2, streak: 2 } }).personality.title).toBe('The Verifier');
    expect(buildRecap({ ...base, profile: { proofCounts: { self: 1, photo: 0, verified: 0 }, best: 12, streak: 12 } }).personality.title).toBe('The Loyalist');
    expect(buildRecap({ ...base, profile: { proofCounts: { self: 0, photo: 0, verified: 0 }, best: 0, streak: 0 } }).personality.title).toBe('The Beginner');
  });

  it('handles an empty history safely', () => {
    const r = buildRecap({ ...base, checkedCounts: {}, profile: { proofCounts: { self: 0, photo: 0, verified: 0 }, best: 0, streak: 0 } });
    expect(r.dropoffs).toBe(0);
    expect(r.estimatedKg).toBe(0);
    expect(r.photoProofPct).toBe(0);
    expect(r.mostChecked).toEqual([]);
  });
});
