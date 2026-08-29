import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii, shadows } from '../theme';
import { money, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import SectionLabel from '../components/SectionLabel';
import TimerRing from '../components/TimerRing';

const STAKES = [10, 50, 100, 500];

export default function GameScreen() {
  const roundId = useGameStore((s) => s.roundId);
  const balance = useGameStore((s) => s.balance);
  const t = useGameStore((s) => s.t);
  const roundLen = useGameStore((s) => s.roundLen);
  const picks = useGameStore((s) => s.picks);
  const stake = useGameStore((s) => s.stake);
  const payoutMultiplier = useGameStore((s) => s.payoutMultiplier);
  const lastDraws = useGameStore((s) => s.lastDraws);
  const drawn = useGameStore((s) => s.drawn);
  const showResult = useGameStore((s) => s.showResult);
  const go = useGameStore((s) => s.go);
  const togglePick = useGameStore((s) => s.togglePick);
  const setStake = useGameStore((s) => s.setStake);
  const placeBet = useGameStore((s) => s.placeBet);
  const nextRound = useGameStore((s) => s.nextRound);
  const myBet = useGameStore((s) => s.myBet);
  const walletBusy = useGameStore((s) => s.walletBusy);

  const total = picks.length * stake;
  const placeable = picks.length > 0 && total <= balance && !walletBusy;
  const betLabel = walletBusy
    ? 'PLACING BET…'
    : picks.length === 0
      ? 'PICK A NUMBER'
      : total > balance
        ? 'INSUFFICIENT BALANCE'
        : `PLACE BET · ₹${money(total)}`;
  const phaseLabel = t > 0 ? 'BETS OPEN' : 'DRAWING';
  const pickedLabel = picks.length ? [...picks].sort((a, b) => a - b).join(' · ') : '—';
  const hit = (myBet?.picks ?? []).includes(drawn ?? -1);
  const resultStake = myBet?.stake ?? stake;

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <View style={styles.header}>
          <BackButton onPress={() => go('home')} />
          <Text style={styles.roundLabel}>ROUND #{roundId}</Text>
          <View style={styles.balancePill}>
            <Text style={styles.balanceText}>₹{money(balance)}</Text>
          </View>
        </View>

        <View style={styles.timerWrap}>
          <TimerRing t={t} total={roundLen} phaseLabel={phaseLabel} />
        </View>

        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            const on = picks.includes(n);
            return (
              <Pressable
                key={n}
                onPress={() => togglePick(n)}
                style={({ pressed }) => [styles.cell, on && shadows.glowAcc, { opacity: pressed ? 0.85 : 1 }]}
              >
                {on ? (
                  <LinearGradient
                    colors={[colors.acc, colors.accHover]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.cellInner, styles.cellOn]}
                  >
                    <Text style={[styles.cellNum, { color: colors.accDeep }]}>{n}</Text>
                    <Text style={[styles.cellSub, { color: 'rgba(6,37,26,0.72)' }]}>PICKED</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.cellInner, styles.cellOff]}>
                    <Text style={[styles.cellNum, { color: colors.text }]}>{n}</Text>
                    <Text style={[styles.cellSub, { color: colors.muted }]}>{payoutMultiplier}× PAY</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <SectionLabel>STAKE PER NUMBER</SectionLabel>
        <View style={styles.stakeRow}>
          {STAKES.map((v) => {
            const active = stake === v;
            return (
              <Pressable
                key={v}
                onPress={() => setStake(v)}
                style={({ pressed }) => [styles.stakeChip, active && shadows.glowAcc, { opacity: pressed ? 0.85 : 1 }]}
              >
                {active ? (
                  <LinearGradient
                    colors={[colors.acc, colors.accHover]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.stakeChipInner}
                  >
                    <Text style={[styles.stakeChipText, { color: colors.accDeep }]}>₹{v}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.stakeChipInner, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                    <Text style={[styles.stakeChipText, { color: colors.textDim }]}>₹{v}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Numbers picked</Text>
            <Text style={styles.summaryValue}>{pickedLabel}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total stake</Text>
            <Text style={styles.summaryValue}>₹{money(total)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>If your number hits</Text>
            <Text style={styles.summaryWin}>₹{money(stake * payoutMultiplier)}</Text>
          </View>
        </View>

        <Pressable
          onPress={placeBet}
          disabled={!placeable}
          style={({ pressed }) => [styles.betBtn, placeable && shadows.glowAcc, { opacity: pressed ? 0.88 : 1 }]}
        >
          {placeable ? (
            <LinearGradient
              colors={[colors.acc, colors.accHover]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.betBtnInner}
            >
              <Text style={[styles.betBtnText, { color: colors.accDeep }]}>{betLabel}</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.betBtnInner, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}>
              <Text style={[styles.betBtnText, { color: colors.muted }]}>{betLabel}</Text>
            </View>
          )}
        </Pressable>

        <View style={{ marginTop: 24 }}>
          <SectionLabel>LAST DRAWS</SectionLabel>
          <View style={styles.lastDrawsRow}>
            {lastDraws.map((n, i) => (
              <View key={i} style={styles.lastDrawChip}>
                <Text style={[styles.lastDrawText, { color: n === drawn ? colors.acc : colors.textDim }]}>{n}</Text>
              </View>
            ))}
          </View>
        </View>
      </Screen>

      {showResult && (
        <View style={styles.overlay}>
          <View style={[styles.resultBadge, hit && shadows.glowAcc, { backgroundColor: hit ? 'rgba(232,132,92,0.16)' : colors.card, borderColor: hit ? colors.acc : colors.border }]}>
            <Text style={[styles.resultNum, { color: hit ? colors.acc : colors.text }]}>{drawn}</Text>
          </View>
          <Text style={styles.resultTitle}>{hit ? 'You hit it' : 'Not this time'}</Text>
          <Text style={styles.resultBody}>
            {hit
              ? `₹${money(resultStake * payoutMultiplier)} credited to your wallet, plus 100 reward points.`
              : `Number ${drawn} was drawn. You earned 10 points for playing.`}
          </Text>
          <Pressable onPress={nextRound} style={({ pressed }) => [shadows.glowAcc, { opacity: pressed ? 0.88 : 1 }]}>
            <LinearGradient colors={[colors.acc, colors.accHover]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>NEXT ROUND</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  roundLabel: { fontFamily: fonts.monoSemi, fontSize: 11, letterSpacing: 2, color: colors.muted },
  balancePill: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  balanceText: { fontFamily: fonts.monoSemi, fontSize: 12, color: colors.text },

  timerWrap: { alignItems: 'center', marginBottom: 22 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11, marginBottom: 22 },
  cell: { width: '31%', aspectRatio: 1, borderRadius: radii.xl },
  cellInner: { flex: 1, borderRadius: radii.xl, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  cellOn: { borderColor: 'rgba(255,255,255,0.28)' },
  cellOff: { backgroundColor: colors.card, borderColor: colors.border },
  cellNum: { fontFamily: fonts.monoBold, fontSize: 34 },
  cellSub: { fontFamily: fonts.monoSemi, fontSize: 9, letterSpacing: 1.2, marginTop: 6 },

  stakeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  stakeChip: { flex: 1, borderRadius: 14 },
  stakeChipInner: { alignItems: 'center', paddingVertical: 12, borderRadius: 14 },
  stakeChipText: { fontFamily: fonts.monoSemi, fontSize: 14 },

  summaryCard: { borderRadius: radii.lg, padding: 16, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.divider, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryLabel: { fontFamily: fonts.displayMed, fontSize: 13, color: colors.muted },
  summaryValue: { fontFamily: fonts.monoSemi, fontSize: 13, color: colors.text },
  summaryDivider: { height: 1, backgroundColor: colors.divider, marginVertical: 2, marginBottom: 12 },
  summaryWin: { fontFamily: fonts.monoBold, fontSize: 15, color: colors.acc },

  betBtn: { borderRadius: radii.lg },
  betBtnInner: { alignItems: 'center', paddingVertical: 17, borderRadius: radii.lg },
  betBtnText: { fontFamily: fonts.display, fontSize: 15 },

  lastDrawsRow: { flexDirection: 'row', gap: 8 },
  lastDrawChip: { width: 38, height: 38, borderRadius: radii.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  lastDrawText: { fontFamily: fonts.monoBold, fontSize: 15 },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6,8,12,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  resultBadge: { width: 120, height: 120, borderRadius: 34, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  resultNum: { fontFamily: fonts.monoBold, fontSize: 58 },
  resultTitle: { fontFamily: fonts.display, fontSize: 24, letterSpacing: -0.5, color: colors.text, marginTop: 26 },
  resultBody: { fontFamily: fonts.displayReg, fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: 8, textAlign: 'center', maxWidth: 250 },
  nextBtn: { marginTop: 30, paddingVertical: 15, paddingHorizontal: 40, borderRadius: radii.pill },
  nextBtnText: { fontFamily: fonts.display, fontSize: 14, color: colors.accDeep },
});
