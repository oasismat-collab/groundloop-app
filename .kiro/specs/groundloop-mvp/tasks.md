# Implementation plan – GroundLoop MVP

Items marked [x] are already scaffolded in this repository. Kiro: start at the first unchecked task.

- [x] 1. Project setup
  - Expo + expo-router + TypeScript, Jest (`jest-expo`), ESLint, CI workflow
  - `app.config.ts` reading `.env`
  - _Requirements: all_

- [x] 2. Pure logic with tests
  - [x] 2.1 `src/lib/streak.ts` – ISO week keys, streak, days left, freeze rules – _Req 5_
  - [x] 2.2 `src/lib/geo.ts` – haversine, nearest site, geofence – _Req 4.4_
  - [x] 2.3 `src/lib/verdict.ts` – region-aware verdicts and basic-rules fallback – _Req 3.3, 3.4_
  - [x] 2.4 `src/data/regions.ts` and `src/data/items.ts` from the prototype – _Req 3.1_

- [x] 3. Firebase and auth
  - [x] 3.1 `src/lib/firebase.ts` with React Native auth persistence – _Req 1.6_
  - [x] 3.2 `src/lib/auth.ts` – Google and Apple sign-in, sign-out – _Req 1.2, 1.3, 1.7_
  - [x] 3.3 `app/_layout.tsx` auth gate and `app/sign-in.tsx` – _Req 1.1, 1.4_
  - [x] 3.4 Create `users/{uid}` on first sign-in and route to the city picker – _Req 1.5_

- [x] 4. Security rules
  - [x] 4.1 `firestore.rules` and `storage.rules` – _Req 4.8, 7.3_
  - [ ] 4.2 Rules unit tests with `@firebase/rules-unit-testing` – _Req 4.8_

- [x] 5. Cloud Functions
  - [x] 5.1 `verifyDropoff` (photo freshness, perceptual hash, geofence, seeds, weeks, member summary) – _Req 4.4–4.7, 5.1, 5.4_
  - [x] 5.2 `onCheerCreated` / `onCheerDeleted` counters – _Req 7.3_
  - [x] 5.3 `weeklyUpkeep` scheduled function (freezes, travel pauses) – _Req 5.3, 5.5_
  - [ ] 5.4 `retryPending` for drop-offs stuck in `pending` – _Design: error handling_
  - [ ] 5.5 Emulator tests with fixture photos (fresh, old EXIF, duplicate) – _Req 4.5, 4.6_
  - [ ] 5.6 Script to generate `functions/src/regions.json` from `src/data/regions.ts`

- [x] 6. Mascots
  - [x] 6.1 `components/Mascot.tsx` – Peel with 5 ripeness states, Bram, Cora – _Req 2, 6_
  - [x] 6.2 Greeting overlay with rotation stored in AsyncStorage and reduced-motion support – _Req 2.1–2.4_

- [ ] 7. Home screen (`app/(tabs)/index.tsx`) – started
  - [x] 7.1 Greeting, streak card with `WeekStrip`, Peel, log button – _Req 5.6, 6.1_
  - [ ] 7.2 Travel notice, freeze-used notice, usual site card, community preview – _Req 3.2, 5.5_

- [ ] 8. Log flow (`app/log.tsx`) – started
  - [x] 8.1 Site picker, camera capture, one-shot location, careful checkbox, submit – _Req 4.1–4.3_
  - [ ] 8.2 Listen for the verified result and show seeds, proof level, badges and revived Peel – _Req 4.7, 6.2_
  - [x] 8.3 Offline: show "Saved. We'll verify it when you're back online." – _Design_

- [x] 9. Map tab
  - [x] 9.1 Markers, selected site card, directions link – _Req 3.5_
  - [x] 9.2 Long-press to suggest a bin → `siteRequests` – _Req 8.1_

- [x] 10. Check tab – verdict UI over `verdict.ts` – _Req 3.3, 3.4_
- [ ] 11. Community tab – started (composer, feed, city filter, cheers done)
  - [ ] 11.1 Consistency board from `members`, ordered by streak then proofShare – _Req 7.4_
  - [ ] 11.2 Attach latest proof photo; report and hide – _Req 7.1, 7.6_
- [ ] 12. You tab – started (cities, travel mode, freezes, 16-week strip, sign out done)
  - [ ] 12.1 History list with proof badges and thumbnails, badges grid – _Req 4_
- [ ] 13. Host-a-bin form (You tab → "Offer a space") – _Req 8.2_
- [ ] 14. Recap stories with share-as-image (`react-native-view-shot` + `expo-sharing`) – _Req 9_
- [ ] 15. Accessibility pass – labels, dynamic type, contrast in dark mode – _All_
- [ ] 16. EAS build profiles and store listings (privacy labels: location at check-in only, photos user-initiated) – _All_
