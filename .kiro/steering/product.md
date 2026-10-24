---
inclusion: always
---

# GroundLoop – product

GroundLoop helps people turn unavoidable food scraps into compost that reaches local soil, and makes that journey easy to join and possible to verify.

## Business model

- **Residents are free forever.** Every feature a resident sees — sorting rules, maps, streaks, proof, community, recaps — costs them nothing and always will. We never charge residents and never gate resident features behind a paywall.
- **Partners pay for insight, not people.** Cities, haulers and companies pay for **anonymized, aggregated** insights: where coverage is thin, where to add drop-off sites, participation trends, proof-quality mix. See the partner dashboard.
- **We never sell personal data.** We do not sell, rent or share personal data, names, photos, exact locations or individual histories with partners or anyone else. Partners only ever see aggregates that pass the thresholds in `privacy.md`.
- **Only opted-in activity is ever counted.** A resident's activity contributes to partner aggregates only after they opt in (default off). Opting out removes them from every aggregate going forward.

This split is the whole model: the free resident experience creates the trusted, verified signal; partners pay for the aggregate view of that signal. If a decision would make residents pay, expose an individual, or sell personal data, it is wrong.

## Who it serves

| Person | Needs | GroundLoop gives them |
|---|---|---|
| Resident, student, kitchen worker | A quick sorting answer and a convenient place to drop scraps | City-specific sorting rules, nearby drop-off sites, a weekly streak |
| Building or campus coordinator | Participation without admin work | Bin issue reports, collection requests, recurring sorting problems |
| Hauler or compost operator | Clean material and predictable volumes | Verified drop-off counts, contamination signals, batch records |
| City or programme manager | Evidence of where to add capacity | Coverage map, resident site requests, host-a-bin offers |
| Community gardener | Suitable finished compost | Availability, quality notes, application records |

## Principles (do not break these)

1. **Reward consistency and correct sorting, never volume.** No feature may rank or reward people by how much food waste they produce.
2. **Weekly, not daily.** The streak counts weeks with at least one drop-off. Daily streaks push people to make pointless trips or fake activity.
3. **Your streak travels with you.** A streak belongs to the person, not the city. Moving or travelling changes the local rules and sites, not the streak.
4. **Proof has levels.** Self-reported < photo < photo + location < partner-verified. Show the level honestly everywhere it appears. Rewards with real-world value require location-verified proof or better.
5. **The server decides proof.** Clients submit evidence; Cloud Functions assign the proof level, seeds and streak. Clients can never write those fields.
6. **Privacy first.** Never publish exact drop-off times, a person's home location, or a trail of where they go. Location is read only at check-in, never tracked in the background.
7. **Programme facts come from official sources.** Each city entry links its source. If we haven't verified a rule for a city, say so and link the official guide instead of guessing.
8. **The mascot is a mood, not a guilt trip.** Peel the banana gets spotty, then brown, then rotten as days pass without composting, and is instantly fresh again after a drop-off. Bram (broccoli) and Cora (carrot) rotate as the greeting mascot on each sign-in.

## Voice

Plain, warm and direct. Short sentences. Name things the way residents would ("drop-off", "food waste"), not the way the system is built.
