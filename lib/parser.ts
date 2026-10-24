import { foods, components, type Food } from './expanded-catalogue';

export type Interpretation = {
  food: Food;
  part: string;
  quantity: number;
  grams: number | null;
  mass: number;
  label: string;
};

const numbers: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  half: 0.5, quarter: 0.25,
  'one-third': 1/3, 'a third': 1/3, 'one third': 1/3,
  'a half': 0.5, 'a quarter': 0.25
};

export function parse(input: string): Interpretation {
  const text = input.toLowerCase().trim()
    .replace(/\bskins?\b/g, 'peel')
    .replace(/\bpeels\b/g, 'peel')
    .replace(/\bcores\b/g, 'core')
    .replace(/\bshells?\b/g, 'shell');
  
  if (!text || text.length > 200) {
    throw new Error('Try a short phrase, such as "one banana" or "two orange peels".');
  }
  
  // Find matching foods - sort by length (longest first) to match "egg shell" before "egg"
  const sortedFoods = [...foods].sort((a, b) => b.length - a.length);
  const found = sortedFoods.filter(f => {
    const regex = new RegExp(`\\b${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'i');
    return regex.test(text);
  });
  
  if (found.length === 0) {
    throw new Error('Food not recognized. Try typing a few letters to see available options.');
  }
  
  // Take only the first (longest) match to avoid conflicts
  const food = found[0];
  
  // Check for parts
  const parts = ['peel', 'core', 'flesh', 'shell', 'whole'].filter(p =>
    new RegExp(`\\b${p}\\b`).test(text)
  );
  
  if (parts.length > 1) {
    throw new Error('Choose one part: whole, flesh, peel, core, or shell.');
  }
  
  const part = /\b(without peel|without skin|peeled)\b/.test(text) ? 'flesh' : parts[0] || 'whole';
  
  // Check if we have data for this food/part combination
  const availableComponents = components(food, part);
  if (!availableComponents.length) {
    throw new Error(`We do not have data for ${food} ${part}. Try just "${food}" or check the dropdown.`);
  }
  
  // Parse quantity
  const g = text.match(/(\d+(?:\.\d+)?)\s*(?:g|grams?)\b/);
  const fraction = text.match(/\b(\d+)\s*\/\s*(\d+)\b/);
  const word = Object.keys(numbers)
    .sort((a, b) => b.length - a.length)
    .find(w => new RegExp(`\\b${w}\\b`).test(text));
  const numeric = text.match(/\b\d+(?:\.\d+)?\b/);
  
  const quantity = g ? 1 
    : fraction ? Number(fraction[1]) / Number(fraction[2])
    : word ? numbers[word]
    : numeric ? Number(numeric[0])
    : 1;
  
  if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 10000) {
    throw new Error('Please use a positive portion up to 10,000 items or grams.');
  }
  
  const grams = g ? Number(g[1]) : null;
  if (grams !== null && (grams <= 0 || grams > 10000)) {
    throw new Error('Please enter between 0 and 10,000 grams.');
  }
  
  // Calculate mass
  const mass = grams ?? availableComponents.reduce((sum, m) => sum + m.portionG, 0) * quantity;
  const q = Number(quantity.toFixed(2));
  
  // Generate label
  const label = grams !== null
    ? `${grams} g ${food}${part === 'whole' ? '' : ' ' + part}`
    : `${q} ${food}${quantity > 1 ? 's' : ''}${part === 'whole' ? '' : ' ' + part}`;
  
  return { food, part, quantity, grams, mass, label };
}
