import type { Site } from '../data/regions';

export interface LatLng { lat: number; lng: number }

/** Great-circle distance in metres. */
export function distanceM(a: LatLng, b: LatLng): number {
  const R = 6_371_000;
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestSite(p: LatLng, sites: Site[]): { site: Site; distance: number } | null {
  let best: { site: Site; distance: number } | null = null;
  for (const site of sites) {
    const d = distanceM(p, site);
    if (!best || d < best.distance) best = { site, distance: d };
  }
  return best;
}

export const GEOFENCE_M = 75;
export const MAX_ACCURACY_M = 50;

/** True when a fix is accurate enough and close enough to count as "at the site". */
export function withinGeofence(fix: LatLng & { accuracy: number }, target: LatLng): boolean {
  return fix.accuracy <= MAX_ACCURACY_M && distanceM(fix, target) <= GEOFENCE_M;
}

/** Round to ~11 m so stored requests don't pinpoint a home. */
export const coarse = (n: number) => Math.round(n * 1e4) / 1e4;
