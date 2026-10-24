/**
 * mascots.js — inline SVG mascots. Mirrors the intent of components/Mascot.tsx:
 * Peel the banana with 5 ripeness states, plus Bram (broccoli) and Cora (carrot).
 * Returns SVG strings so screens can inline them without a framework.
 */

const RIPE_FILL = {
  fresh: '#F2C230', ripe: '#E8B41E', spotty: '#D99E1C', browning: '#B07A2A', rotten: '#7A5A2E',
};
const RIPE_SPOTS = { fresh: 0, ripe: 2, spotty: 5, browning: 9, rotten: 14 };

/** Peel the banana at a ripeness state. size in px. */
export function peelSvg(state = 'fresh', size = 120) {
  const fill = RIPE_FILL[state] ?? RIPE_FILL.fresh;
  const n = RIPE_SPOTS[state] ?? 0;
  let spots = '';
  const rnd = mulberry32(42);
  for (let i = 0; i < n; i++) {
    const cx = 40 + rnd() * 50, cy = 30 + rnd() * 70, r = 2 + rnd() * 4;
    spots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="#4A3514" opacity="0.5"/>`;
  }
  const mouth = state === 'rotten'
    ? '<path d="M52 92 q13 -8 26 0" stroke="#2A1E0A" stroke-width="3" fill="none" stroke-linecap="round"/>'
    : '<path d="M52 90 q13 10 26 0" stroke="#2A1E0A" stroke-width="3" fill="none" stroke-linecap="round"/>';
  return `
  <svg class="mascot" width="${size}" height="${size}" viewBox="0 0 130 130" role="img" aria-label="Peel the banana, ${state}">
    <path d="M30 20 C20 55 28 100 70 112 C110 118 116 70 108 40 C104 58 96 92 66 96 C40 96 36 60 46 24 Z" fill="${fill}" stroke="#6B4E12" stroke-width="2"/>
    <path d="M46 24 C40 55 42 86 66 96" fill="none" stroke="#C99A1A" stroke-width="2" opacity="0.6"/>
    ${spots}
    <circle cx="56" cy="74" r="4" fill="#2A1E0A"/>
    <circle cx="80" cy="74" r="4" fill="#2A1E0A"/>
    ${mouth}
  </svg>`;
}

export function bramSvg(size = 120) {
  return `
  <svg class="mascot" width="${size}" height="${size}" viewBox="0 0 130 130" role="img" aria-label="Bram the broccoli">
    <rect x="56" y="78" width="18" height="34" rx="8" fill="#B7D8A0"/>
    <g fill="#2F7A55" stroke="#1F5C3F" stroke-width="2">
      <circle cx="45" cy="55" r="20"/><circle cx="85" cy="55" r="20"/>
      <circle cx="65" cy="40" r="22"/><circle cx="65" cy="62" r="20"/>
    </g>
    <circle cx="57" cy="52" r="4" fill="#0f2117"/><circle cx="76" cy="52" r="4" fill="#0f2117"/>
    <path d="M58 62 q7 7 14 0" stroke="#0f2117" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`;
}

export function coraSvg(size = 120) {
  return `
  <svg class="mascot" width="${size}" height="${size}" viewBox="0 0 130 130" role="img" aria-label="Cora the carrot">
    <g fill="#2F7A55" stroke="#1F5C3F" stroke-width="2">
      <path d="M58 22 q-10 -14 -4 2 Z"/><path d="M65 18 q0 -16 0 4 Z"/><path d="M72 22 q10 -14 4 2 Z"/>
    </g>
    <path d="M48 36 L82 36 L65 112 Z" fill="#E07B2A" stroke="#C86A12" stroke-width="2"/>
    <line x1="55" y1="55" x2="60" y2="56" stroke="#B85E10" stroke-width="2"/>
    <line x1="68" y1="55" x2="74" y2="56" stroke="#B85E10" stroke-width="2"/>
    <line x1="58" y1="72" x2="68" y2="73" stroke="#B85E10" stroke-width="2"/>
    <circle cx="59" cy="48" r="3.5" fill="#2A1405"/><circle cx="71" cy="48" r="3.5" fill="#2A1405"/>
    <path d="M60 56 q5 5 10 0" stroke="#2A1405" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`;
}

export function mascotSvg(which, stateOrSize, size) {
  if (which === 'peel') return peelSvg(stateOrSize ?? 'fresh', size ?? 120);
  if (which === 'bram') return bramSvg(stateOrSize ?? 120);
  if (which === 'cora') return coraSvg(stateOrSize ?? 120);
  return peelSvg('fresh', 120);
}

/** tiny seeded PRNG so spot positions are stable per render */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
