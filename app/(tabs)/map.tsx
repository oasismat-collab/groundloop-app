import React, { useState } from 'react';
import { Text, View, StyleSheet, Linking, Platform, Alert } from 'react-native';
import MapView, { Marker, type LongPressEvent } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../src/hooks/useProfile';
import { REGIONS, type Site } from '../../src/data/regions';
import { suggestSite } from '../../src/lib/api';
import { Button, Card, Eyebrow } from '../../src/components/ui';
import { useTheme } from '../../src/theme';

const directions = (s: Site) => {
  const q = encodeURIComponent(s.label);
  const url = Platform.OS === 'ios' ? `http://maps.apple.com/?daddr=${s.lat},${s.lng}&q=${q}` : `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
  Linking.openURL(url);
};

export default function MapTab() {
  const t = useTheme();
  const { user, profile } = useProfile();
  const region = REGIONS[profile?.currentRegion ?? 'boston'] ?? REGIONS.boston!;
  const [sel, setSel] = useState<Site | null>(region.sites[0] ?? null);

  if (!region.sites.length) {
    return (
      <SafeAreaView style={[styles.wrap, { backgroundColor: t.bg }]}>
        <Text style={[styles.h1, { color: t.ink }]}>{region.programme}</Text>
        <Card><Text style={{ color: t.ink }}>{region.summary}</Text><Text style={{ color: t.muted }}>{region.access}</Text></Card>
        <Button title="Official info" kind="secondary" onPress={() => Linking.openURL(region.source)} />
      </SafeAreaView>
    );
  }
  const lat = region.sites.reduce((a, s) => a + s.lat, 0) / region.sites.length;
  const lng = region.sites.reduce((a, s) => a + s.lng, 0) / region.sites.length;

  const onLongPress = (e: LongPressEvent) => {
    if (!user) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    Alert.alert('Suggest a bin here?', 'Partners use these requests to decide where to add drop-off sites.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Suggest', onPress: () => suggestSite(user.uid, region.id, latitude, longitude).then(() => Alert.alert('Thanks', 'Your request is on the partner map.')) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <MapView style={{ flex: 1 }} initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.15, longitudeDelta: 0.15 }} onLongPress={onLongPress} showsUserLocation>
        {region.sites.map((s) => (
          <Marker key={s.id} coordinate={{ latitude: s.lat, longitude: s.lng }} title={s.label} description={s.area} pinColor={sel?.id === s.id ? t.no : t.forest} onPress={() => setSel(s)} />
        ))}
      </MapView>
      {sel && (
        <View style={styles.sheet}>
          <Card>
            <Eyebrow>{sel.area}</Eyebrow>
            <Text style={{ color: t.ink, fontSize: 18, fontWeight: '700' }}>{sel.label}</Text>
            {!!sel.note && <Text style={{ color: t.muted }}>{sel.note}</Text>}
            <Button title="Directions" onPress={() => directions(sel)} />
            <Text style={{ color: t.muted, fontSize: 12 }}>Long-press the map to suggest a new bin.</Text>
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, gap: 12 },
  h1: { fontSize: 26, fontWeight: '800' },
  sheet: { position: 'absolute', left: 12, right: 12, bottom: 12 },
});
