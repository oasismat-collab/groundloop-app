---
inclusion: always
---

# GroundLoop – tech stack

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
