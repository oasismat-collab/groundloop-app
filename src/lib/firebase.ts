import Constants from 'expo-constants';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, type Auth } from 'firebase/auth';
// getReactNativePersistence ships in Firebase's React Native bundle; its types live there too.
// @ts-expect-error -- exported by the RN build of firebase/auth
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore, persistentLocalCache, getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const cfg = (Constants.expoConfig?.extra as { firebase: Record<string, string> }).firebase;

const app = getApps().length ? getApp() : initializeApp(cfg);

let auth: Auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  auth = getAuth(app); // already initialised (fast refresh)
}

let db: Firestore;
try {
  db = initializeFirestore(app, { localCache: persistentLocalCache() });
} catch {
  db = getFirestore(app);
}

export { app, auth, db };
export const storage = getStorage(app);
