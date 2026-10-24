import { badgesFor } from '../src/lib/badges';

describe('badges', () => {
  it('celebrates the very first drop-off', () => {
    const ids = badgesFor({ proofLevel: 'self' }, { streak: 1, priorCount: 0 }).map((b) => b.id);
    expect(ids).toContain('first');
    expect(ids).toContain('streak');
  });

  it('awards a location-verified badge and a careful-sorter badge', () => {
    const ids = badgesFor({ proofLevel: 'verified', careful: true }, { streak: 2, priorCount: 5 }).map((b) => b.id);
    expect(ids).toContain('verified');
    expect(ids).toContain('careful');
    expect(ids).not.toContain('first');
  });

  it('shows photo proof but no verified badge for a photo-only drop-off', () => {
    const ids = badgesFor({ proofLevel: 'photo' }, { streak: 1, priorCount: 2 }).map((b) => b.id);
    expect(ids).toContain('photo');
    expect(ids).not.toContain('verified');
  });

  it('gives no proof badge for a self-reported drop-off', () => {
    const ids = badgesFor({ proofLevel: 'self' }, { streak: 1, priorCount: 2 }).map((b) => b.id);
    expect(ids).not.toContain('verified');
    expect(ids).not.toContain('photo');
  });

  it('marks a freeze-earning milestone at multiples of 4', () => {
    const b = badgesFor({ proofLevel: 'photo' }, { streak: 4, priorCount: 10 });
    const freeze = b.find((x) => x.id === 'freeze');
    expect(freeze?.label).toBe('4-week streak');
    expect(b.map((x) => x.id)).not.toContain('streak');
  });

  it('omits the streak badge when there is no streak', () => {
    const ids = badgesFor({ proofLevel: 'self' }, { streak: 0, priorCount: 3 }).map((b) => b.id);
    expect(ids).not.toContain('streak');
    expect(ids).not.toContain('freeze');
  });
});
