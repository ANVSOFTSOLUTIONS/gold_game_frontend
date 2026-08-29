import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme';
import { money, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import SectionLabel from '../components/SectionLabel';

const RULES = [
  { n: '1', title: 'Pick your numbers', body: 'Any of 1 to 9. Stake each one separately, ₹10 to ₹500.' },
  { n: '2', title: 'Wait for the draw', body: 'Every 30 minutes one number is drawn for everyone playing.' },
  { n: '3', title: 'Win 9× your stake', body: 'Hit the number and your wallet is credited instantly, plus 100 points.' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const balance = useGameStore((s) => s.balance);
  const points = useGameStore((s) => s.points);
  const streak = useGameStore((s) => s.streak);
  const roundId = useGameStore((s) => s.roundId);
  const t = useGameStore((s) => s.t);
  const go = useGameStore((s) => s.go);

  const clock = `0:${String(t).padStart(2, '0')}`;

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>9</Text>
            </View>
            <Text style={styles.brandText}>NINEBOX</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.bellBtn} onPress={() => go('notif')}>
              <Text style={styles.bellText}>!</Text>
              <View style={styles.bellDot} />
            </Pressable>
            <Pressable style={styles.balancePill} onPress={() => go('wallet')}>
              <View style={styles.balanceDot} />
              <Text style={styles.balanceText}>₹{money(balance)}</Text>
            </Pressable>
          </View>
        </View>

        <LinearGradient
          colors={['#151C2B', '#10121A']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.liveCard}
        >
          <Text style={styles.liveLabel}>LIVE ROUND · #{roundId}</Text>
          <Text style={styles.liveHeading}>Pick a number.{'\n'}Nine ways to win.</Text>
          <View style={styles.liveStatsRow}>
            <View>
              <Text style={styles.liveStatV}>{clock}</Text>
              <Text style={styles.liveStatK}>CLOSES IN</Text>
            </View>
            <View style={styles.liveDivider} />
            <View>
              <Text style={styles.liveStatV}>1,284</Text>
              <Text style={styles.liveStatK}>PLAYING NOW</Text>
            </View>
            <View style={styles.liveDivider} />
            <View>
              <Text style={[styles.liveStatV, { color: colors.acc }]}>9×</Text>
              <Text style={styles.liveStatK}>PAYOUT</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>REWARD POINTS</Text>
            <Text style={[styles.statValue, { color: colors.gold }]}>{money(points)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>WIN STREAK</Text>
            <Text style={styles.statValue}>{streak}</Text>
          </View>
        </View>

        <Pressable style={styles.leaderboardRow} onPress={() => go('leaderboard')}>
          <View>
            <Text style={styles.leaderboardTitle}>Today's leaderboard</Text>
            <Text style={styles.leaderboardSub}>You're #24 · ₹10,000 daily pool</Text>
          </View>
          <Text style={styles.leaderboardArrow}>→</Text>
        </Pressable>

        <View style={{ marginBottom: 16 }}>
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <View style={{ gap: 9 }}>
            {RULES.map((r) => (
              <View key={r.n} style={styles.ruleRow}>
                <View style={styles.ruleBadge}>
                  <Text style={styles.ruleBadgeText}>{r.n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ruleTitle}>{r.title}</Text>
                  <Text style={styles.ruleBody}>{r.body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Pressable style={styles.inviteCard} onPress={() => go('referral')}>
          <Text style={styles.inviteTitle}>Invite a friend → ₹50 each</Text>
          <Text style={styles.inviteSub}>
            Your code <Text style={styles.inviteCode}>NINE-K7QX</Text>
          </Text>
        </Pressable>
      </Screen>

      <View style={[styles.ctaWrap, { bottom: 86 + insets.bottom }]} pointerEvents="box-none">
        <Pressable style={styles.cta} onPress={() => go('game')}>
          <Text style={styles.ctaText}>GO TO GAME</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: radii.sm, backgroundColor: colors.acc, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { fontFamily: fonts.monoBold, fontSize: 17, color: colors.accDeep },
  brandText: { fontFamily: fonts.display, fontSize: 16, letterSpacing: -0.3, color: colors.text },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bellBtn: { width: 34, height: 34, borderRadius: radii.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  bellText: { fontFamily: fonts.monoSemi, fontSize: 13, color: colors.muted },
  bellDot: { position: 'absolute', top: 6, right: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.red },
  balancePill: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 9, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  balanceDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.acc },
  balanceText: { fontFamily: fonts.monoSemi, fontSize: 12, color: colors.text },

  liveCard: { borderRadius: 26, padding: 22, paddingTop: 24, borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: 'hidden' },
  liveLabel: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 2.2, color: colors.acc, marginBottom: 12 },
  liveHeading: { fontFamily: fonts.display, fontSize: 34, lineHeight: 36, letterSpacing: -1.2, color: colors.text, maxWidth: 240 },
  liveStatsRow: { flexDirection: 'row', gap: 22, marginTop: 20 },
  liveStatV: { fontFamily: fonts.monoBold, fontSize: 20, color: colors.text },
  liveStatK: { fontFamily: fonts.monoMed, fontSize: 10, letterSpacing: 1.4, color: colors.muted, marginTop: 4 },
  liveDivider: { width: 1, backgroundColor: colors.divider },

  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: { flex: 1, borderRadius: radii.xl, padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderFaint },
  statLabel: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 1.6, color: colors.muted },
  statValue: { fontFamily: fonts.monoBold, fontSize: 24, marginTop: 8, color: colors.text },

  leaderboardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, paddingHorizontal: 16, borderRadius: radii.md, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderFaint, marginBottom: 18 },
  leaderboardTitle: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.text },
  leaderboardSub: { fontFamily: fonts.displayReg, fontSize: 11.5, color: colors.muted, marginTop: 3 },
  leaderboardArrow: { fontFamily: fonts.monoSemi, fontSize: 14, color: colors.acc },

  ruleRow: { flexDirection: 'row', gap: 13, alignItems: 'flex-start', padding: 13, paddingHorizontal: 14, borderRadius: radii.md, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  ruleBadge: { width: 22, height: 22, borderRadius: 7, backgroundColor: 'rgba(232,132,92,0.14)', alignItems: 'center', justifyContent: 'center' },
  ruleBadgeText: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.acc },
  ruleTitle: { fontFamily: fonts.displaySemi, fontSize: 13, lineHeight: 17, color: colors.text },
  ruleBody: { fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 17, color: colors.muted, marginTop: 3 },

  inviteCard: { borderRadius: radii.xl, padding: 15, paddingHorizontal: 16, backgroundColor: 'rgba(124,92,255,0.1)', borderWidth: 1, borderColor: 'rgba(124,92,255,0.28)' },
  inviteTitle: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.purpleLight },
  inviteSub: { fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 17, color: colors.muted, marginTop: 3 },
  inviteCode: { fontFamily: fonts.monoSemi, fontSize: 12, color: colors.text },

  ctaWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 17, paddingHorizontal: 34, borderRadius: radii.pill, backgroundColor: colors.acc },
  ctaText: { fontFamily: fonts.display, fontSize: 15, letterSpacing: 0.2, color: colors.accDeep },
  ctaArrow: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.accDeep },
});
