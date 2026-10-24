# Requirements – GroundLoop MVP (mobile app)

## Introduction

GroundLoop is a mobile app that helps residents sort food scraps correctly for their city, find where to compost, keep a weekly composting streak that follows them across countries, prove their drop-offs, and share progress with a community. This spec covers the resident app and the trusted backend. The partner dashboard is a separate spec (`partner-dashboard`).

## Requirements

### Requirement 1 – Sign in with Google or Apple

**User story:** As a resident, I want to sign in with my Google or Apple account so that my streak, history and badges are saved and available on any phone.

#### Acceptance criteria
1. WHEN a signed-out user opens the app THEN the system SHALL show the sign-in screen with "Continue with Google" and "Continue with Apple".
2. WHEN the user completes Google sign-in THEN the system SHALL create or restore a Firebase Auth session using the Google ID token.
3. WHEN the user completes Apple sign-in THEN the system SHALL create or restore a Firebase Auth session using the Apple identity token and a SHA-256 hashed nonce.
4. WHILE running on iOS the system SHALL offer Apple sign-in whenever Google sign-in is offered.
5. WHEN a user signs in for the first time THEN the system SHALL create `users/{uid}` with default values and ask for their home city.
6. WHEN the app restarts THEN the system SHALL restore the session without asking the user to sign in again.
7. WHEN the user signs out THEN the system SHALL clear the session and return to the sign-in screen.

### Requirement 2 – Rotating mascot greeting

**User story:** As a resident, I want a friendly greeting when I sign in so that opening the app feels personal.

#### Acceptance criteria
1. WHEN a signed-in user opens the app THEN the system SHALL show "Hi, {first name}!" with one mascot for up to 2 seconds, dismissible by tap.
2. The system SHALL rotate the greeting mascot in the order Peel (banana) → Bram (broccoli) → Cora (carrot) on each new session.
3. The app header SHALL show the current session's mascot as the logo mark.
4. WHERE the user has enabled reduced motion the system SHALL show the greeting without animation.

### Requirement 3 – Cities and local rules

**User story:** As a resident or traveller, I want the app to use the local food-waste programme wherever I am so that I sort correctly and know where to go.

#### Acceptance criteria
1. The system SHALL support each city listed in `src/data/regions.ts`, each with a programme name, how it works, who processes the waste, a tip and an official source link.
2. WHEN the user chooses a current city different from their home city THEN the system SHALL show a "You're in {city}. Your streak travels with you." notice.
3. WHEN the user looks up an item THEN the system SHALL answer Yes / No / Share it / It depends using that city's rules.
4. IF a city's rules are marked `basic` and the item is not a core item THEN the system SHALL say the rule isn't verified and link the official guide instead of answering.
5. WHEN a city uses drop-off bins THEN the Map tab SHALL show its sites and offer directions in the device's maps app.

### Requirement 4 – Log a drop-off with proof

**User story:** As a resident, I want to log each time I compost, with proof, so that my streak is credible.

#### Acceptance criteria
1. WHEN the user taps the log button in a drop-off city THEN the system SHALL ask which site they used, listing their usual site first.
2. WHEN the user adds a photo THEN the system SHALL open the camera (not the gallery) and upload the image to `proofs/{uid}/{dropoffId}.jpg`.
3. WHEN the user allows location THEN the system SHALL read one foreground location fix with its accuracy at the moment of logging, and SHALL NOT track location in the background.
4. WHEN a drop-off is submitted THEN the backend SHALL assign exactly one proof level:
   - `verified` IF a fresh, non-duplicate photo exists AND the location is within 75 m of the chosen site (or of the user's registered home for curbside cities) with accuracy ≤ 50 m;
   - `photo` IF a fresh, non-duplicate photo exists but location is missing or fails;
   - `self` otherwise.
5. A photo SHALL count as fresh only IF its EXIF capture time is within 15 minutes of submission.
6. A photo SHALL count as a duplicate IF its 64-bit average hash is within Hamming distance 4 of any of the user's previous 100 proof photos.
7. The backend SHALL award seeds of 5 / 10 / 15 for self / photo / verified, plus 5 for confirming careful sorting.
8. The client SHALL NOT be able to write `proofLevel`, `seeds`, `weeks` or `streak`.

### Requirement 5 – Weekly streak with travel mode and freezes

**User story:** As a resident, I want a weekly streak that survives travel so that I stay motivated without pointless trips.

#### Acceptance criteria
1. The system SHALL count a week (ISO 8601, Monday–Sunday in the user's time zone) as done WHEN it has at least one drop-off of any proof level.
2. The streak SHALL be the number of consecutive done weeks ending with the current week (if done) or the previous week.
3. WHILE travel mode is on, weeks without drop-offs SHALL be paused: they neither count nor break the streak.
4. WHEN the streak reaches a multiple of 4 THEN the system SHALL grant one streak freeze, up to a maximum of 2.
5. IF a week is missed AND the user has a freeze THEN the backend SHALL spend the freeze to pause that week automatically and tell the user.
6. WHEN 4 or fewer days remain in the week and it isn't done THEN the system SHALL show "Compost by Sunday to keep your N-week streak".

### Requirement 6 – Peel the banana

**User story:** As a resident, I want a mascot that reflects how recently I composted so that I get a gentle nudge.

#### Acceptance criteria
1. The system SHALL show Peel as Fresh (0–3 days since last drop-off), Ripe (4–7), Spotty (8–13), Browning (14–20) or Rotten (21+).
2. WHEN the user logs a drop-off THEN Peel SHALL become Fresh immediately with a short revive animation.

### Requirement 7 – Community

**User story:** As a resident, I want to share reflections and see others' consistency so that composting feels social.

#### Acceptance criteria
1. WHEN the user posts THEN the system SHALL save a Reflection, Tip, Question or Milestone of at most 280 characters, optionally attaching their latest proof photo.
2. The feed SHALL be filterable by Everyone and by the user's current city.
3. WHEN the user cheers a post THEN the system SHALL record one cheer per user per post, and SHALL NOT allow cheering their own posts.
4. The "Most consistent" board SHALL rank members by current streak, then by share of drop-offs with photo proof, and SHALL NOT use any measure of waste quantity.
5. Posts and member summaries SHALL NOT include exact drop-off times or locations.
6. WHEN a user reports a post THEN the system SHALL hide it for that user and add it to a moderation queue.

### Requirement 8 – Suggest a bin and offer to host

**User story:** As a resident or local business, I want to say where a new bin would help so that coverage grows where people need it.

#### Acceptance criteria
1. WHEN the user taps "Suggest a bin closer to you" and picks a point on the map THEN the system SHALL save a site request with the city, coordinates (rounded to 4 decimal places) and an optional note.
2. WHEN a business submits "Host a bin" THEN the system SHALL save the organisation name, type, address and city with status "Under review".

### Requirement 9 – Season recap

**User story:** As a resident, I want a story-style recap of my season so that I can see and share my impact.

#### Acceptance criteria
1. The recap SHALL include drop-off count, estimated kg (drop-offs × the programme's measured average kg per drop-off, labelled as an estimate), share with photo proof, longest streak, most-checked items, cities composted in, the local processor and a personality.
2. The final card SHALL be shareable as an image through the system share sheet.
