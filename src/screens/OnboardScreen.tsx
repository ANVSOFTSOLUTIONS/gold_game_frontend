import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme';
import { useGameStore } from '../store/useGameStore';
import PrimaryButton from '../components/PrimaryButton';

const STATS = [
  { v: '9×', k: 'PAYOUT' },
  { v: '30m', k: 'PER ROUND' },
  { v: '₹10', k: 'MIN STAKE' },
];

export default function OnboardScreen() {
  const insets = useSafeAreaInsets();
  const goSignup = useGameStore((s) => s.goSignup);
  const goLogin = useGameStore((s) => s.goLogin);

  return (
    <LinearGradient colors={['#16302A', colors.bg]} style={styles.root} locations={[0, 0.68]}>
      <View style={[styles.content, { paddingTop: insets.top + 34, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>9</Text>
        </View>

        <Text style={styles.heading}>
          One number.{'\n'}Thirty minutes.{'\n'}
          <Text style={{ color: colors.acc }}>Nine times back.</Text>
        </Text>

        <Text style={styles.sub}>
          Every 30 minutes one number between 1 and 9 is drawn. Call it right and your stake returns
          ninefold, straight to your wallet.
        </Text>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.k} style={styles.statCard}>
              <Text style={styles.statV}>{s.v}</Text>
              <Text style={styles.statK}>{s.k}</Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1, minHeight: 26 }} />

        <PrimaryButton label="GET STARTED" onPress={goSignup} />
        <View style={{ padding: 14, alignItems: 'center' }}>
          <Text style={styles.link} onPress={goLogin}>
            I already have an account
          </Text>
        </View>
        <Text style={styles.footer}>18+ only. Play involves financial risk.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 26 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radii.xl,
    backgroundColor: colors.acc,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logoText: { fontFamily: fonts.monoBold, fontSize: 28, color: colors.accDeep },
  heading: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -1.4,
    color: colors.text,
  },
  sub: {
    fontFamily: fonts.displayReg,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 16,
    maxWidth: 270,
  },
  statsRow: { flexDirection: 'row', gap: 9, marginTop: 32 },
  statCard: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  statV: { fontFamily: fonts.monoBold, fontSize: 18, color: colors.acc },
  statK: { fontFamily: fonts.monoSemi, fontSize: 9, letterSpacing: 1.2, color: colors.muted, marginTop: 6 },
  link: { fontFamily: fonts.displayMed, fontSize: 13, color: colors.muted },
  footer: { fontFamily: fonts.displayReg, fontSize: 10.5, lineHeight: 14, color: colors.faint, textAlign: 'center' },
});
