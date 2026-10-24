# Requirements – Partner dashboard (web)

## Introduction

A web dashboard for cities, haulers, property managers and community gardens. It turns resident site requests, host offers and proof data into decisions about where to add drop-off capacity. Build it as a separate Next.js app in `/dashboard` that reads the same Firebase project with partner accounts (custom claim `role: 'partner'` plus a `regions` claim).

## Requirements

### Requirement 1 – Partner access
1. WHEN a user without the `partner` claim opens the dashboard THEN the system SHALL deny access.
2. A partner SHALL only see data for the regions in their `regions` claim.

### Requirement 2 – Coverage map
1. The dashboard SHALL show each region's sites with an 800 m (about a 10-minute walk) coverage circle.
2. The dashboard SHALL show resident site requests as distinct markers.
3. The dashboard SHALL report the share of requests within 800 m of an existing site.

### Requirement 3 – Gap clusters
1. The system SHALL group requests within 600 m of each other into clusters.
2. A cluster more than 800 m from every site SHALL be listed as a gap, ordered by request count, showing the distance to the nearest site.
3. WHEN a partner selects "Find a host" for a gap THEN the system SHALL list host offers within 1 km and generate a shareable invitation for nearby businesses.

### Requirement 4 – Host offers
1. The dashboard SHALL list host offers with status Under review / Approved / Declined / Installed.
2. WHEN a partner changes a status THEN the system SHALL record who changed it and when, and notify the offering user.
3. WHEN an offer becomes Installed THEN the system SHALL add the site to the region's site list.

### Requirement 5 – Proof quality and batch checks
1. The dashboard SHALL show the region's proof mix (self / photo / verified).
2. WHEN a hauler records a batch weight for a site and period THEN the system SHALL compare it with drop-offs claimed there and flag the batch IF the implied kg per drop-off falls outside 1.5–9 kg.
3. Batch checks SHALL use aggregates only and SHALL NOT expose individual residents.

### Requirement 6 – Capacity signals
1. The system SHALL show bin-full and blocked reports per site per week.
2. IF a site has 3 or more full reports in a week THEN the system SHALL suggest more frequent pickup or a second bin.

### Requirement 7 – Coverage metric
1. The dashboard SHALL show, per region, the share of active members whose usual site is within 800 m of their home area, tracked weekly.
