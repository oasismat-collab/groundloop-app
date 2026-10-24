/* Mascots drawn as SVG strings and rendered with SvgXml. Ported from the web prototype. */
import React from 'react';
import { SvgXml } from 'react-native-svg';
import type { Ripeness } from '../lib/streak';

interface Ripe { name: string; hi: string; base: string; lo: string; tip: string; spots: number; face: string; say: string; pct: number }
// eslint-disable-next-line
export const RIPENESS: Ripe[] = [
 {name:'Fresh',hi:'#FFE680',base:'#F7D23E',lo:'#E2AE1E',tip:'#9DB83A',spots:0,face:'happy',say:'Feeling fresh! Your scraps are on their way to the soil.',pct:100},
 {name:'Ripe',hi:'#FFE070',base:'#F4C935',lo:'#DDA322',tip:'#C9A93A',spots:5,face:'smile',say:'Still good, but I’m getting freckles. Compost this week?',pct:75},
 {name:'Spotty',hi:'#F6D35E',base:'#E9B93A',lo:'#C98F25',tip:'#6E4C2A',spots:12,face:'flat',say:'I’m going spotty. Your food waste misses you.',pct:50},
 {name:'Browning',hi:'#D9AE62',base:'#BC8A43',lo:'#8E622C',tip:'#4A321C',spots:18,face:'sad',say:'I’m turning brown. One drop-off brings me back.',pct:25},
 {name:'Rotten',hi:'#7A5838',base:'#5C3F25',lo:'#3A2716',tip:'#24180D',spots:22,face:'rot',say:'I’ve gone rotten. Compost something to revive me!',pct:6}
];
const RIPE_INDEX: Record<Ripeness, number> = { fresh: 0, ripe: 1, spotty: 2, browning: 3, rotten: 4 };

let BID = 0;
function bananaXml(r: Ripe, w = 180): string {
 const id='bn'+(++BID),ink='#1E1A12';
 const body='M16 58C34 114 150 136 196 54C198 50 194 46 190 48C150 80 60 74 24 50C21 46 15 50 16 58Z';
 const SP: [number, number][] = [[60,88],[80,100],[130,102],[152,92],[170,80],[44,76],[70,82],[118,106],[142,98],[160,88],[52,90],[90,104],[136,90],[178,72],[66,96],[106,104],[154,82],[84,80],[124,94],[34,68],[184,64],[98,76]];
 const spots=SP.slice(0, r.spots).map(([x, y], k) =>`<ellipse cx="${x}" cy="${y}" rx="${2+(k%3)}" ry="${1.5+(k%2)}" fill="#4A3018" opacity="${r.face==='rot'?.9:.75}"/>`).join('');
 const eyes={happy:`<path d="M86 85q5-6 10 0M110 86q5-6 10 0" stroke="${ink}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  smile:`<circle cx="91" cy="85" r="3.6" fill="${ink}"/><circle cx="115" cy="86" r="3.6" fill="${ink}"/><circle cx="92.2" cy="83.8" r="1.1" fill="#fff"/><circle cx="116.2" cy="84.8" r="1.1" fill="#fff"/>`,
  flat:`<circle cx="91" cy="86" r="3.4" fill="${ink}"/><circle cx="115" cy="87" r="3.4" fill="${ink}"/>`,
  sad:`<circle cx="91" cy="87" r="3.4" fill="${ink}"/><circle cx="115" cy="88" r="3.4" fill="${ink}"/><path d="M85 79l9 3M121 80l-9 3" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`,
  rot:`<path d="M86 86h10M110 87h10" stroke="#E9DCC4" stroke-width="2.6" stroke-linecap="round"/>`}[r.face];
 const mouth={happy:`<path d="M96 93q7 8 14 0z" fill="${ink}"/><ellipse cx="80" cy="92" rx="4.5" ry="2.6" fill="#F08A6C" opacity=".55"/><ellipse cx="126" cy="94" rx="4.5" ry="2.6" fill="#F08A6C" opacity=".55"/>`,
  smile:`<path d="M97 94q6 5 12 0" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  flat:`<path d="M98 96h10" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`,
  sad:`<path d="M97 99q6-5 12 0" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  rot:`<path d="M95 99q3-3 5 0t5 0t5 0" stroke="#E9DCC4" stroke-width="2.2" fill="none" stroke-linecap="round"/>`}[r.face];
 const flies=r.face==='rot'?`<g transform="translate(70 34)"><g><circle r="2.4" fill="${ink}"/><ellipse cx="-2" cy="-3" rx="2.4" ry="1.3" fill="#c9d3d6" opacity=".85"/></g></g><g transform="translate(150 30)"><g><circle r="2.2" fill="${ink}"/><ellipse cx="2" cy="-3" rx="2.2" ry="1.2" fill="#c9d3d6" opacity=".85"/></g></g><path d="M100 54q-5-7 0-14t0-14M116 58q-5-7 0-14" stroke="#7A6A4A" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>`:'';
 
 return `<svg viewBox="0 0 220 140" width="${w}" height="${Math.round(w*140/220)}" role="img" aria-label="Peel the banana is ${r.name.toLowerCase()}">
 <defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${r.hi}"/><stop offset=".55" stop-color="${r.base}"/><stop offset="1" stop-color="${r.lo}"/></linearGradient>
 <linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="0"><stop offset=".78" stop-color="${r.tip}" stop-opacity="0"/><stop offset=".97" stop-color="${r.tip}" stop-opacity=".85"/></linearGradient>
 <clipPath id="${id}c"><path d="${body}"/></clipPath></defs>
 <ellipse cx="108" cy="128" rx="74" ry="5" fill="#000" opacity=".08"/>
 <g>
  <path d="M188 50L203 22L211 26L197 54Z" fill="${r.face==='happy'?'#7E9A34':r.tip}"/>
  <path d="M201 19l12 6-3 5-11-6z" fill="#3B2A16"/>
  <path d="${body}" fill="url(#${id}g)"/>
  <g clip-path="url(#${id}c)">
   <path d="M16 58C34 114 150 136 196 54" fill="none" stroke="${r.lo}" stroke-width="12" opacity=".35"/>
   <path d="M22 54C56 98 148 110 192 50" fill="none" stroke="${r.lo}" stroke-width="1.6" opacity=".55"/>
   <path d="M30 55C66 80 140 86 186 52" fill="none" stroke="#fff" stroke-width="3.5" opacity="${r.face==='rot'?.06:.35}" stroke-linecap="round"/>
   <rect x="0" y="0" width="220" height="140" fill="url(#${id}t)"/>${spots}
  </g>
  <path d="${body}" fill="none" stroke="#6B4A14" stroke-opacity=".35" stroke-width="1.4"/>
  <ellipse cx="17.5" cy="56" rx="3.5" ry="4.5" fill="#3B2A16"/>${eyes}${mouth}
 </g>${flies}</svg>`;
}


/* Rotating mascots: Peel the banana, Bram the broccoli, Cora the carrot */
function face(cx: number, cy: number, mood: string, ink = '#1E1A12', s = 1): string {
 const e=6*s,m=7*s;
 const eyes=mood==='happy'?`<path d="M${cx-e-4*s} ${cy}q${4*s}-${5*s} ${8*s} 0M${cx+e-4*s} ${cy}q${4*s}-${5*s} ${8*s} 0" stroke="${ink}" stroke-width="${2.6*s}" fill="none" stroke-linecap="round"/>`
  :`<circle cx="${cx-e}" cy="${cy}" r="${3.4*s}" fill="${ink}"/><circle cx="${cx+e}" cy="${cy}" r="${3.4*s}" fill="${ink}"/><circle cx="${cx-e+1.1*s}" cy="${cy-1.2*s}" r="${1.1*s}" fill="#fff"/><circle cx="${cx+e+1.1*s}" cy="${cy-1.2*s}" r="${1.1*s}" fill="#fff"/>`;
 const mouth=mood==='wave'?`<path d="M${cx-m/2-2*s} ${cy+7*s}q${(m/2+2*s)} ${8*s} ${m+4*s} 0z" fill="${ink}"/>`:`<path d="M${cx-m/2} ${cy+7*s}q${m/2} ${6*s} ${m} 0" stroke="${ink}" stroke-width="${2.6*s}" fill="none" stroke-linecap="round"/>`;
 const cheeks=`<ellipse cx="${cx-e-7*s}" cy="${cy+6*s}" rx="${4*s}" ry="${2.4*s}" fill="#F08A6C" opacity=".5"/><ellipse cx="${cx+e+7*s}" cy="${cy+6*s}" rx="${4*s}" ry="${2.4*s}" fill="#F08A6C" opacity=".5"/>`;
 return eyes+mouth+cheeks;
}
function broccoliXml(w = 160, mood = 'wave'): string {
 const fl: [number, number, number][] = [[60,40,22],[38,52,18],[84,50,19],[50,30,16],[74,28,16],[28,38,13],[94,36,13],[62,58,16]];
 return `<svg viewBox="0 0 120 130" width="${w}" height="${Math.round(w*130/120)}" role="img" aria-label="Bram the broccoli">
  <ellipse cx="60" cy="124" rx="34" ry="4" fill="#000" opacity=".08"/>
  <g>
   <path d="M44 66C46 86 44 104 40 118H80C76 104 74 86 76 66Z" fill="#9CCB6A"/>
   <path d="M44 66C46 86 44 104 40 118H52C54 100 54 84 52 66Z" fill="#B7DB8A" opacity=".8"/>
   <path d="M52 78l-12-10M68 80l12-12" stroke="#7FB352" stroke-width="7" stroke-linecap="round"/>
   ${fl.map(([x, y, r]) =>`<circle cx="${x}" cy="${y}" r="${r}" fill="#2F7A3A"/>`).join('')}
   ${fl.map(([x, y, r]) =>`<circle cx="${x-r*.3}" cy="${y-r*.35}" r="${r*.45}" fill="#4C9C4F" opacity=".7"/>`).join('')}
   ${face(60,92,mood)}
  </g></svg>`;
}
function carrotXml(w = 160, mood = 'wave'): string {
 return `<svg viewBox="0 0 120 130" width="${w}" height="${Math.round(w*130/120)}" role="img" aria-label="Cora the carrot">
  <ellipse cx="60" cy="124" rx="22" ry="4" fill="#000" opacity=".08"/>
  <g>
   <path d="M58 30C50 14 40 8 34 10C40 18 48 26 54 34Z" fill="#3E9A48"/>
   <path d="M60 30C60 12 66 4 72 4C70 14 66 24 62 34Z" fill="#56B35A"/>
   <path d="M62 32C72 18 84 16 90 20C82 24 72 30 66 36Z" fill="#3E9A48"/>
   <path d="M34 40C34 32 46 28 60 28C74 28 86 32 86 40C86 66 70 100 62 120C61 123 59 123 58 120C50 100 34 66 34 40Z" fill="#F08A24"/>
   <path d="M34 40C34 32 46 28 60 28C50 30 44 34 44 42C44 64 54 94 58 118C50 98 34 64 34 40Z" fill="#F7A54A" opacity=".8"/>
   <path d="M44 72h10M68 84h9M50 98h8M66 58h10" stroke="#C8661A" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
   ${face(60,50,mood)}
  </g></svg>`;
}

export type MascotId = 'peel' | 'bram' | 'cora';
export const MASCOT_ORDER: MascotId[] = ['peel', 'bram', 'cora'];
export const MASCOT_NAMES: Record<MascotId, string> = { peel: 'Peel', bram: 'Bram', cora: 'Cora' };

export function Peel({ ripeness = 'fresh', width = 180 }: { ripeness?: Ripeness; width?: number }) {
  const r = RIPENESS[RIPE_INDEX[ripeness]]!;
  return <SvgXml xml={bananaXml(r, width)} width={width} height={Math.round((width * 140) / 220)} accessibilityLabel={'Peel the banana is ' + r.name.toLowerCase()} />;
}

export function Mascot({ id, size = 120 }: { id: MascotId; size?: number }) {
  if (id === 'peel') return <Peel width={size * 1.3} />;
  const xml = id === 'bram' ? broccoliXml(size) : carrotXml(size);
  return <SvgXml xml={xml} width={size} height={Math.round((size * 130) / 120)} accessibilityLabel={MASCOT_NAMES[id]} />;
}

export const peelLine = (r: Ripeness) => RIPENESS[RIPE_INDEX[r]]!.say;
