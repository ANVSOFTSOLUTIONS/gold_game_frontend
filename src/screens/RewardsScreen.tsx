import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii } from '../theme';
import { money, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import SectionLabel from '../components/SectionLabel';

const REDEEMS = [
  { name: 'Free play · ₹50 stake', cost: 500, cta: 'REDEEM', ok: true },
  { name: '₹100 wallet cash', cost: 1000, cta: 'REDEEM', ok: true },
  { name: '₹500 wallet cash', cost: 4500, cta: 'LOCKED', ok: false },
];

const EARNS = [
  { name: 'Play a round', pts: '10' },
  { name: 'Win a round', pts: '100' },
  { name: 'Invite a friend', pts: '250' },
  { name: '7-day streak', pts: '500' },
];

export default function RewardsScreen() {
  const points = useGameStore((s) => s.points);
  const redeem = useGameStore((s) => s.redeem);

  const tierPct = Math.min(100, Math.round((points / 5000) * 100));
  const tierNote = 5000 - points > 0 ? `${money(5000 - points)} points to Gold tier` : 'Gold tier unlocked';

  return (
    <Screen>
      <Text style={styles.title}>Rewards</Text>

      <LinearGradient
        colors={['#2A2314', '#101218']}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.pointsCard}
      >
        <Text style={styles.pointsLabel}>POINT BALANCE</Text>
        <Text style={styles.pointsValue}>{money(points)}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${tierPct}%` }]} />
        </View>
        <Text style={styles.tierNote}>{tierNote}</Text>
      </LinearGradient>

      <SectionLabel>REDEEM</SectionLabel>
      <View style={{ gap: 8, marginBottom: 24 }}>
        {REDEEMS.map((r) => (
          <View key={r.name} style={styles.redeemRow}>
            <View>
              <Text style={styles.redeemName}>{r.name}</Text>
              <Text style={styles.redeemCost}>{money(r.cost)} pts</Text>
            </View>
            <Pressable
              disabled={!r.ok}
              onPress={() => redeem(r.cost, r.ok)}
              style={[styles.redeemBtn, { backgroundColor: r.ok ? 'rgba(232,177,76,0.14)' : colors.card, borderColor: r.ok ? 'rgba(232,177,76,0.4)' : colors.border }]}
            >
              <Text style={[styles.redeemBtnText, { color: r.ok ? colors.gold : colors.muted }]}>{r.cta}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <SectionLabel>EARN MORE</SectionLabel>
      <View style={{ gap: 8 }}>
        {EARNS.map((e) => (
          <View key={e.name} style={styles.earnRow}>
            <Text style={styles.earnName}>{e.name}</Text>
            <Text style={styles.earnPts}>+{e.pts}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 20 },
  pointsCard: { borderRadius: radii.xxl, padding: 24, borderWidth: 1, borderColor: 'rgba(232,177,76,0.28)', marginBottom: 18 },
  pointsLabel: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 2, color: colors.gold },
  pointsValue: { fontFamily: fonts.monoBold, fontSize: 42, letterSpacing: -2, color: colors.text, marginTop: 10 },
  track: { marginTop: 16, height: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.09)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99, backgroundColor: colors.gold },
  tierNote: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 9 },

  redeemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 15, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  redeemName: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.text },
  redeemCost: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 3 },
  redeemBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.pill, borderWidth: 1 },
  redeemBtnText: { fontFamily: fonts.monoSemi, fontSize: 11 },

  earnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, paddingHorizontal: 15, borderRadius: 15, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  earnName: { fontFamily: fonts.displayMed, fontSize: 13, color: colors.textDim },
  earnPts: { fontFamily: fonts.monoSemi, fontSize: 12, color: colors.acc },
});
