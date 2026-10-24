/**
 * Badges earned on a drop-off, derived purely from server-written values
 * (Req 4.7, 6.2). The server decides proof, seeds and the streak; badges are a
 * presentational read of those, never something the client awards.
 *
 * Kept pure and tested so the Home/You badge grids and the log result screen
 * all agree. In line with the product principles, nothing here rewards waste
 * volume — only proof quality, careful sorting and consistency.
 */
import type { ProofLevel } from './api';

export interface Badge {
  id: string;
  label: string;
  /** A short, warm one-liner for why it was earned. */
  note: string;
}

/** The finalised drop-off fields the badges read (written by verifyDropoff). */
export interface DropoffResult {
  proofLevel?: ProofLevel;
  seedsAwarded?: number;
  careful?: boolean;
}

/** Profile state used to detect firsts and milestones (written by verifyDropoff). */
export interface BadgeProfile {
  /** Streak after this drop-off. */
  streak: number;
  /** Count of drop-offs by proof level, before this one, to detect a first. */
  priorCount: number;
  /** Freezes held after this drop-off (a new multiple-of-4 grants one). */
  freezes?: number;
}

const PROOF_BADGE: Record<ProofLevel, Badge | null> = {
  verified: { id: 'verified', label: 'Location-verified', note: 'A fresh photo and a location fix at the site.' },
  photo: { id: 'photo', label: 'Photo proof', note: 'A fresh photo of your scraps going in.' },
  partner: { id: 'partner', label: 'Partner-verified', note: 'Confirmed by the hauler or smart bin.' },
  self: null,
};

/**
 * Badges for one drop-off, highest-value first. Deterministic, so the same
 * result always shows the same badges.
 */
export function badgesFor(result: DropoffResult, profile: BadgeProfile): Badge[] {
  const out: Badge[] = [];

  if (profile.priorCount === 0) {
    out.push({ id: 'first', label: 'First drop-off', note: 'Welcome to the loop. Your scraps are on their way to soil.' });
  }

  const proof = result.proofLevel ? PROOF_BADGE[result.proofLevel] : null;
  if (proof) out.push(proof);

  if (result.careful) {
    out.push({ id: 'careful', label: 'Careful sorter', note: 'You kept stickers, plastic and packaging out.' });
  }

  // A streak that just reached a multiple of 4 earns a freeze — worth celebrating.
  if (profile.streak > 0 && profile.streak % 4 === 0) {
    out.push({ id: 'freeze', label: `${profile.streak}-week streak`, note: 'You earned a streak freeze for staying consistent.' });
  } else if (profile.streak > 0) {
    out.push({ id: 'streak', label: `${profile.streak}-week streak`, note: 'Showing up week after week is the whole point.' });
  }

  return out;
}
