import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';

const STEPS = [
  { badge: '1', title: 'Mobile verified', meta: '+91 98765 43210', state: 'DONE', ok: true },
  { badge: '2', title: 'PAN card', meta: 'ABCDE1234F', state: 'DONE', ok: true },
  { badge: '3', title: 'Photo ID', meta: 'Aadhaar or driving licence', state: 'PENDING', ok: false },
];

export default function KycScreen() {
  const go = useGameStore((s) => s.go);

  return (
    <Screen>
      <BackButton onPress={() => go('profile')} style={{ marginBottom: 18 }} />
      <Text style={styles.title}>Verify identity</Text>
      <Text style={styles.sub}>Required once, before withdrawals above ₹2,000.</Text>

      <View style={{ gap: 10, marginBottom: 20 }}>
        {STEPS.map((k) => (
          <View key={k.badge} style={[styles.stepRow, { borderColor: k.ok ? 'rgba(232,132,92,0.3)' : colors.border }]}>
            <View style={[styles.badge, { backgroundColor: k.ok ? colors.acc : 'rgba(255,255,255,0.08)' }]}>
              <Text style={[styles.badgeText, { color: k.ok ? colors.accDeep : colors.muted }]}>{k.badge}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{k.title}</Text>
              <Text style={styles.stepMeta}>{k.meta}</Text>
            </View>
            <Text style={[styles.stepState, { color: k.ok ? colors.acc : colors.gold }]}>{k.state}</Text>
          </View>
        ))}
      </View>

      <View style={styles.uploadBox}>
        <View style={styles.uploadPreview}>
          <Text style={styles.uploadPreviewText}>ID DOCUMENT PHOTO</Text>
        </View>
        <Text style={styles.uploadHint}>Tap to scan your ID card</Text>
      </View>

      <PrimaryButton label="SUBMIT FOR REVIEW" onPress={() => go('profile')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.displayReg, fontSize: 13, lineHeight: 20, color: colors.muted, marginBottom: 22 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, borderRadius: radii.lg, backgroundColor: colors.card2, borderWidth: 1 },
  badge: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.monoBold, fontSize: 11 },
  stepTitle: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.text },
  stepMeta: { fontFamily: fonts.displayReg, fontSize: 11.5, color: colors.muted, marginTop: 3 },
  stepState: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 1 },
  uploadBox: { borderRadius: radii.lg, padding: 20, backgroundColor: colors.card2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderStyle: 'dashed', alignItems: 'center', marginBottom: 20 },
  uploadPreview: { width: '100%', height: 96, borderRadius: 12, backgroundColor: '#171A22', alignItems: 'center', justifyContent: 'center' },
  uploadPreviewText: { fontFamily: fonts.monoMed, fontSize: 10.5, color: '#6B7182', letterSpacing: 1 },
  uploadHint: { fontFamily: fonts.displayReg, fontSize: 12, color: colors.muted, marginTop: 13 },
});
