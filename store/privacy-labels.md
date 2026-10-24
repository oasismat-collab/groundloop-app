# Privacy labels

What GroundLoop collects and why. These answers mirror the iOS privacy manifest
in `app.config.ts`. **We do not track users across apps or companies** and we do
not use data for advertising.

## Summary of data the app handles
| Data | Collected | Why | Linked to the user | Used for tracking |
|---|---|---|---|---|
| Precise location | Yes, only at check-in | Verify a drop-off is at the chosen site | Yes (to the account) | No |
| Photos (proof) | Yes, user-initiated | Proof of a drop-off | Yes | No |
| Name & email | Yes | Account via Google/Apple sign-in | Yes | No |
| User content (posts) | Yes | Community feed | Yes | No |

Location is read as a single foreground fix when the user logs a drop-off —
never in the background and never as a movement trail.

## Apple — App Store Connect → App Privacy
- **Tracking:** No (no `NSPrivacyTracking`; no tracking domains).
- **Location → Precise Location:** App Functionality. Linked to identity. Not used for tracking.
- **User Content → Photos or Videos:** App Functionality. Linked to identity. Not used for tracking.
- **Contact Info → Name, Email Address:** App Functionality (account). Linked. Not tracking.
- **User Content → Other (posts):** App Functionality. Linked. Not tracking.
- Required-reason APIs (in the manifest): UserDefaults `CA92.1`; File timestamp `C617.1`.

## Google Play — Data safety form
- **Location → Approximate/Precise location:** Collected, not shared. Purpose: App functionality. Processed only at check-in; not continuous.
- **Photos and videos:** Collected, not shared. Purpose: App functionality. User-initiated.
- **Personal info → Name, Email:** Collected, not shared. Purpose: Account management.
- **App activity → user-generated content:** Collected, not shared. Purpose: App functionality.
- Data is encrypted in transit. Users can request deletion of their account data.

## Keep in sync
If data use changes, update **all three**: this file, `ios.privacyManifests` in
`app.config.ts`, and the two store consoles.
