/**
 * Firestore security-rules tests (Task 4.2).
 *
 * Runs against the Firestore emulator via `@firebase/rules-unit-testing`.
 * Start with `npm run test:rules` (wraps these in `firebase emulators:exec`).
 *
 * Covers the guarantees the product principles and Requirement 4.8 / 7.3 depend on:
 * clients may create their own private data but can never write the trusted
 * fields (proofLevel, seeds, weeks, streak, member summaries, cheer counts).
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';

const PROJECT_ID = 'demo-groundloop-rules';
const HOST = '127.0.0.1';
const PORT = 8085;

let testEnv: RulesTestEnvironment;

/** A signed-in context for a given uid, optionally with a custom-claims role. */
function dbAs(uid: string, claims?: Record<string, unknown>): Firestore {
  return testEnv.authenticatedContext(uid, claims).firestore() as unknown as Firestore;
}
function dbUnauth(): Firestore {
  return testEnv.unauthenticatedContext().firestore() as unknown as Firestore;
}

/** Seed documents bypassing rules, e.g. function-written docs we want to read back. */
async function seed(fn: (db: Firestore) => Promise<unknown>): Promise<void> {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await fn(ctx.firestore() as unknown as Firestore);
  });
}

const validProfile = {
  displayName: 'Ada',
  homeRegion: 'boston',
  currentRegion: 'boston',
  travel: false,
  usualSite: { region: 'boston', siteId: 'city-hall' },
  tz: 'America/New_York',
  createdAt: serverTimestamp(),
};

const validDropoff = {
  createdAt: Date.now(),
  region: 'boston',
  siteId: 'city-hall',
  siteLabel: 'City Hall',
  careful: true,
  tz: 'America/New_York',
  status: 'pending',
};

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: HOST,
      port: PORT,
      rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('users/{uid} profile', () => {
  it('a user can read and create their own profile with allowed keys', async () => {
    const db = dbAs('ada');
    await assertSucceeds(setDoc(doc(db, 'users/ada'), validProfile));
    await assertSucceeds(getDoc(doc(db, 'users/ada')));
  });

  it('a user cannot read another user private profile', async () => {
    await seed((db) => setDoc(doc(db, 'users/bob'), validProfile));
    const db = dbAs('ada');
    await assertFails(getDoc(doc(db, 'users/bob')));
  });

  it('an unauthenticated user cannot create a profile', async () => {
    const db = dbUnauth();
    await assertFails(setDoc(doc(db, 'users/ada'), validProfile));
  });

  it('a user cannot create a profile for someone else', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'users/bob'), validProfile));
  });

  it('rejects creating a profile that includes a trusted field (seeds)', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'users/ada'), { ...validProfile, seeds: 999 }));
  });

  it('allows updating editable fields (currentRegion, travel)', async () => {
    await seed((db) => setDoc(doc(db, 'users/ada'), validProfile));
    const db = dbAs('ada');
    await assertSucceeds(updateDoc(doc(db, 'users/ada'), { currentRegion: 'cambridge', travel: true }));
  });

  it('blocks the client from writing trusted fields on update (Req 4.8)', async () => {
    await seed((db) => setDoc(doc(db, 'users/ada'), validProfile));
    const db = dbAs('ada');
    await assertFails(updateDoc(doc(db, 'users/ada'), { seeds: 100 }));
    await assertFails(updateDoc(doc(db, 'users/ada'), { weeks: ['2026-W43'] }));
    await assertFails(updateDoc(doc(db, 'users/ada'), { freezes: 2 }));
    await assertFails(updateDoc(doc(db, 'users/ada'), { proofCounts: { self: 0, photo: 0, verified: 9 } }));
  });
});

describe('users/{uid}/dropoffs/{id}', () => {
  it('a user can create a pending drop-off for themselves', async () => {
    const db = dbAs('ada');
    await assertSucceeds(setDoc(doc(db, 'users/ada/dropoffs/d1'), validDropoff));
  });

  it('rejects a drop-off whose status is not pending', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'users/ada/dropoffs/d1'), { ...validDropoff, status: 'verified' }));
  });

  it('rejects a drop-off that smuggles a trusted field (proofLevel / seedsAwarded)', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'users/ada/dropoffs/d1'), { ...validDropoff, proofLevel: 'verified' }));
    await assertFails(setDoc(doc(db, 'users/ada/dropoffs/d2'), { ...validDropoff, seedsAwarded: 15 }));
  });

  it('a user cannot create a drop-off under another user', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'users/bob/dropoffs/d1'), validDropoff));
  });

  it('a drop-off cannot be updated or deleted by the client (finalised by the function only)', async () => {
    await seed((db) => setDoc(doc(db, 'users/ada/dropoffs/d1'), { ...validDropoff, status: 'verified' }));
    const db = dbAs('ada');
    await assertFails(updateDoc(doc(db, 'users/ada/dropoffs/d1'), { status: 'pending' }));
    await assertFails(deleteDoc(doc(db, 'users/ada/dropoffs/d1')));
  });
});

describe('members/{uid} public summary', () => {
  it('a signed-in user can read a member summary', async () => {
    await seed((db) => setDoc(doc(db, 'members/ada'), { displayName: 'Ada', region: 'boston', streak: 3 }));
    const db = dbAs('bob');
    await assertSucceeds(getDoc(doc(db, 'members/ada')));
  });

  it('an unauthenticated user cannot read a member summary', async () => {
    await seed((db) => setDoc(doc(db, 'members/ada'), { displayName: 'Ada', streak: 3 }));
    const db = dbUnauth();
    await assertFails(getDoc(doc(db, 'members/ada')));
  });

  it('no client can write a member summary (functions only)', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'members/ada'), { displayName: 'Ada', streak: 99 }));
  });
});

describe('posts/{id} and cheers', () => {
  const validPost = {
    uid: 'ada',
    kind: 'Reflection',
    text: 'First compost of the week.',
    region: 'boston',
    createdAt: Date.now(),
  };

  it('a user can create a post as themselves', async () => {
    const db = dbAs('ada');
    await assertSucceeds(setDoc(doc(db, 'posts/p1'), validPost));
  });

  it('rejects a post over 280 characters', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'posts/p1'), { ...validPost, text: 'x'.repeat(281) }));
  });

  it('rejects an unknown post kind', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'posts/p1'), { ...validPost, kind: 'Rant' }));
  });

  it('rejects a post that presets a cheerCount (functions only)', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'posts/p1'), { ...validPost, cheerCount: 50 }));
  });

  it('a user cannot post as another user', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'posts/p1'), { ...validPost, uid: 'bob' }));
  });

  it('a user can cheer another user post but not their own (Req 7.3)', async () => {
    await seed((db) => setDoc(doc(db, 'posts/p1'), { ...validPost, uid: 'bob' }));
    const bobDb = dbAs('bob');
    await assertFails(setDoc(doc(bobDb, 'posts/p1/cheers/bob'), { createdAt: Date.now() }));
    const adaDb = dbAs('ada');
    await assertSucceeds(setDoc(doc(adaDb, 'posts/p1/cheers/ada'), { createdAt: Date.now() }));
  });

  it('a user cannot cheer under another user id', async () => {
    await seed((db) => setDoc(doc(db, 'posts/p1'), { ...validPost, uid: 'bob' }));
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'posts/p1/cheers/carol'), { createdAt: Date.now() }));
  });
});

describe('reports/{id}', () => {
  it('a signed-in user can create a report', async () => {
    const db = dbAs('ada');
    await assertSucceeds(setDoc(doc(db, 'reports/r1'), { postId: 'p1', uid: 'ada', reason: 'spam', createdAt: Date.now() }));
  });

  it('a non-partner cannot read reports', async () => {
    await seed((db) => setDoc(doc(db, 'reports/r1'), { postId: 'p1', uid: 'ada', reason: 'spam', createdAt: Date.now() }));
    const db = dbAs('ada');
    await assertFails(getDoc(doc(db, 'reports/r1')));
  });

  it('a partner can read reports', async () => {
    await seed((db) => setDoc(doc(db, 'reports/r1'), { postId: 'p1', uid: 'ada', reason: 'spam', createdAt: Date.now() }));
    const db = dbAs('mod', { role: 'partner' });
    await assertSucceeds(getDoc(doc(db, 'reports/r1')));
  });
});

describe('siteRequests/{id}', () => {
  const req = { uid: 'ada', region: 'boston', lat: 42.3601, lng: -71.0589, note: 'A bin here would help', createdAt: Date.now() };

  it('a user can create a site request as themselves', async () => {
    const db = dbAs('ada');
    await assertSucceeds(setDoc(doc(db, 'siteRequests/s1'), req));
  });

  it('rejects a note longer than 120 characters', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'siteRequests/s1'), { ...req, note: 'x'.repeat(121) }));
  });

  it('a user cannot create a site request for another user', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'siteRequests/s1'), { ...req, uid: 'bob' }));
  });
});

describe('hostOffers/{id}', () => {
  const offer = { uid: 'ada', region: 'boston', name: 'Cafe', type: 'business', address: '1 Main St', status: 'Under review', createdAt: Date.now() };

  it('a user can submit a host offer with status Under review', async () => {
    const db = dbAs('ada');
    await assertSucceeds(setDoc(doc(db, 'hostOffers/h1'), offer));
  });

  it('rejects a host offer that presets an approved status', async () => {
    const db = dbAs('ada');
    await assertFails(setDoc(doc(db, 'hostOffers/h1'), { ...offer, status: 'Approved' }));
  });

  it('the creator can read their own offer; a stranger cannot', async () => {
    await seed((db) => setDoc(doc(db, 'hostOffers/h1'), offer));
    await assertSucceeds(getDoc(doc(dbAs('ada'), 'hostOffers/h1')));
    await assertFails(getDoc(doc(dbAs('bob'), 'hostOffers/h1')));
  });

  it('a partner can read and review an offer; a plain client cannot update it', async () => {
    await seed((db) => setDoc(doc(db, 'hostOffers/h1'), offer));
    const partner = dbAs('mod', { role: 'partner' });
    await assertSucceeds(getDoc(doc(partner, 'hostOffers/h1')));
    await assertSucceeds(updateDoc(doc(partner, 'hostOffers/h1'), { status: 'Approved', reviewedBy: 'mod', reviewedAt: Date.now() }));
    await assertFails(updateDoc(doc(dbAs('ada'), 'hostOffers/h1'), { status: 'Approved' }));
  });
});
