/**
 * Trusted logic for GroundLoop. Clients submit evidence; these functions decide
 * the proof level, seeds, streak weeks and the public member summary.
 */
process.env.TZ = 'UTC';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import { onDocumentCreated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import sharp from 'sharp';
import exifr from 'exifr';
import regions from './regions.json';
import { weekKey, streakInfo, freezesAfter } from './streak';

initializeApp();
const db = getFirestore();

type Proof = 'self' | 'photo' | 'verified';
const SEEDS: Record<Proof, number> = { self: 5, photo: 10, verified: 15 };
const GEOFENCE_M = 75;
const MAX_ACCURACY_M = 50;
const FRESH_MS = 15 * 60 * 1000;
const DUP_BITS = 4;
const MAX_PER_DAY = 3;

type RegionMap = Record<string, { kind: string; sites: { id: string; lat: number; lng: number }[] }>;
const REGIONS = regions as RegionMap;

function distanceM(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6_371_000, r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Wall-clock time in `tz`, expressed as if it were UTC. EXIF capture times are wall-clock too. */
function wallMs(ms: number, tz: string): number {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year!, +p.month! - 1, +p.day!, +p.hour!, +p.minute!, +p.second!);
}
/** A Date whose local (UTC) calendar day equals the user's calendar day, for weekKey(). */
const userDay = (ms: number, tz: string) => new Date(wallMs(ms, tz));

async function averageHash(buf: Buffer): Promise<string> {
  const px = await sharp(buf).rotate().greyscale().resize(8, 8, { fit: 'fill' }).raw().toBuffer();
  const vals = Array.from(px.subarray(0, 64));
  const avg = vals.reduce((a, b) => a + b, 0) / 64;
  return vals.map((v) => (v > avg ? '1' : '0')).join('');
}
const hamming = (a: string, b: string) => { let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d; };

export const verifyDropoff = onDocumentCreated({ document: 'users/{uid}/dropoffs/{id}', memory: '512MiB' }, async (event) => {
  const snap = event.data;
  if (!snap) return;
  const uid = event.params.uid;
  const d = snap.data() as {
    createdAt: number; region: string; siteId?: string; geo?: { lat: number; lng: number; accuracy: number };
    photoPath?: string; careful: boolean; tz?: string;
  };
  const tz = d.tz || 'UTC';
  const userRef = db.doc(`users/${uid}`);
  const user = (await userRef.get()).data() ?? {};

  // Rate limit: at most MAX_PER_DAY counted drop-offs per calendar day.
  const dayStart = d.createdAt - (wallMs(d.createdAt, tz) % 86_400_000);
  const today = await userRef.collection('dropoffs').where('createdAt', '>=', dayStart).where('status', '==', 'verified').count().get();
  if (today.data().count >= MAX_PER_DAY) {
    await snap.ref.update({ status: 'verified', proofLevel: 'self', seedsAwarded: 0, checks: { rateLimited: true } });
    return;
  }

  // Photo: fresh (EXIF capture within 15 min) and not a near-duplicate of earlier proof.
  let fresh = false, duplicate = false, hash: string | null = null;
  if (d.photoPath && d.photoPath.startsWith(`proofs/${uid}/`)) {
    try {
      const [buf] = await getStorage().bucket().file(d.photoPath).download();
      const exif = await exifr.parse(buf, ['DateTimeOriginal']).catch(() => null);
      const taken: Date | undefined = exif?.DateTimeOriginal;
      fresh = !!taken && Math.abs(taken.getTime() - wallMs(d.createdAt, tz)) <= FRESH_MS;
      hash = await averageHash(buf);
      const previous: string[] = user.photoHashes ?? [];
      duplicate = previous.some((h) => hamming(h, hash!) <= DUP_BITS);
    } catch (e) {
      logger.warn('photo check failed', { uid, err: String(e) });
    }
  }

  // Location: within the geofence of the chosen site, or of home for curbside/station cities.
  let distance: number | null = null;
  const region = REGIONS[d.region];
  const target = d.siteId ? region?.sites.find((s) => s.id === d.siteId) : (user.homeGeo as { lat: number; lng: number } | undefined);
  if (d.geo && target) distance = distanceM(d.geo, target);
  const located = distance !== null && d.geo!.accuracy <= MAX_ACCURACY_M && distance <= GEOFENCE_M;

  const photoOk = fresh && !duplicate;
  const proof: Proof = photoOk ? (located ? 'verified' : 'photo') : 'self';
  const seeds = SEEDS[proof] + (d.careful ? 5 : 0);
  const wk = weekKey(userDay(d.createdAt, tz));

  await db.runTransaction(async (tx) => {
    const u = (await tx.get(userRef)).data() ?? {};
    const weeks: string[] = Array.from(new Set([...(u.weeks ?? []), wk]));
    const paused: string[] = (u.paused ?? []).filter((k: string) => k !== wk);
    const now = userDay(d.createdAt, tz);
    const before = streakInfo(u.weeks ?? [], u.paused ?? [], now).count;
    const after = streakInfo(weeks, paused, now).count;
    const freezes = freezesAfter(before, after, u.freezes ?? 1);
    const counts = { self: 0, photo: 0, verified: 0, ...(u.proofCounts ?? {}) } as Record<Proof, number>;
    counts[proof] += 1;
    const hashes: string[] = hash && !duplicate ? [...(u.photoHashes ?? []), hash].slice(-100) : (u.photoHashes ?? []);
    tx.update(userRef, {
      weeks, paused, freezes, photoHashes: hashes, proofCounts: counts,
      seeds: FieldValue.increment(seeds),
      best: Math.max(u.best ?? 0, after),
      lastDropAt: d.createdAt,
    });
    tx.update(snap.ref, { status: 'verified', proofLevel: proof, seedsAwarded: seeds, checks: { fresh, duplicate, distanceM: distance, located } });
    tx.set(db.doc(`members/${uid}`), await memberSummary(uid, { ...u, weeks, paused, best: Math.max(u.best ?? 0, after), proofCounts: counts }, now), { merge: false });
  });
});

async function memberSummary(uid: string, u: FirebaseFirestore.DocumentData, now: Date) {
  const st = streakInfo(u.weeks ?? [], u.paused ?? [], now);
  const pc = u.proofCounts ?? { self: 0, photo: 0, verified: 0 };
  const total = pc.self + pc.photo + pc.verified;
  let photoURL: string | null = null;
  try { photoURL = (await getAuth().getUser(uid)).photoURL ?? null; } catch { /* deleted user */ }
  return {
    displayName: (u.displayName as string | undefined)?.split(' ')[0] ?? '',
    photoURL,
    region: u.currentRegion ?? null,
    streak: st.count,
    best: u.best ?? st.count,
    proofCounts: pc,
    proofShare: total ? Math.round(((pc.verified + pc.photo * 0.5) / total) * 100) : 0,
    updatedAt: Date.now(),
  };
}

export const onCheerCreated = onDocumentCreated('posts/{postId}/cheers/{uid}', async (e) => {
  await db.doc(`posts/${e.params.postId}`).update({ cheerCount: FieldValue.increment(1) });
});
export const onCheerDeleted = onDocumentDeleted('posts/{postId}/cheers/{uid}', async (e) => {
  await db.doc(`posts/${e.params.postId}`).update({ cheerCount: FieldValue.increment(-1) });
});

/** Mondays: pause last week for travellers; spend a freeze for anyone who missed it after a done week. */
export const weeklyUpkeep = onSchedule({ schedule: 'every monday 03:00', timeZone: 'UTC' }, async () => {
  let last: FirebaseFirestore.QueryDocumentSnapshot | undefined;
  for (;;) {
    let q = db.collection('users').orderBy('__name__').limit(300);
    if (last) q = q.startAfter(last);
    const page = await q.get();
    if (page.empty) break;
    const batch = db.batch();
    for (const doc of page.docs) {
      const u = doc.data();
      const tz = u.tz || 'UTC';
      const now = userDay(Date.now(), tz);
      const lastWk = weekKey(new Date(now.getTime() - 7 * 86_400_000));
      const prevWk = weekKey(new Date(now.getTime() - 14 * 86_400_000));
      const weeks: string[] = u.weeks ?? [];
      const paused: string[] = u.paused ?? [];
      if (weeks.includes(lastWk) || paused.includes(lastWk)) continue;
      if (u.travel) {
        batch.update(doc.ref, { paused: FieldValue.arrayUnion(lastWk) });
      } else if ((u.freezes ?? 0) > 0 && (weeks.includes(prevWk) || paused.includes(prevWk))) {
        batch.update(doc.ref, { paused: FieldValue.arrayUnion(lastWk), freezes: FieldValue.increment(-1), freezeUsedAt: Date.now() });
      }
    }
    await batch.commit();
    last = page.docs[page.docs.length - 1];
  }
});
