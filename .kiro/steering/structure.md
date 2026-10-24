---
inclusion: always
---

# GroundLoop – project structure

```
app/                     expo-router screens
  _layout.tsx            auth gate + providers
  sign-in.tsx            Google / Apple sign-in with the rotating mascot greeting
  log.tsx                drop-off flow: site → photo + location → submit
  region.tsx             choose home city / current city
  (tabs)/
    _layout.tsx          bottom tabs: Home, Map, Check, Community, You
    index.tsx            Home: streak, Peel, log button
    map.tsx              drop-off sites + "suggest a bin"
    check.tsx            "Can it go in?" lookup
    community.tsx        feed, composer, consistency board
    you.tsx              profile, travel mode, history, sign out
src/
  theme.ts               colour and type tokens
  data/regions.ts        city programmes (official sources, sites)
  data/items.ts          sorting items and per-city overrides
  lib/firebase.ts        Firebase init (auth persistence, Firestore, Storage)
  lib/auth.ts            Google + Apple sign-in
  lib/streak.ts          ISO week keys, streak maths (pure, tested)
  lib/geo.ts             haversine, nearest site, geofence check (pure, tested)
  lib/verdict.ts         region-aware sorting verdicts (pure, tested)
  lib/api.ts             Firestore reads/writes used by screens
  hooks/useAuth.ts       auth state
  hooks/useProfile.ts    live profile + member summary
  components/Mascot.tsx  Peel (with ripeness), Bram, Cora
  components/WeekStrip.tsx
functions/src/index.ts   Cloud Functions (trusted logic)
firestore.rules          data access rules
storage.rules            photo upload rules
__tests__/               unit tests for src/lib
data/                    public datasets (CSV + SOURCES.md credit)
docs/prototype/          static browser demo (sample mode, Leaflet, i18n) for GitHub Pages
.kiro/specs/             feature specs (requirements → design → tasks)
.kiro/steering/          product.md, privacy.md, tech.md, structure.md
```

Keep screens thin: data access in `src/lib/api.ts`, pure logic in `src/lib/*` with tests.
