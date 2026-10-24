/**
 * Jest config for the Cloud Functions emulator tests (task 5.5).
 * Run via `npm run test:emulator`, which builds the functions and then wraps
 * jest in `firebase emulators:exec`.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  testTimeout: 30000,
};
