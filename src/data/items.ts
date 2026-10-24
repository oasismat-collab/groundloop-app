import type { RegionId } from './regions';

export type Verdict = 'bin' | 'not' | 'share' | 'ask';
export interface ItemOption { label: string; verdict: Verdict | 'cert'; why: string }
export interface Item {
  emoji: string;
  name: string;
  verdict: Verdict;
  why: string;
  /** Safe to answer even where only basic rules are verified. */
  core?: boolean;
  /** Per-city overrides from official guides. */
  byRegion?: Partial<Record<RegionId, [Verdict, string]>>;
  question?: string;
  options?: ItemOption[];
}

const CERT = 'Only if it carries a BPI, TUV, OK Compost or CMA certification logo. Otherwise, trash it.';

export const ITEMS: Item[] = [
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
