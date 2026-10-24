import { doc, getDoc, getDocs, setDoc, updateDoc, addDoc, collection, onSnapshot, query, orderBy, limit, where, serverTimestamp, type Unsubscribe } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { coarse } from './geo';

export interface Profile {
  displayName: string;
  /** Unset until the user picks their home city on first sign-in. */
  homeRegion?: string;
  /** Unset until the user picks their home city on first sign-in. */
  currentRegion?: string;
  travel: boolean;
  usualSite?: { region: string; siteId: string };
  tz?: string;
  // written by Cloud Functions only
  seeds?: number;
  weeks?: string[];
  paused?: string[];
  freezes?: number;
  best?: number;
  lastDropAt?: number;
  proofCounts?: { self: number; photo: number; verified: number };
}

export type ProofLevel = 'self' | 'photo' | 'verified' | 'partner';

/**
 * Creates `users/{uid}` on first sign-in with neutral defaults (Req 1.5).
 * The home city is deliberately left unset here — the user is asked for it in
 * the city picker — so we never silently assign a city they don't live in.
 * Returns whether the doc was just created and whether a home city is still needed.
 */
export async function ensureProfile(uid: string, displayName: string): Promise<{ created: boolean; needsHomeRegion: boolean }> {
  const r = doc(db, 'users', uid);
  const snap = await getDoc(r);
  if (snap.exists()) {
    const data = snap.data() as Partial<Profile>;
    return { created: false, needsHomeRegion: !data.homeRegion };
  }
  await setDoc(r, {
    displayName,
    travel: false,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    createdAt: serverTimestamp(),
  });
  return { created: true, needsHomeRegion: true };
}

export function watchProfile(uid: string, cb: (p: Profile | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (s) => cb(s.exists() ? (s.data() as Profile) : null));
}

export const updateProfile = (uid: string, patch: Partial<Pick<Profile, 'homeRegion' | 'currentRegion' | 'travel' | 'usualSite' | 'displayName'>>) =>
  updateDoc(doc(db, 'users', uid), patch);

export interface NewDropoff {
  region: string;
  siteId?: string;
  siteLabel: string;
  geo?: { lat: number; lng: number; accuracy: number };
  photoUri?: string;
  careful: boolean;
}

/** Creates a pending drop-off; Cloud Function `verifyDropoff` assigns the proof level. */
export async function submitDropoff(uid: string, d: NewDropoff): Promise<string> {
  const ref0 = doc(collection(db, 'users', uid, 'dropoffs'));
  let photoPath: string | undefined;
  if (d.photoUri) {
    photoPath = `proofs/${uid}/${ref0.id}.jpg`;
    const blob = await (await fetch(d.photoUri)).blob();
    await uploadBytes(ref(storage, photoPath), blob, { contentType: 'image/jpeg' });
  }
  await setDoc(ref0, {
    createdAt: Date.now(),
    region: d.region,
    siteLabel: d.siteLabel,
    careful: d.careful,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    status: 'pending',
    ...(d.siteId ? { siteId: d.siteId } : {}),
    ...(d.geo ? { geo: d.geo } : {}),
    ...(photoPath ? { photoPath } : {}),
  });
  return ref0.id;
}

export function watchDropoff(uid: string, id: string, cb: (d: Record<string, unknown>) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid, 'dropoffs', id), (s) => s.exists() && cb(s.data()));
}

export function watchFeed(region: string | null, cb: (posts: Array<Record<string, unknown> & { id: string }>) => void): Unsubscribe {
  const base = collection(db, 'posts');
  const q = region ? query(base, where('region', '==', region), orderBy('createdAt', 'desc'), limit(50)) : query(base, orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export const createPost = (uid: string, kind: string, text: string, region: string, photoPath?: string) =>
  addDoc(collection(db, 'posts'), { uid, kind, text: text.slice(0, 280), region, createdAt: Date.now(), ...(photoPath ? { photoPath } : {}) });

/**
 * The storage path of the user's most recent proof photo, if any — so a post
 * can optionally attach it (Req 7.1). Returns null when the user has no photo
 * drop-off yet.
 */
export async function latestProofPhotoPath(uid: string): Promise<string | null> {
  const q = query(collection(db, 'users', uid, 'dropoffs'), orderBy('createdAt', 'desc'), limit(20));
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    const path = (d.data() as { photoPath?: string }).photoPath;
    if (path) return path;
  }
  return null;
}

/** A download URL for a stored proof photo (cached by Storage). */
export const proofPhotoUrl = (photoPath: string) => getDownloadURL(ref(storage, photoPath));

/**
 * Reports a post (Req 7.6): adds it to the moderation queue. The caller also
 * hides it locally for this user — reporting and hiding go together.
 */
export const reportPost = (uid: string, postId: string, reason: string) =>
  addDoc(collection(db, 'reports'), { uid, postId, reason, createdAt: Date.now() });

export const cheer = (postId: string, uid: string) => setDoc(doc(db, 'posts', postId, 'cheers', uid), { createdAt: Date.now() });

/** Public member summary, written by Cloud Functions only (see design: members/{uid}). */
export interface Member {
  id: string;
  displayName: string;
  photoURL?: string | null;
  region?: string | null;
  streak: number;
  best?: number;
  proofCounts?: { self: number; photo: number; verified: number };
  /** Share of drop-offs carrying photo proof, 0–100 (never a waste quantity, Req 7.4). */
  proofShare: number;
}

/**
 * The "Most consistent" board (Req 7.4): members ranked by current streak, then
 * by share of drop-offs with photo proof. Deliberately never ordered by any
 * measure of waste quantity. `region` filters to a single city's board.
 */
export function watchBoard(region: string | null, cb: (members: Member[]) => void): Unsubscribe {
  const base = collection(db, 'members');
  const q = region
    ? query(base, where('region', '==', region), orderBy('streak', 'desc'), orderBy('proofShare', 'desc'), limit(50))
    : query(base, orderBy('streak', 'desc'), orderBy('proofShare', 'desc'), limit(50));
  return onSnapshot(q, (s) => cb(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Member, 'id'>) }))));
}

export const suggestSite = (uid: string, region: string, lat: number, lng: number, note = '') =>
  addDoc(collection(db, 'siteRequests'), { uid, region, lat: coarse(lat), lng: coarse(lng), note: note.slice(0, 120), createdAt: Date.now() });

export const offerHost = (uid: string, region: string, name: string, type: string, address: string) =>
  addDoc(collection(db, 'hostOffers'), { uid, region, name, type, address, status: 'Under review', createdAt: Date.now() });
