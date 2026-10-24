# GroundLoop

**Follow your food scraps back to the soil.**

GroundLoop helps people sort food scraps correctly for their city, find where to compost, keep a weekly composting streak that follows them to any country, prove their drop-offs, and share progress with a community. Partner tools show cities and haulers where new drop-off sites are needed.

- 📱 **App:** Expo (React Native) + TypeScript, Google and Apple sign-in
- 🔥 **Backend:** Firebase Auth, Firestore, Storage, Cloud Functions
- 🧭 **Built with Kiro:** steering and specs in [`.kiro/`](.kiro)
- 🖥️ **Web prototype:** [`docs/prototype/index.html`](docs/prototype/index.html) (open in a browser; runs in sample mode)

## What's in the box

| Area | Status |
|---|---|
| Google + Apple sign-in, session persistence, auth gate | ✅ |
| Rotating greeting mascot (Peel 🍌 → Bram 🥦 → Cora 🥕) | ✅ greeting, ⏳ header logo |
| 13 cities in 5 countries with official sources | ✅ `src/data/regions.ts` |
| City-aware "Can it go in?" | ✅ |
| Drop-off logging with camera photo + one-shot location | ✅ |
| Server-side proof levels (EXIF freshness, perceptual-hash duplicates, 75 m geofence) | ✅ `functions/src/index.ts` |
| Weekly streak, travel mode, streak freezes | ✅ logic + function, ⏳ notices |
| Peel the banana rots as days pass | ✅ |
| Map with directions + "suggest a bin" | ✅ |
| Community feed, posting, cheers | ✅ basic, ⏳ board/report |
| Season recap, partner web dashboard | ⏳ specced in `.kiro/specs` |

Remaining work is listed task by task in [`.kiro/specs/groundloop-mvp/tasks.md`](.kiro/specs/groundloop-mvp/tasks.md).

## 1. Put it on GitHub

```bash
cd groundloop
git init
git add .
git commit -m "GroundLoop: initial app, backend and Kiro specs"
# with the GitHub CLI:
gh repo create groundloop --private --source=. --push
# or create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/groundloop.git
git branch -M main
git push -u origin main
```

`.gitignore` already keeps out `.env`, `google-services.json`, `GoogleService-Info.plist` and signing keys. CI (`.github/workflows/ci.yml`) typechecks and runs tests on every push.

## 2. Build it with Kiro

1. Open the `groundloop` folder in Kiro (or clone your GitHub repo from Kiro).
2. Kiro loads the **steering files** automatically:
   - `product.md`: who it's for and the non-negotiable principles (never reward waste volume, weekly streaks, the server decides proof, privacy).
   - `tech.md`: stack, auth flow, commands.
   - `structure.md`: where code goes.
3. Open the **Specs** panel and select **groundloop-mvp**. `requirements.md` (EARS format) and `design.md` are done. In `tasks.md`, start the first unchecked task (3.4) and work down the list.
4. For the partner dashboard, open **partner-dashboard**. Requirements are written; ask Kiro to generate the design and tasks from them.
5. Suggested agent hook: "On save of `src/lib/streak.ts`, copy it to `functions/src/streak.ts` and run `npm test`". Similarly, after editing `src/data/regions.ts`, run `npm run gen:regions` to rebuild `functions/src/regions.json` (the trusted copy the geofence check uses); `npm run gen:regions -- --check` fails if it's stale.

## 3. Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com). Upgrade to the **Blaze** plan (Cloud Functions need it; the free tier still applies).
2. **Build → Authentication → Sign-in method:** enable **Google** and **Apple**.
3. Create **Firestore** (production mode) and **Storage**.
4. **Project settings → Your apps:** add a Web app (for the config values), an iOS app (bundle ID = `IOS_BUNDLE_ID`) and an Android app (package = `ANDROID_PACKAGE`).
5. Download `GoogleService-Info.plist` and `google-services.json` into the repo root. They're git-ignored.
6. Copy `.env.example` to `.env` and fill in the values.

Deploy the rules, indexes and functions:

```bash
npm install -g firebase-tools eas-cli
firebase login
firebase use --add            # pick your project
(cd functions && npm install)
npm run deploy:backend
```

## 4. Google sign-in

- `GOOGLE_WEB_CLIENT_ID`: Firebase → Authentication → Google provider → **Web SDK configuration → Web client ID**. Firebase needs this to accept the ID token.
- `GOOGLE_IOS_CLIENT_ID` and `GOOGLE_IOS_URL_SCHEME`: from `GoogleService-Info.plist` (`CLIENT_ID`, `REVERSED_CLIENT_ID`).
- Android: add the **SHA-1** of your signing key to the Firebase Android app (`eas credentials` shows it), then download `google-services.json` again.

## 5. Apple sign-in

1. Apple Developer account → **Identifiers** → your bundle ID → enable **Sign in with Apple**.
2. Native iOS sign-in needs nothing else in Firebase beyond enabling the Apple provider.
3. For Android or web Apple sign-in later, create a Services ID and key, and add them to the Firebase Apple provider.
4. App Store rule: if you offer Google sign-in on iOS, you must also offer Apple. The app does this.

## 6. Run the app

Google Sign-In uses native code, so use an **Expo development build**, not Expo Go:

```bash
npm install
npx expo install --fix          # align native module versions with the Expo SDK
eas build --profile development --platform ios      # or android
npm start                        # then open the dev build on your phone
```

Tests and typecheck:

```bash
npm test             # unit tests (streak, geo, verdict)
npm run typecheck
npm run test:rules   # Firestore + Storage security-rules tests (starts the emulators; needs Java)
```

`npm run test:rules` runs `@firebase/rules-unit-testing` against the Firestore
and Storage emulators via `firebase emulators:exec` (config in
`firebase.test.json`, jest config in `jest.rules.config.js`). It needs a JDK on
the path. `npm test` deliberately excludes these so the fast unit suite stays
emulator-free.

## How proof works

| Level | Needs | Seeds |
|---|---|---|
| Self-reported | Nothing | 5 |
| Photo | Camera photo taken within 15 minutes, not a near-duplicate of your last 100 | 10 |
| Photo + location | The above, plus a GPS fix within 75 m of the site with ≤ 50 m accuracy | 15 |
| Partner-verified *(planned)* | Smart-lock open or RFID cart scan reported by the hauler | — |

Plus 5 seeds for confirming careful sorting. The client can't write proof levels, seeds or streak weeks. `verifyDropoff` sets them, and Firestore rules block everything else.

## Data model

See [`.kiro/specs/groundloop-mvp/design.md`](.kiro/specs/groundloop-mvp/design.md). In short: `users/{uid}` (private), `users/{uid}/dropoffs/{id}`, `members/{uid}` (public summary, functions-only), `posts`, `siteRequests`, `hostOffers`.

## City programme sources

Boston [Project Oscar](https://www.boston.gov/departments/public-works/project-oscar) · Cambridge [compost drop-off](https://cambridgema.gov/Services/curbsidecomposting/compostdropoff) · Brookline [Food Waste Drop-Off](https://www.brooklinema.gov/FoodWasteDropOff) · Newton [Composting](https://www.newtonma.gov/government/public-works/sustainable-materials-management/composting) · Somerville [food waste pilot](https://somervillema.gov/foodwaste) · Worcester [composting](https://www.worcesterma.gov/node/23629) · London Camden [food waste](https://www.camden.gov.uk/food) · London Wandsworth [Simpler Recycling](https://wandsworth.gov.uk/rubbish-and-recycling/simpler-recycling-legislation/simpler_recycling_household_collections) · Nagai [Rainbow Plan (MLIT)](https://www.mlit.go.jp/kokudokeikaku/iten/service/kankyo/pdf/nagaisi.pdf) · Ōki [Kururun (CLAIR)](https://www.clair.or.jp/e/bestpractice/docs/2018oki_e_s.pdf) · Inagi [home composter subsidy](https://www.city.inagi.tokyo.jp/en/kurashi/gomi/1005149/1005156.html) · Seoul [fee-based system (ADB)](https://development.asia/explainer/using-fee-based-system-reduce-waste) · Toronto [Green Bin](https://www.toronto.ca/services-payments/recycling-organics-garbage/houses/what-goes-in-my-green-bin/)

Programmes change. Re-check sources before launch, and keep site coordinates approximate on maps.

## License

MIT
