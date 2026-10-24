/**
 * Generates `functions/src/regions.json` from `src/data/regions.ts` (task 5.6).
 *
 * The Cloud Function `verifyDropoff` needs only each region's `kind` and the
 * bare coordinates of its sites to run the geofence check. It must not ship the
 * whole programme description, so this script projects the rich client data
 * down to `{ [regionId]: { kind, sites: [{ id, lat, lng }] } }`.
 *
 * `src/data/regions.ts` stays the single source of truth; re-run this whenever
 * it changes (an agent hook on save is suggested in the README). The output is
 * sorted and formatted deterministically so re-running produces no spurious
 * diff.
 *
 * Usage:
 *   npm run gen:regions          # write functions/src/regions.json
 *   npm run gen:regions -- --check   # exit non-zero if it would change (for CI)
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REGIONS } from '../src/data/regions';

// Run from the repo root via `npm run gen:regions`, so cwd is the project root.
// (Avoids import.meta/__dirname so this typechecks under the app's tsconfig.)
const OUT = resolve(process.cwd(), 'functions/src/regions.json');

interface SiteOut {
  id: string;
  lat: number;
  lng: number;
}
interface RegionOut {
  kind: string;
  sites: SiteOut[];
}

function build(): Record<string, RegionOut> {
  const out: Record<string, RegionOut> = {};
  // Preserve the source declaration order in regions.ts (JS keeps string-key
  // insertion order), so the generated JSON diff only reflects real changes.
  for (const [id, r] of Object.entries(REGIONS)) {
    out[id] = {
      kind: r.kind,
      sites: r.sites.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng })),
    };
  }
  return out;
}

// Match the existing file's format exactly: 1-space indent, trailing newline.
const json = JSON.stringify(build(), null, 1) + '\n';

const check = process.argv.includes('--check');
if (check) {
  let current = '';
  try {
    current = readFileSync(OUT, 'utf8');
  } catch {
    /* missing file counts as out of date */
  }
  if (current !== json) {
    console.error('functions/src/regions.json is out of date. Run `npm run gen:regions`.');
    process.exit(1);
  }
  console.log('functions/src/regions.json is up to date.');
} else {
  writeFileSync(OUT, json);
  const count = Object.keys(JSON.parse(json)).length;
  console.log(`Wrote ${OUT} (${count} regions).`);
}
