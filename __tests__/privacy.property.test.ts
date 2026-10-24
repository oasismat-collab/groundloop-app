/**
 * Property-based tests for the partner-aggregation privacy gate.
 *
 * The k-anonymity gate is `aggregateByArea` in docs/prototype/privacy.js, the
 * single function every partner aggregate passes through before it is shown
 * (see docs/prototype/app.js → renderPartner). The opt-in filter it depends on
 * ("only opted-in users count toward any partner aggregate") is modelled here
 * exactly as the dashboard builds its records.
 *
 * Linked requirements:
 *   - web-demo  Requirement 12 — "Enforce the 10-user minimum": show an area
 *     breakdown only where >= 10 opted-in users contribute; hide/merge otherwise;
 *     never render a breakdown that reveals an individual.
 *   - web-demo  Requirement 10.3 — opted-out users SHALL NOT be counted in
 *     partner aggregates.
 *   - partner-dashboard Requirement 5.3 — batch/aggregate views SHALL NOT expose
 *     individual residents.
 *   - steering/privacy.md — the 10-user minimum (k-anonymity) and "only opted-in
 *     users count"; opting out removes a resident from all aggregates.
 *
 * Properties under test (from the task):
 *   1. The aggregation never returns a shown area with fewer than 10 opted-in users.
 *   2. The aggregation never includes users who opted out.
 */
import fc from 'fast-check';
import { aggregateByArea, MIN_USERS, isShowable } from '../docs/prototype/privacy.js';

// Run each property with plenty of cases; override with FC_NUM_RUNS if desired.
fc.configureGlobal({ numRuns: Number(process.env.FC_NUM_RUNS ?? 1000) });

/** A single resident, as the demo/app models them for aggregation. */
interface User {
  id: number;
  area: string;
  dropoffs: number;
  optedIn: boolean;
}

const AREAS = ['Downtown', 'Fenway', 'Roxbury', 'Hyde Park', 'South End', 'JP', 'Dorchester', 'Allston'];

const userArb = (id: number) =>
  fc.record({
    id: fc.constant(id),
    area: fc.constantFrom(...AREAS),
    dropoffs: fc.integer({ min: 0, max: 50 }),
    optedIn: fc.boolean(),
  });

const usersArb = fc.array(fc.nat(10_000), { minLength: 0, maxLength: 300 }).chain((ids) =>
  // de-dupe ids so each user is distinct, then build a user per id
  fc.tuple(...Array.from(new Set(ids)).map((id) => userArb(id))),
);

/**
 * Build the per-area aggregate records exactly as the partner dashboard does:
 * count ONLY opted-in users, and sum ONLY their drop-offs, per area. This is the
 * opt-in gate from privacy.md ("only opted-in users count toward any aggregate").
 */
function recordsFromUsers(users: User[]) {
  const byArea = new Map<string, { area: string; users: number; dropoffs: number }>();
  for (const u of users) {
    if (!u.optedIn) continue; // opted-out residents never enter a partner aggregate
    const rec = byArea.get(u.area) ?? { area: u.area, users: 0, dropoffs: 0 };
    rec.users += 1;
    rec.dropoffs += u.dropoffs;
    byArea.set(u.area, rec);
  }
  return [...byArea.values()];
}

describe('privacy property: 10-user minimum and opt-in gate', () => {
  it('no shown area ever has fewer than MIN_USERS opted-in users', () => {
    fc.assert(
      fc.property(usersArb, (users: User[]) => {
        const records = recordsFromUsers(users);
        const { shown } = aggregateByArea(records, { minUsers: MIN_USERS });
        for (const area of shown) {
          expect(area.users).toBeGreaterThanOrEqual(MIN_USERS);
          expect(isShowable(area.users, MIN_USERS)).toBe(true);
        }
      }),
    );
  });

  it('opted-out users never contribute to any shown area or to totals', () => {
    fc.assert(
      fc.property(usersArb, (users: User[]) => {
        const records = recordsFromUsers(users);
        const { shown, merged } = aggregateByArea(records, { minUsers: MIN_USERS });

        // Ground truth computed only from opted-in users.
        const optedIn = users.filter((u) => u.optedIn);
        const optedInByArea = new Map<string, { users: number; dropoffs: number }>();
        for (const u of optedIn) {
          const a = optedInByArea.get(u.area) ?? { users: 0, dropoffs: 0 };
          a.users += 1; a.dropoffs += u.dropoffs;
          optedInByArea.set(u.area, a);
        }

        // Every shown area's counts match the opted-in-only truth exactly —
        // opted-out residents added nothing.
        for (const area of shown) {
          const truth = optedInByArea.get(area.area);
          expect(truth).toBeDefined();
          expect(area.users).toBe(truth!.users);
          expect(area.dropoffs).toBe(truth!.dropoffs);
        }

        // Conservation: every opted-in user ends up in exactly one place — a shown
        // area, the merged "Other areas" bucket, or (when even the combined small
        // cells stay below the threshold) hidden/suppressed. No opted-out user is
        // counted anywhere, and no opted-in user is invented. So the three buckets
        // sum to exactly the opted-in population.
        const { suppressed } = aggregateByArea(records, { minUsers: MIN_USERS });
        const shownUsers = shown.reduce((s, a) => s + a.users, 0);
        const mergedUsers = merged ? merged.users : 0;
        // When merged is null, its would-be members are the suppressed records; when
        // merged is non-null, those same suppressed users are inside it. Count the
        // suppressed users only when they are NOT already represented by `merged`.
        const hiddenUsers = merged ? 0 : suppressed.reduce((s, r) => s + r.users, 0);
        expect(shownUsers + mergedUsers + hiddenUsers).toBe(optedIn.length);
        // And nothing visible ever exceeds the opted-in truth.
        expect(shownUsers + mergedUsers).toBeLessThanOrEqual(optedIn.length);
      }),
    );
  });

  // privacy.md: "An area with fewer than 10 opted-in users is hidden or MERGED
  // into a neighbouring area UNTIL THE COMBINED AREA CLEARS 10 ... No small-cell
  // leak is acceptable, even indirectly." The merged "Other areas" bucket is a
  // cell a partner sees, so it must itself clear the threshold whenever it is
  // rendered — otherwise a lone suppressed area is exposed under a new label.
  it('every cell surfaced to a partner (shown areas AND the merged bucket) clears MIN_USERS', () => {
    fc.assert(
      fc.property(usersArb, (users: User[]) => {
        const records = recordsFromUsers(users);
        const { shown, merged } = aggregateByArea(records, { minUsers: MIN_USERS });
        for (const area of shown) expect(area.users).toBeGreaterThanOrEqual(MIN_USERS);
        // The merged bucket is displayed to partners ("Other areas (N residents)"),
        // so if it exists it must also represent at least MIN_USERS residents.
        if (merged) expect(merged.users).toBeGreaterThanOrEqual(MIN_USERS);
      }),
    );
  });

  it('suppressed areas are all below the threshold and are not individually shown', () => {
    fc.assert(
      fc.property(usersArb, (users: User[]) => {
        const records = recordsFromUsers(users);
        const { shown, suppressed, merged } = aggregateByArea(records, { minUsers: MIN_USERS });

        // Every suppressed record was genuinely below the threshold.
        for (const r of suppressed) expect(r.users).toBeLessThan(MIN_USERS);

        // No suppressed area leaks through as a shown area.
        const shownAreas = new Set(shown.map((s) => s.area));
        for (const r of suppressed) expect(shownAreas.has(r.area)).toBe(false);

        // shown ∪ suppressed partitions the input records (nothing invented, nothing lost).
        expect(shown.length + suppressed.length).toBe(records.length);

        // The merged "Other areas" bucket is surfaced only when the suppressed
        // areas TOGETHER reach the threshold; otherwise they are hidden outright
        // (merged === null) so no small cell is ever relabelled into view.
        const suppressedUsers = suppressed.reduce((s, r) => s + r.users, 0);
        if (merged) {
          expect(merged.count).toBe(suppressed.length);
          expect(merged.users).toBe(suppressedUsers);
          expect(merged.users).toBeGreaterThanOrEqual(MIN_USERS);
        } else {
          // No merged bucket means either nothing was suppressed, or the combined
          // suppressed total was itself below the threshold.
          expect(suppressedUsers).toBeLessThan(MIN_USERS);
        }
      }),
    );
  });
});
