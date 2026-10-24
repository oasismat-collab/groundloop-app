/**
 * Storage security-rules tests (Task 4.2).
 *
 * Proof photos live at `proofs/{uid}/{dropoffId}.jpg`, writable only by the
 * owner, ≤ 5 MB, image/jpeg (design: Storage). Runs against the Storage
 * emulator via `@firebase/rules-unit-testing`.
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
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  updateMetadata,
  type FirebaseStorage,
} from 'firebase/storage';

const PROJECT_ID = 'demo-groundloop-rules';
const HOST = '127.0.0.1';
const PORT = 9299;

let testEnv: RulesTestEnvironment;

function storageAs(uid: string): FirebaseStorage {
  return testEnv.authenticatedContext(uid).storage() as unknown as FirebaseStorage;
}
function storageUnauth(): FirebaseStorage {
  return testEnv.unauthenticatedContext().storage() as unknown as FirebaseStorage;
}

const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const jpegMeta = { contentType: 'image/jpeg' };

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    storage: {
      host: HOST,
      port: PORT,
      rules: readFileSync(resolve(__dirname, '../../storage.rules'), 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearStorage();
});

describe('proofs/{uid}/{file}', () => {
  it('the owner can upload a jpeg to their own folder', async () => {
    const s = storageAs('ada');
    await assertSucceeds(uploadBytes(ref(s, 'proofs/ada/d1.jpg'), jpeg, jpegMeta));
  });

  it('a user cannot upload into another user folder', async () => {
    const s = storageAs('ada');
    await assertFails(uploadBytes(ref(s, 'proofs/bob/d1.jpg'), jpeg, jpegMeta));
  });

  it('an unauthenticated user cannot upload', async () => {
    const s = storageUnauth();
    await assertFails(uploadBytes(ref(s, 'proofs/ada/d1.jpg'), jpeg, jpegMeta));
  });

  it('rejects a non-jpeg content type', async () => {
    const s = storageAs('ada');
    await assertFails(uploadBytes(ref(s, 'proofs/ada/d1.png'), jpeg, { contentType: 'image/png' }));
  });

  it('rejects a file at or above 5 MB', async () => {
    const s = storageAs('ada');
    const big = new Uint8Array(5 * 1024 * 1024 + 1);
    big[0] = 0xff;
    big[1] = 0xd8;
    await assertFails(uploadBytes(ref(s, 'proofs/ada/big.jpg'), big, jpegMeta));
  });

  it('a signed-in user can read a proof photo; metadata update and delete are denied for the owner', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const s = ctx.storage() as unknown as FirebaseStorage;
      await uploadBytes(ref(s, 'proofs/ada/d1.jpg'), jpeg, jpegMeta);
    });
    // Any signed-in user may read a proof photo (community attaches it to posts).
    await assertSucceeds(getDownloadURL(ref(storageAs('bob'), 'proofs/ada/d1.jpg')));
    // `allow update, delete: if false` blocks metadata changes and deletion,
    // even for the owner — proofs are immutable once written.
    await assertFails(updateMetadata(ref(storageAs('ada'), 'proofs/ada/d1.jpg'), { contentType: 'image/jpeg' }));
    await assertFails(deleteObject(ref(storageAs('ada'), 'proofs/ada/d1.jpg')));
  });
});
