/**
 * Season recap (Req 9), built purely from the user's own server-written totals
 * plus their local item-check tally. Kept pure and tested so the recap screen
 * and any share image stay consistent.
 *
 * The estimated weight is drop-offs × a programme average kg per drop-off, and
 * it is always surfaced as an estimate (Req 9.1) — never presented as a measured
 * figure. Per the product principles, weight is shown only as an informational
 * estimate and never used to rank or reward anyone.
 */

/** Rough average mass of a single household food-scrap drop-off, in kg. */
export const AVG_KG_PER_DROP = 1.2;

export interface RecapProfile {
  proofCounts?: { self: number; photo: number; verified: number };
  best?: number;
  streak: number;
}

export interface RecapInput {
  profile: RecapProfile;
  /** Region ids the user has dropped off in. */
  cities: string[];
  /** Resolve a region id to its display name and processor line. */
  regionName: (id: string) => string | undefined;
  processorFor: (id: string) => string | undefined;
  /** The user's current region, used for the headline processor. */
  currentRegion?: string;
  /** Local tally of item lookups: item name → count. */
  checkedCounts: Record<string, number>;
}

export interface Recap {
  dropoffs: number;
  /** Estimated kg diverted. Always labelled as an estimate in the UI. */
  estimatedKg: number;
  photoProofPct: number;
  longestStreak: number;
  mostChecked: string[];
  cities: string[];
  processor?: string;
  personality: { title: string; blurb: string };
}

function personalityFor(p: { verifiedShare: number; photoShare: number; dropoffs: number; longestStreak: number }): { title: string; blurb: string } {
  if (p.dropoffs === 0) return { title: 'The Beginner', blurb: 'Your composting story is just starting. First drop-off next?' };
  if (p.longestStreak >= 12) return { title: 'The Loyalist', blurb: 'Rain or shine, you keep the loop going.' };
  if (p.verifiedShare >= 0.5) return { title: 'The Verifier', blurb: 'You show up and you prove it — location and all.' };
  if (p.photoShare >= 0.5) return { title: 'The Documenter', blurb: 'A photo for every drop-off. Receipts kept.' };
  if (p.longestStreak >= 4) return { title: 'The Regular', blurb: 'Week in, week out, your scraps find the soil.' };
  return { title: 'The Sprout', blurb: 'You’re growing a habit, one drop-off at a time.' };
}

export function buildRecap(input: RecapInput): Recap {
  const pc = input.profile.proofCounts ?? { self: 0, photo: 0, verified: 0 };
  const dropoffs = pc.self + pc.photo + pc.verified;
  const withPhoto = pc.photo + pc.verified;

  const mostChecked = Object.entries(input.checkedCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([name]) => name);

  const cities = input.cities.map((c) => input.regionName(c) ?? c);
  const longestStreak = Math.max(input.profile.best ?? 0, input.profile.streak);

  return {
    dropoffs,
    estimatedKg: Math.round(dropoffs * AVG_KG_PER_DROP * 10) / 10,
    photoProofPct: dropoffs ? Math.round((withPhoto / dropoffs) * 100) : 0,
    longestStreak,
    mostChecked,
    cities,
    processor: input.currentRegion ? input.processorFor(input.currentRegion) : undefined,
    personality: personalityFor({
      verifiedShare: dropoffs ? pc.verified / dropoffs : 0,
      photoShare: dropoffs ? withPhoto / dropoffs : 0,
      dropoffs,
      longestStreak,
    }),
  };
}
