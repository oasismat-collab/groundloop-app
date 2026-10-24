---
inclusion: always
---

# GroundLoop – tech stack

## Budget: $0

Everything in the current build must run on free tools. No feature may require a paid plan, a credit card, an Apple Developer account or a Google Play account. Allowed: Expo Go, Expo web export, GitHub Pages, the Firebase free (Spark) plan, Firebase emulators and public datasets. Anything that needs the Firebase Blaze plan (notably Cloud Functions) is deferred to "production, later" and must be reproducible with emulators or client-side logic for now.

## Browser demo (what judges open)

- The judge-facing demo is a **single, self-contained static file** at `docs/prototype/index.html`, published with **GitHub Pages**.
- It runs in **sample mode**: hard-coded sample data, **no login**, no network calls, no Firebase. Open the URL and everything works.
- Maps use **Leaflet + OpenStreetMap tiles** (free, no API key) — not `react-native-maps`, not Google Maps.
- It reflects the real app by **reusing the pure logic and data** from `src/lib` and `src/data` (`verdict.ts`, `items.ts`, `streak.ts` incl. `ripeness`, `geo.ts`, `badges.ts`, `regions.ts`). Port or inline, don't reinvent; the demo's answers must match the app's.
- All user-facing strings go through a small **i18n dictionary** (see Internationalisation below). No hard-coded display strings in markup.
- We do **not** take the `react-native-web` route for the demo.

## Internationalisation

- All new user-facing text goes through a simple **i18n dictionary**: a `{ locale: { key: string } }` map with a `t(key)` lookup and a graceful fallback to English.
- Launch locales: English (`en`), Spanish (`es`), Portuguese (`pt`), Haitian Creole (`ht`), Chinese (`zh`), Vietnamese (`vi`).
- Data-driven strings sourced from official programmes (city rules, item reasons in `src/data`) may stay in their source language; chrome, labels and instructions must be translatable.

## Production backend (later, needs Blaze)

The sections below describe the full production stack. Cloud Functions require the Firebase Blaze plan, so they are **out of scope for the $0 demo** and stand in via emulators or sample data until there's a budget.

## Mobile app
- **Expo (React Native) + TypeScript**, file-based routing with **expo-router**.
- Requires an **Expo development build** (not Expo Go) because Google Sign-In uses native code. Build with **EAS Build**.
- UI: React Native core components + **react-native-svg** for mascots and charts. No UI kit; follow `src/theme.ts` tokens.
- Maps: **react-native-maps**.
- Camera: **expo-image-picker** (`launchCameraAsync`, with EXIF). Location: **expo-location** (foreground, one-shot at check-in only).

## Auth
- **Firebase Authentication** with two providers:
  - Google: `@react-native-google-signin/google-signin` → `GoogleAuthProvider.credential(idToken)` → `signInWithCredential`.
  - Apple: `expo-apple-authentication` with a SHA-256 hashed nonce (`expo-crypto`) → `OAuthProvider('apple.com').credential({ idToken, rawNonce })`.
- Apple sign-in is mandatory on iOS whenever another social login is offered (App Store guideline 4.8).
- Session persists with `initializeAuth(..., { persistence: getReactNativePersistence(AsyncStorage) })`.

## Backend
- **Cloud Firestore** for data, **Cloud Storage** for proof photos, **Cloud Functions (2nd gen, Node 20, TypeScript)** for anything that must be trusted:
  - `verifyDropoff`: assigns the proof level, seeds and streak weeks.
  - `onPostCheer`: keeps cheer counts.
  - `refreshMember`: rebuilds the public member summary.
- Security rules live in `firestore.rules` and `storage.rules`. Clients can never write `proofLevel`, `seeds`, `weeks`, `streak` or `members/*`.

## Conventions
- Strict TypeScript. No `any` in new code.
- Pure logic (streaks, geo, sorting verdicts) lives in `src/lib` with unit tests in `__tests__`. Run `npm test`.
- Secrets and IDs go in `.env` (see `.env.example`) and are read through `app.config.ts`. Never commit `.env`, `google-services.json` or `GoogleService-Info.plist`.
- Use `npx expo install <pkg>` so native module versions match the Expo SDK.

## Commands
- `npm start` – Metro bundler for a dev build
- `npm run ios` / `npm run android` – local native builds
- `npm test` – unit tests
- `npm run typecheck` – `tsc --noEmit`
- `npm run deploy:backend` – deploy rules, indexes and functions
