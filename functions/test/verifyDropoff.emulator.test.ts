/**
 * Emulator integration tests for verifyDropoff (task 5.5).
 *
 * Runs under `npm run test:emulator`, which wraps jest in
 * `firebase emulators:exec --only functions,firestore,storage,auth`. The
 * Functions emulator loads the compiled trigger from `lib/`; this test process
 * drives it through the admin SDK (auto-connected to the emulators via the
 * env vars emulators:exec sets).
 *
 * Fixture photos (built in fixtures.ts) exercise the branches the design calls
 * out: a fresh photo, a stale-EXIF photo, and a duplicate of an earlier photo.
 */
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { makeJpeg } from './fixtures';

const PROJECT_ID = process.env.GCLOUD_PROJECT || 'demo-groundloop-fns';
const BUCKET = `${PROJECT_ID}.appspot.com`;

// boston-7 from functions/src/regions.json — matches the drop site we log against.
const SITE = { id: 'boston-7', lat: 42.3603, lng: -71.058 };

let app: App;
let db: Firestore;

async function uploadProof(path: string, buf: Buffer): Promise<void> {
  await getStorage().bucket(BUCKET).file(path).save(buf, { contentType: 'image/jpeg' });
}

/** Wait until the drop-off is finalised (status === 'verified'), then return it. */
async function waitForVerdict(uid: string, id: string, timeoutMs = 15000): Promise<FirebaseFirestore.DocumentData> {
  const ref = db.doc(`users/${uid}/dropoffs/${id}`);
  const start = Date.now();
  for (;;) {
    const snap = await ref.get();
    const data = snap.data();
    if (data && data.status === 'verified') return data;
    if (Date.now() - start > timeoutMs) {
      throw new Error(`timed out waiting for verdict on ${ref.path} (status=${data?.status ?? 'missing'})`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }
}

let seq = 0;
/** A fresh user id per case keeps photoHashes / rate-limit state isolated. */
function newUser(): string {
  return `u${Date.now()}_${seq++}`;
}

async function seedUser(uid: string): Promise<void> {
  await db.doc(`users/${uid}`).set({
    displayName: 'Test Person',
    homeRegion: 'boston',
    currentRegion: 'boston',
    travel: false,
    tz: 'UTC',
    createdAt: Date.now(),
  });
}

/**
 * Create the drop-off doc. When `withPhoto` is true we upload the fixture jpeg
 * to `proofs/{uid}/{id}.jpg` first and record `photoPath` on the doc — the same
 * contract the client (src/lib/api.ts) uses — so verifyDropoff reads the photo.
 */
async function createDropoff(
  uid: string,
  extra: Record<string, unknown>,
  photo?: Buffer,
): Promise<string> {
  const ref = db.collection(`users/${uid}/dropoffs`).doc();
  let photoPath: string | undefined;
  if (photo) {
    photoPath = `proofs/${uid}/${ref.id}.jpg`;
    await uploadProof(photoPath, photo);
  }
  await ref.set({
    createdAt: Date.now(),
    region: 'boston',
    siteId: SITE.id,
    siteLabel: 'Boston City Hall',
    careful: false,
    tz: 'UTC',
    status: 'pending',
    ...(photoPath ? { photoPath } : {}),
    ...extra,
  });
  return ref.id;
}

beforeAll(() => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error('Emulators not detected. Run via `npm run test:emulator`.');
  }
  process.env.GCLOUD_PROJECT = PROJECT_ID;
  app = initializeApp({ projectId: PROJECT_ID, storageBucket: BUCKET });
  db = getFirestore();
});

afterAll(async () => {
  await deleteApp(app);
});

describe('verifyDropoff (emulator)', () => {
  it('fresh photo + in-geofence location → verified', async () => {
    const uid = newUser();
    await seedUser(uid);
    const id = await createDropoff(
      uid,
      { geo: { lat: SITE.lat, lng: SITE.lng, accuracy: 10 } },
      await makeJpeg({ capturedAtMs: Date.now(), color: { r: 200, g: 50, b: 50 } }),
    );
    const verdict = await waitForVerdict(uid, id);
    expect(verdict.proofLevel).toBe('verified');
    expect(verdict.seedsAwarded).toBe(15);
    expect(verdict.checks.fresh).toBe(true);
    expect(verdict.checks.duplicate).toBe(false);
    expect(verdict.checks.located).toBe(true);
  });

  it('fresh photo, no location → photo', async () => {
    const uid = newUser();
    await seedUser(uid);
    const id = await createDropoff(uid, {}, await makeJpeg({ capturedAtMs: Date.now(), color: { r: 50, g: 200, b: 50 } }));
    const verdict = await waitForVerdict(uid, id);
    expect(verdict.proofLevel).toBe('photo');
    expect(verdict.seedsAwarded).toBe(10);
    expect(verdict.checks.fresh).toBe(true);
    expect(verdict.checks.located).toBe(false);
  });

  it('fresh photo, location too far → photo (location fails geofence)', async () => {
    const uid = newUser();
    await seedUser(uid);
    const id = await createDropoff(
      uid,
      { geo: { lat: SITE.lat + 0.01, lng: SITE.lng, accuracy: 10 } }, // ~1.1 km away
      await makeJpeg({ capturedAtMs: Date.now(), color: { r: 50, g: 50, b: 200 } }),
    );
    const verdict = await waitForVerdict(uid, id);
    expect(verdict.proofLevel).toBe('photo');
    expect(verdict.checks.located).toBe(false);
  });

  it('stale EXIF (captured > 15 min ago) → self', async () => {
    const uid = newUser();
    await seedUser(uid);
    const staleCapture = Date.now() - 60 * 60 * 1000; // 1 hour old
    const id = await createDropoff(
      uid,
      { geo: { lat: SITE.lat, lng: SITE.lng, accuracy: 10 } },
      await makeJpeg({ capturedAtMs: staleCapture, color: { r: 150, g: 100, b: 20 } }),
    );
    const verdict = await waitForVerdict(uid, id);
    expect(verdict.proofLevel).toBe('self');
    expect(verdict.seedsAwarded).toBe(5);
    expect(verdict.checks.fresh).toBe(false);
  });

  it('duplicate photo (same image as a previous drop-off) → self', async () => {
    const uid = newUser();
    await seedUser(uid);
    const dupColor = { r: 33, g: 99, b: 177 };

    // First drop-off: a fresh, unique photo → photo-level, and its hash is stored.
    const firstId = await createDropoff(uid, {}, await makeJpeg({ capturedAtMs: Date.now(), color: dupColor }));
    const first = await waitForVerdict(uid, firstId);
    expect(first.proofLevel).toBe('photo');

    // Second drop-off: the identical image → flagged duplicate → self.
    const secondId = await createDropoff(uid, {}, await makeJpeg({ capturedAtMs: Date.now(), color: dupColor }));
    const second = await waitForVerdict(uid, secondId);
    expect(second.proofLevel).toBe('self');
    expect(second.checks.duplicate).toBe(true);
  });

  it('careful sorting adds 5 seeds on top of the proof level', async () => {
    const uid = newUser();
    await seedUser(uid);
    const id = await createDropoff(
      uid,
      { careful: true, geo: { lat: SITE.lat, lng: SITE.lng, accuracy: 10 } },
      await makeJpeg({ capturedAtMs: Date.now(), color: { r: 10, g: 220, b: 210 } }),
    );
    const verdict = await waitForVerdict(uid, id);
    expect(verdict.proofLevel).toBe('verified');
    expect(verdict.seedsAwarded).toBe(20); // 15 + 5 careful
  });
});
