/**
 * Jest config for Firestore + Storage security-rules tests.
 *
 * These run against the Firebase emulators (started by `npm run test:rules`,
 * which wraps this config in `firebase emulators:exec`). They use the real
 * `@firebase/rules-unit-testing` client, so they must NOT use the jest-expo
 * preset the app unit tests use. Kept separate from the default `npm test`.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/rules/**/*.test.ts'],
  // Rules tests talk to the emulator over the network; give them room.
  testTimeout: 20000,
};
