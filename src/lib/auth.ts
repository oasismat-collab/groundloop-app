import Constants from 'expo-constants';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential, signOut as fbSignOut } from 'firebase/auth';
import { auth } from './firebase';

const extra = Constants.expoConfig?.extra as { googleWebClientId?: string; googleIosClientId?: string };

GoogleSignin.configure({
  webClientId: extra.googleWebClientId, // required to receive an idToken Firebase accepts
  iosClientId: extra.googleIosClientId,
});

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const res = await GoogleSignin.signIn();
  const idToken = res.data?.idToken;
  if (!idToken) throw new Error('Google sign-in was cancelled.');
  return signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
}

export async function signInWithApple() {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
  const apple = await AppleAuthentication.signInAsync({
    requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
    nonce: hashedNonce,
  });
  if (!apple.identityToken) throw new Error('Apple sign-in did not return a token.');
  const credential = new OAuthProvider('apple.com').credential({ idToken: apple.identityToken, rawNonce });
  const result = await signInWithCredential(auth, credential);
  // Apple only shares the name on the very first sign-in, so keep it.
  const given = apple.fullName?.givenName;
  return { result, givenName: given ?? null };
}

export async function signOut() {
  try { await GoogleSignin.signOut(); } catch { /* not signed in with Google */ }
  await fbSignOut(auth);
}

export const appleAvailable = () => AppleAuthentication.isAvailableAsync();
