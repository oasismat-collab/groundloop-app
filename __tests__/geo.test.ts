import { distanceM, withinGeofence, nearestSite } from '../src/lib/geo';
import { REGIONS } from '../src/data/regions';

describe('geo', () => {
  it('measures distance in metres', () => {
    const d = distanceM({ lat: 42.3601, lng: -71.0589 }, { lat: 42.3611, lng: -71.0589 });
    expect(d).toBeGreaterThan(105);
    expect(d).toBeLessThan(118);
  });
  it('requires accuracy and proximity', () => {
    const site = { lat: 42.3603, lng: -71.058 };
    expect(withinGeofence({ lat: 42.3605, lng: -71.058, accuracy: 20 }, site)).toBe(true);
    expect(withinGeofence({ lat: 42.3605, lng: -71.058, accuracy: 120 }, site)).toBe(false);
    expect(withinGeofence({ lat: 42.37, lng: -71.058, accuracy: 10 }, site)).toBe(false);
  });
  it('finds the nearest Project Oscar site', () => {
    const r = nearestSite({ lat: 42.3605, lng: -71.0582 }, REGIONS.boston!.sites);
    expect(r?.site.label).toContain('City Hall');
  });
});
