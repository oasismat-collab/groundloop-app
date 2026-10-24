/* City food-waste programmes. Every entry links its official source. Coordinates are approximate. */
export type RegionKind = 'drop' | 'curb' | 'station' | 'rfid' | 'none';
export interface Site { id: string; area: string; label: string; note: string; lat: number; lng: number }
export interface Region { id: string; country: string; name: string; programme: string; kind: RegionKind; rules: 'full' | 'basic'; summary: string; access: string; processor: string; tip: string; source: string; signup?: string; sites: Site[] }

export const REGIONS: Record<string, Region> = {
  "boston": {
    "id": "boston",
    "country": "United States",
    "name": "Boston",
    "programme": "Project Oscar",
    "kind": "drop",
    "rules": "full",
    "summary": "Free 24/7 neighbourhood food-scrap bins",
    "access": "Bins are locked. The City posts the lock code on its website: 2-1-4.",
    "processor": "Black Earth Compost empties the bins and composts the scraps at its sites in Manchester, Groton and Framingham, MA. The compost is sold to garden centres, farmers and gardeners.",
    "tip": "Boston also takes certified compostable serviceware (BPI, TUV, OK Compost or CMA logo) and cooled ash tied off in a bag.",
    "source": "https://www.boston.gov/departments/public-works/project-oscar",
    "sites": [
      {
        "id": "boston-1",
        "area": "Beacon Hill",
        "label": "200 Cambridge St",
        "note": "Next to the fire station",
        "lat": 42.361,
        "lng": -71.0655
      },
      {
        "id": "boston-2",
        "area": "Brighton",
        "label": "Faneuil Gardens Apartments",
        "note": "West parking lot, across from McKinney Playground",
        "lat": 42.3563,
        "lng": -71.1618
      },
      {
        "id": "boston-3",
        "area": "Brighton",
        "label": "Boston Green Academy, 678 Cambridge St",
        "note": "School parking lot off Cambridge St",
        "lat": 42.3553,
        "lng": -71.1395
      }
    ]
  },
  "cambridge": {
    "id": "cambridge",
    "country": "United States",
    "name": "Cambridge",
    "programme": "Cambridge Curbside Composting",
    "kind": "drop",
    "rules": "full",
    "summary": "Weekly curbside pickup plus six 24/7 drop-off sites",
    "access": "Drop-off carts are open 24 hours. Free kitchen bins from the Department of Public Works.",
    "processor": "Run by the City of Cambridge Department of Public Works.",
    "tip": "Drop-off sites take food scraps only. If you carry scraps in a plastic bag, empty them into the cart and put the bag in the trash.",
    "source": "https://cambridgema.gov/Services/curbsidecomposting/compostdropoff",
    "sites": [
      {
        "id": "cambridge-1",
        "area": "East Cambridge",
        "label": "Cambridge Crossing",
        "note": "Across from 10 Education Circle",
        "lat": 42.3727,
        "lng": -71.0758
      },
      {
        "id": "cambridge-2",
        "area": "Riverside",
        "label": "Moore Youth Center, 12 Gilmore St",
        "note": "",
        "lat": 42.36,
        "lng": -71.115
      }
    ]
  }
};

export type RegionId = keyof typeof REGIONS;
