/**
 * logic.js — pure logic + data ported verbatim-in-behaviour from the app's
 * src/lib and src/data. The demo computes proof, seeds, streaks, ripeness and
 * distances the same way the real app does, so sample-mode answers match
 * production. Keep these behaviourally identical to the TS sources.
 *
 * Ported from:
 *   src/lib/streak.ts, src/lib/verdict.ts, src/lib/geo.ts, src/lib/badges.ts
 *   src/data/items.ts, src/data/regions.ts
 */

import { REGIONS } from './regions.data.js';
export { REGIONS };

/* ───────────────────────── streak.ts ───────────────────────── */

const DAY = 86_400_000;

/** ISO 8601 week key, e.g. "2026-W43". */
export function weekKey(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const year = t.getUTCFullYear();
  const week = Math.ceil(((t.getTime() - Date.UTC(year, 0, 1)) / DAY + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function streakInfo(weeks, paused, now = new Date()) {
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

export function freezesAfter(prevCount, newCount, held) {
  if (newCount > prevCount && newCount > 0 && newCount % 4 === 0) return Math.min(2, held + 1);
  return held;
}

export function lastWeekKey(now = new Date()) {
  return weekKey(new Date(now.getTime() - 7 * DAY));
}

/** 'fresh' | 'ripe' | 'spotty' | 'browning' | 'rotten' */
export function ripeness(lastDropAt, now = Date.now()) {
  if (lastDropAt === null) return 'rotten';
  const days = Math.floor((now - lastDropAt) / DAY);
  if (days <= 3) return 'fresh';
  if (days <= 7) return 'ripe';
  if (days <= 13) return 'spotty';
  if (days <= 20) return 'browning';
  return 'rotten';
}

/** Return the last `n` ISO week keys ending with the current week, oldest first. */
export function recentWeeks(n, now = new Date()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(weekKey(new Date(now.getTime() - i * 7 * DAY)));
  return out;
}

/* ───────────────────────── geo.ts ───────────────────────── */

export function distanceM(a, b) {
  const R = 6_371_000;
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestSite(p, sites) {
  let best = null;
  for (const site of sites) {
    const d = distanceM(p, site);
    if (!best || d < best.distance) best = { site, distance: d };
  }
  return best;
}

export const GEOFENCE_M = 75;
export const MAX_ACCURACY_M = 50;

export function withinGeofence(fix, target) {
  return fix.accuracy <= MAX_ACCURACY_M && distanceM(fix, target) <= GEOFENCE_M;
}

/** Round to ~11 m so stored requests don't pinpoint a home. */
export const coarse = (n) => Math.round(n * 1e4) / 1e4;

/* ───────────────────────── badges.ts ───────────────────────── */

const PROOF_BADGE = {
  verified: { id: 'verified', label: 'Location-verified', note: 'A fresh photo and a location fix at the site.' },
  photo: { id: 'photo', label: 'Photo proof', note: 'A fresh photo of your scraps going in.' },
  partner: { id: 'partner', label: 'Partner-verified', note: 'Confirmed by the hauler or smart bin.' },
  self: null,
};

/** Badges for one drop-off, highest-value first. Deterministic. */
export function badgesFor(result, profile) {
  const out = [];
  if (profile.priorCount === 0) {
    out.push({ id: 'first', label: 'First drop-off', note: 'Welcome to the loop. Your scraps are on their way to soil.' });
  }
  const proof = result.proofLevel ? PROOF_BADGE[result.proofLevel] : null;
  if (proof) out.push(proof);
  if (result.careful) {
    out.push({ id: 'careful', label: 'Careful sorter', note: 'You kept stickers, plastic and packaging out.' });
  }
  if (profile.streak > 0 && profile.streak % 4 === 0) {
    out.push({ id: 'freeze', label: `${profile.streak}-week streak`, note: 'You earned a streak freeze for staying consistent.' });
  } else if (profile.streak > 0) {
    out.push({ id: 'streak', label: `${profile.streak}-week streak`, note: 'Showing up week after week is the whole point.' });
  }
  return out;
}

/** Seeds mirror the backend: self 5 / photo 10 / verified 15, +5 careful. */
export const SEEDS = { self: 5, photo: 10, verified: 15, partner: 15 };
export function seedsFor(proofLevel, careful) {
  return (SEEDS[proofLevel] ?? 5) + (careful ? 5 : 0);
}

/* ───────────────────────── items.ts ───────────────────────── */

const CERT = 'Only if it carries a BPI, TUV, OK Compost or CMA certification logo. Otherwise, trash it.';

export const ITEMS = [
  { emoji: '🍌', name: 'Banana peel', verdict: 'bin', core: true, why: 'Fruit and veg scraps are ideal compost.' },
  { emoji: '☕', name: 'Coffee grounds', verdict: 'bin', core: true, why: 'Grounds and paper filters go in.' },
  { emoji: '🥚', name: 'Eggshells', verdict: 'bin', why: 'Eggs and shells are accepted.' },
  { emoji: '🍗', name: 'Chicken bones', verdict: 'bin', why: 'Meat, fish and bones are accepted. Wrap them in paper to stop smells.',
    byRegion: { inagi: ['not', 'Keep meat and bones out of a home composter.'], worcester: ['not', 'Keep meat and bones out of a backyard compost pile.'] } },
  { emoji: '🧀', name: 'Cheese and dairy', verdict: 'bin', why: 'Dairy is accepted. Pour liquids away first.',
    byRegion: { worcester: ['not', 'Keep dairy out of a backyard compost pile.'], inagi: ['not', 'Keep dairy out of a home composter.'] } },
  { emoji: '🍵', name: 'Tea bag', verdict: 'bin', why: 'Non-synthetic tea bags only. Pull off any staple.' },
  { emoji: '💐', name: 'Old flowers', verdict: 'bin', why: 'Houseplants and flowers are accepted.',
    byRegion: { camden: ['not', 'Camden’s food caddy is for food only.'], toronto: ['not', 'Flowers and plants go in yard waste, not the Green Bin.'] } },
  { emoji: '🧻', name: 'Food-stained napkin', verdict: 'bin', why: 'Fine if there are no cleaning chemicals on it.',
    byRegion: { cambridge: ['not', 'Cambridge drop-off carts take food scraps only.'] } },
  { emoji: '🏷️', name: 'Fruit sticker', verdict: 'not', core: true, why: 'Stickers are plastic. Peel them off.' },
  { emoji: '🛍️', name: 'Plastic bag', verdict: 'not', why: 'No plastic in the bins. Empty the scraps in and trash the bag.',
    byRegion: { newton: ['not', 'Use a paper or certified compostable bag.'], camden: ['not', 'Use a compostable liner, newspaper or kitchen roll.'], toronto: ['bin', 'Toronto lets you line the kitchen catcher or Green Bin (not both) with any plastic bag.'] } },
  { emoji: '🥤', name: '“Compostable” cup', verdict: 'not', why: 'Not on this programme’s list. Put it in the trash.',
    byRegion: { boston: ['ask', CERT], brookline: ['ask', 'Only with a BPI, CMA or OK Compost logo.'], cambridge: ['not', 'Cambridge drop-off carts take food scraps only.'], toronto: ['not', 'Not accepted, even if labelled compostable.'], camden: ['not', 'Packaging is not accepted.'] } },
  { emoji: '🍕', name: 'Greasy pizza box', verdict: 'not', why: 'Recycle the clean part, trash the greasy part.',
    byRegion: { toronto: ['bin', 'Food-soiled pizza boxes go in Toronto’s Green Bin.'] } },
  { emoji: '🫗', name: 'Cooking oil', verdict: 'not', core: true, why: 'Let it cool, seal it and trash it.' },
  { emoji: '🐕', name: 'Dog waste', verdict: 'not', why: 'Pet waste is not accepted.', byRegion: { toronto: ['bin', 'Toronto’s Green Bin takes pet waste and cat litter.'] } },
  { emoji: '🧷', name: 'Diaper', verdict: 'not', why: 'Trash only.', byRegion: { toronto: ['bin', 'Toronto’s Green Bin accepts diapers and sanitary products.'] } },
  { emoji: '🍷', name: 'Wine cork', verdict: 'not', why: 'Not on this programme’s list.', byRegion: { brookline: ['bin', 'Brookline accepts wine corks.'] } },
  { emoji: '🔥', name: 'Fireplace ash', verdict: 'not', why: 'Not on this programme’s list.', byRegion: { boston: ['bin', 'Boston accepts cooled ash tied off in a bag.'] } },
  { emoji: '🥫', name: 'Unopened can of beans', verdict: 'share', core: true, why: 'Still good food. Give it to a neighbour or food pantry.' },
  { emoji: '🥡', name: 'Takeaway box with food', verdict: 'ask', why: '', question: 'What is the box made of?', options: [
    { label: 'Plastic or foam', verdict: 'not', why: 'Scrape the food in. Rinse the box and recycle it if your city accepts that plastic.' },
    { label: 'Paper with a compost certification logo', verdict: 'cert', why: '' },
    { label: 'Not sure', verdict: 'not', why: 'Scrape the food in and trash the box. When in doubt, keep it out.' },
  ] },
];

/* ───────────────────────── verdict.ts ───────────────────────── */

const CERT_CITIES = new Set(['boston', 'brookline']);

export function verdictFor(item, regionId, option) {
  const region = REGIONS[regionId];
  if (!region) throw new Error(`Unknown region ${regionId}`);
  const override = item.byRegion?.[regionId];
  if (override) return { verdict: override[0], why: override[1] };
  if (region.rules === 'basic' && !item.core && !item.options) {
    return { verdict: 'ask', why: `We haven’t verified ${region.name}’s rule for this item. Check the ${region.programme} guide.`, unverified: true };
  }
  if (item.options && option !== undefined) {
    const o = item.options[option];
    if (!o) throw new Error('Unknown option');
    if (o.verdict === 'cert') {
      const ok = CERT_CITIES.has(regionId);
      return ok
        ? { verdict: 'bin', why: `${region.name} accepts certified compostable serviceware. Food and box can both go in.` }
        : { verdict: 'not', why: `${region.name}’s programme doesn’t list compostable packaging. Scrape the food in and trash the box.` };
    }
    return { verdict: o.verdict, why: o.why };
  }
  return { verdict: item.verdict, why: item.why };
}

export function searchItems(q) {
  const s = q.trim().toLowerCase();
  return s ? ITEMS.filter((i) => i.name.toLowerCase().includes(s)) : ITEMS.slice(0, 9);
}

/* ───────────────────────── regions.ts ───────────────────────── */
/* REGIONS is imported at the top from regions.data.js (auto-generated copy). */
