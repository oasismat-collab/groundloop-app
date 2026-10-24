/**
 * Generates docs/prototype/regions.data.js from src/data/regions.ts so the
 * browser demo uses an exact copy of the app's city programmes.
 *
 * Run: npx tsx scripts/gen-regions-data.ts
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REGIONS } from '../src/data/regions';

const banner =
  `/**\n` +
  ` * regions.data.js — AUTO-GENERATED from src/data/regions.ts.\n` +
  ` * Exact copy of the app's city programmes so the demo matches production.\n` +
  ` * Do not edit by hand; regenerate with: npx tsx scripts/gen-regions-data.ts\n` +
  ` */\n`;

const out = banner + 'export const REGIONS = ' + JSON.stringify(REGIONS, null, 2) + ';\n';
const target = resolve(__dirname, '../docs/prototype/regions.data.js');
writeFileSync(target, out);
console.log(`wrote ${target} with ${Object.keys(REGIONS).length} regions`);
