/**
 * data.sample.js — all sample-mode data for the demo. No network, no Firebase.
 * Seeded so the partner dashboard naturally shows at least one area BELOW the
 * 10-user minimum, making the privacy suppression note visible by default.
 */
import { recentWeeks } from './logic.js';

/** The signed-in sample resident (Home / You / recap). */
export const sampleUser = {
  name: 'Maya',
  city: 'boston',
  // A 7-week streak with one travelled (paused) week, built relative to "now".
  get weeks() { const w = recentWeeks(9); return [w[0], w[1], w[2], w[4], w[5], w[6], w[8]]; },
  get paused() { const w = recentWeeks(9); return [w[3], w[7]]; },
  lastDropAt: Date.now() - 2 * 86_400_000, // 2 days ago → Peel 'fresh'
  priorCount: 23,
  photoShare: 0.78,
  longestStreak: 11,
  citiesCount: 2,
  topItems: ['Banana peel', 'Coffee grounds', 'Eggshells'],
  optedIn: false, // default OFF (privacy.md)
};

/** Community feed. No times, no locations, never ranked by quantity. */
export const samplePosts = [
  { id: 'p1', author: 'Darnell', city: 'boston', type: 'milestone', text: 'Hit 20 weeks today. Peel has never looked fresher 🍌', cheers: 14, cheered: false, mine: false },
  { id: 'p2', author: 'Priya', city: 'boston', type: 'tip', text: 'Freeze your scraps in a yogurt tub — no smell, no fruit flies, easy drop-off.', cheers: 31, cheered: false, mine: false },
  { id: 'p3', author: 'Maya', city: 'boston', type: 'reflection', text: 'First time I actually knew the pizza box rule. Small win.', cheers: 6, cheered: false, mine: true },
  { id: 'p4', author: 'Sofia', city: 'cambridge', type: 'tip', text: 'The Danehy Park cart is open 24/7 and never full on weekday mornings.', cheers: 9, cheered: false, mine: false },
  { id: 'p5', author: 'Jean', city: 'boston', type: 'question', text: 'Anyone know if the City Hall bin code changed this month?', cheers: 3, cheered: false, mine: false },
  { id: 'p6', author: 'Linh', city: 'toronto', type: 'milestone', text: 'Green Bin out every week since spring. Feels good.', cheers: 12, cheered: false, mine: false },
];

/**
 * Aggregated participation per Boston area (opted-in residents only).
 * NOTE the seeding: most areas clear 10; "Hyde Park" sits at 4 so the
 * 10-user minimum suppresses/merges it and the privacy note shows. Maya's own
 * opt-in toggle adds/removes 1 from her area (Fenway), near the boundary.
 */
export const sampleAreaStats = [
  { area: 'Downtown', city: 'boston', users: 41, dropoffs: 612, lat: 42.3603, lng: -71.058 },
  { area: 'Jamaica Plain', city: 'boston', users: 28, dropoffs: 403, lat: 42.3145, lng: -71.112 },
  { area: 'South End', city: 'boston', users: 19, dropoffs: 266, lat: 42.3419, lng: -71.077 },
  { area: 'Roxbury', city: 'boston', users: 13, dropoffs: 171, lat: 42.316, lng: -71.0984 },
  { area: 'Fenway', city: 'boston', users: 9, dropoffs: 118, lat: 42.3446, lng: -71.096 }, // boundary; Maya opt-in flips this to 10
  { area: 'Hyde Park', city: 'boston', users: 4, dropoffs: 47, lat: 42.2585, lng: -71.1213 }, // below 10 → suppressed/merged
];

/** The area whose count Maya's opt-in toggle affects. */
export const MAYA_AREA = 'Fenway';

/** Weekly participation trend (opted-in active users), oldest → newest. */
export const sampleTrend = [38, 44, 49, 47, 55, 61, 58, 66, 72, 79, 83, 91];

/**
 * Sample resident "suggest a bin" requests (coarsened coordinates), used by the
 * dashboard's underserved-areas ranking. Clustered away from existing sites.
 */
export const sampleRequests = [
  { id: 'r1', city: 'boston', lat: 42.2812, lng: -71.1442, note: 'Nothing near West Roxbury border' },
  { id: 'r2', city: 'boston', lat: 42.2798, lng: -71.1467, note: '' },
  { id: 'r3', city: 'boston', lat: 42.2825, lng: -71.1431, note: 'Lots of students here' },
  { id: 'r4', city: 'boston', lat: 42.2788, lng: -71.1455, note: '' },
  { id: 'r5', city: 'boston', lat: 42.3889, lng: -71.0092, note: 'East Boston waterfront' },
  { id: 'r6', city: 'boston', lat: 42.3901, lng: -71.0115, note: '' },
];

/**
 * Public dataset mirror (data/drop_off_sites.csv) — Boston Project Oscar bins.
 * Kept inline so the page needs no fetch/CSV parser and works offline.
 * Source credited in data/SOURCES.md and in the dashboard map UI.
 */
export const PUBLIC_DATASET = {
  name: 'Project Oscar drop-off sites',
  source: 'City of Boston',
  url: 'https://www.boston.gov/departments/public-works/project-oscar',
  points: [
    { name: '200 Cambridge St', area: 'Beacon Hill', lat: 42.361, lng: -71.0655 },
    { name: 'Faneuil Gardens', area: 'Brighton', lat: 42.3563, lng: -71.1618 },
    { name: 'Boston Green Academy', area: 'Brighton', lat: 42.3553, lng: -71.1395 },
    { name: '1825 Commonwealth Ave', area: 'Brighton', lat: 42.3417, lng: -71.153 },
    { name: '31 Austin St', area: 'Charlestown', lat: 42.3752, lng: -71.0662 },
    { name: 'Tai Tung Village', area: 'Chinatown', lat: 42.3482, lng: -71.0607 },
    { name: 'City Hall Plaza', area: 'Downtown', lat: 42.3603, lng: -71.058 },
    { name: 'Codman Square Library', area: 'Dorchester', lat: 42.2905, lng: -71.0713 },
    { name: 'Memorial Stadium Park', area: 'East Boston', lat: 42.382, lng: -71.026 },
    { name: 'New Edgerly Plaza', area: 'Fenway', lat: 42.3446, lng: -71.096 },
    { name: '1234 Hyde Park Ave', area: 'Hyde Park', lat: 42.2585, lng: -71.1213 },
    { name: 'Curtis Hall', area: 'Jamaica Plain', lat: 42.3095, lng: -71.1148 },
    { name: '490 Centre St', area: 'Jamaica Plain', lat: 42.3196, lng: -71.1095 },
    { name: 'Tobin Community Center', area: 'Mission Hill', lat: 42.3321, lng: -71.0995 },
    { name: 'Nazzaro Center', area: 'North End', lat: 42.3656, lng: -71.0546 },
    { name: '4210 Washington St', area: 'Roslindale', lat: 42.2868, lng: -71.1287 },
    { name: '3042 Washington St', area: 'Roxbury', lat: 42.316, lng: -71.0984 },
    { name: '450 West Broadway', area: 'South Boston', lat: 42.3365, lng: -71.0477 },
    { name: 'South End Library', area: 'South End', lat: 42.3419, lng: -71.077 },
    { name: 'Causeway St', area: 'West End', lat: 42.3672, lng: -71.0605 },
  ],
};

/** Mascot rotation order (Req 3.2). */
export const MASCOTS = ['peel', 'bram', 'cora'];
