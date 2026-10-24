import { ITEMS, type Item, type Verdict } from '../data/items';
import { REGIONS } from '../data/regions';

export interface VerdictResult { verdict: Verdict; why: string; unverified?: boolean }

const CERT_CITIES = new Set(['boston', 'brookline']);

/** Region-aware sorting answer. `option` is the index chosen for items with a follow-up question. */
export function verdictFor(item: Item, regionId: string, option?: number): VerdictResult {
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

export function searchItems(q: string): Item[] {
  const s = q.trim().toLowerCase();
  return s ? ITEMS.filter((i) => i.name.toLowerCase().includes(s)) : ITEMS.slice(0, 9);
}
