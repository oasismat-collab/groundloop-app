/**
 * logic.spec.mjs — fidelity spot-check (web-demo tasks 2.6).
 * Confirms the ported demo logic matches the app's unit-test expectations.
 * Run with: node docs/prototype/logic.spec.mjs
 * This is a lightweight equivalence check, not a replacement for the app's Jest suite.
 */
import assert from 'node:assert';
import {
  verdictFor, searchItems, ITEMS, REGIONS,
  distanceM, withinGeofence, nearestSite,
  streakInfo, weekKey, ripeness, seedsFor,
} from './logic.js';

const item = (n) => ITEMS.find((i) => i.name === n);
let n = 0;
const ok = (label, cond) => { assert.ok(cond, label); n++; };

// verdict.ts equivalence (from __tests__/verdict.test.ts)
ok('toronto dog waste -> bin', verdictFor(item('Dog waste'), 'toronto').verdict === 'bin');
ok('boston dog waste -> not', verdictFor(item('Dog waste'), 'boston').verdict === 'not');
ok('seoul chicken bones unverified', verdictFor(item('Chicken bones'), 'seoul').unverified === true);
ok('seoul banana core still answered', verdictFor(item('Banana peel'), 'seoul').verdict === 'bin');
ok('boston cert box -> bin', verdictFor(item('Takeaway box with food'), 'boston', 1).verdict === 'bin');
ok('cambridge cert box -> not', verdictFor(item('Takeaway box with food'), 'cambridge', 1).verdict === 'not');

// geo.ts equivalence (from __tests__/geo.test.ts)
const d = distanceM({ lat: 42.3601, lng: -71.0589 }, { lat: 42.3611, lng: -71.0589 });
ok('distance ~111m', d > 105 && d < 118);
const site = { lat: 42.3603, lng: -71.058 };
ok('geofence close+accurate -> true', withinGeofence({ lat: 42.3605, lng: -71.058, accuracy: 20 }, site) === true);
ok('geofence inaccurate -> false', withinGeofence({ lat: 42.3605, lng: -71.058, accuracy: 120 }, site) === false);
ok('geofence far -> false', withinGeofence({ lat: 42.37, lng: -71.058, accuracy: 10 }, site) === false);
ok('nearest is City Hall', nearestSite({ lat: 42.3605, lng: -71.0582 }, REGIONS.boston.sites).site.label.includes('City Hall'));

// streak.ts equivalence
const now = new Date('2026-10-24T12:00:00');          // a Saturday
const cur = weekKey(now);
const prev = weekKey(new Date(now.getTime() - 7 * 86400000));
ok('streak counts consecutive done weeks', streakInfo([cur, prev], [], now).count === 2);
ok('paused week does not break streak', streakInfo([cur, weekKey(new Date(now.getTime() - 14 * 86400000))], [prev], now).count === 2);
ok('ripeness fresh at 0 days', ripeness(now.getTime(), now.getTime()) === 'fresh');
ok('ripeness rotten at null', ripeness(null) === 'rotten');
ok('ripeness rotten past 20 days', ripeness(now.getTime() - 25 * 86400000, now.getTime()) === 'rotten');

// seeds mirror backend
ok('verified+careful = 20 seeds', seedsFor('verified', true) === 20);
ok('self no-careful = 5 seeds', seedsFor('self', false) === 5);

console.log(`logic.spec: ${n} assertions passed — demo logic matches the app.`);
