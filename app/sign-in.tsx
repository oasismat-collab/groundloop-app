import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithApple, signInWithGoogle, appleAvailable } from '../src/lib/auth';
import { updateProfile } from '../src/lib/api';
import { Mascot } from '../src/components/Mascot';
import { Button } from '../src/components/ui';
import { useTheme } from '../src/theme';

export default function SignIn() {
  const t = useTheme();
  const [apple, setApple] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { appleAvailable().then(setApple).catch(() => setApple(false)); }, []);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try { await fn(); } catch (e) { Alert.alert('Sign-in didn’t finish', e instanceof Error ? e.message : 'Please try again.'); } finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={[styles.wrap, { backgroundColor: t.bg }]}>
      <View style={styles.hero}>
        <Mascot id="peel" size={130} />
        <Text style={[styles.title, { color: t.ink }]}>GroundLoop</Text>
        <Text style={[styles.sub, { color: t.muted }]}>Follow your food scraps back to the soil. Your weekly streak follows you everywhere.</Text>
      </View>
      <View style={styles.buttons}>
        <Button title="Continue with Google" kind="secondary" disabled={busy} onPress={() => run(signInWithGoogle)} />
        {Platform.OS === 'ios' && apple && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={14}
            style={{ height: 52, width: '100%' }}
            onPress={() => run(async () => {
              const { result, givenName } = await signInWithApple();
              if (givenName) await updateProfile(result.user.uid, { displayName: givenName }).catch(() => undefined);
            })}
          />
        )}
        <Text style={[styles.fine, { color: t.muted }]}>We only read your location when you log a drop-off, never in the background.</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'space-between' },
  hero: { alignItems: 'center', gap: 10, marginTop: 60 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -1 },
  sub: { textAlign: 'center', fontSize: 16, maxWidth: 320 },
  buttons: { gap: 12, marginBottom: 12 },
  fine: { textAlign: 'center', fontSize: 13 },
});
