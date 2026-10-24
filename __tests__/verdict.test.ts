import { verdictFor } from '../src/lib/verdict';
import { ITEMS } from '../src/data/items';

const item = (n: string) => ITEMS.find((i) => i.name === n)!;

describe('verdictFor', () => {
  it('applies city overrides', () => {
    expect(verdictFor(item('Dog waste'), 'toronto').verdict).toBe('bin');
    expect(verdictFor(item('Dog waste'), 'boston').verdict).toBe('not');
  });
  it('refuses to guess where only basic rules are verified', () => {
    const r = verdictFor(item('Chicken bones'), 'seoul');
    expect(r.verdict).toBe('ask');
    expect(r.unverified).toBe(true);
    expect(verdictFor(item('Banana peel'), 'seoul').verdict).toBe('bin');
  });
  it('handles certified packaging by city', () => {
    expect(verdictFor(item('Takeaway box with food'), 'boston', 1).verdict).toBe('bin');
    expect(verdictFor(item('Takeaway box with food'), 'cambridge', 1).verdict).toBe('not');
  });
});
