import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { money, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';

export default function WithdrawScreen() {
  const withdrawable = useGameStore((s) => s.withdrawable);
  const wdAmount = useGameStore((s) => s.wdAmount);
  const setWdAmount = useGameStore((s) => s.setWdAmount);
  const confirmWithdraw = useGameStore((s) => s.confirmWithdraw);
  const go = useGameStore((s) => s.go);

  const chips = [
    { label: '₹300', v: 300 },
    { label: '₹500', v: 500 },
    { label: '₹1,000', v: 1000 },
    { label: 'ALL', v: withdrawable },
  ];

  return (
    <Screen>
      <BackButton onPress={() => go('wallet')} style={{ marginBottom: 18 }} />
      <Text style={styles.title}>Withdraw</Text>
      <Text style={styles.sub}>Withdrawable balance ₹{money(withdrawable)} · settles in ~2 hours</Text>

      <View style={styles.amountCard}>
        <View style={styles.amountRow}>
          <Text style={styles.rupee}>₹</Text>
          <Text style={styles.amountText}>{money(wdAmount)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Processing fee</Text>
          <Text style={styles.feeValue}>₹0</Text>
        </View>
        <View style={[styles.feeRow, { marginTop: 7 }]}>
          <Text style={styles.feeLabel}>You receive</Text>
          <Text style={[styles.feeValue, { color: colors.acc }]}>₹{money(wdAmount)}</Text>
        </View>
      </View>

      <View style={styles.chipsRow}>
        {chips.map((c) => {
          const active = wdAmount === c.v;
          return (
            <Pressable
              key={c.label}
              onPress={() => setWdAmount(c.v)}
              style={[styles.chip, { backgroundColor: active ? 'rgba(0,229,160,0.14)' : colors.card, borderColor: active ? colors.acc : colors.border }]}
            >
              <Text style={[styles.chipText, { color: active ? colors.acc : colors.textDim }]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.upiRow}>
        <View>
          <Text style={styles.upiName}>UPI · rahul@okaxis</Text>
          <Text style={styles.upiMeta}>Verified account</Text>
        </View>
        <Text style={styles.change}>CHANGE</Text>
      </View>

      <View style={styles.kycNotice}>
        <View style={styles.kycDot} />
        <Text style={styles.kycText}>Complete KYC to raise your daily limit from ₹2,000 to ₹25,000.</Text>
      </View>

      <PrimaryButton label="REQUEST WITHDRAWAL" onPress={confirmWithdraw} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.displayReg, fontSize: 13, lineHeight: 20, color: colors.muted, marginBottom: 22 },
  amountCard: { borderRadius: radii.xl, padding: 22, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.divider, marginBottom: 14 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  rupee: { fontFamily: fonts.monoSemi, fontSize: 26, color: colors.muted },
  amountText: { fontFamily: fonts.monoBold, fontSize: 44, letterSpacing: -2, color: colors.text },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 16 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  feeLabel: { fontFamily: fonts.displayReg, fontSize: 12, color: colors.muted },
  feeValue: { fontFamily: fonts.monoSemi, fontSize: 12, color: colors.text },
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  chip: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 14, borderWidth: 1 },
  chipText: { fontFamily: fonts.monoSemi, fontSize: 13 },
  upiRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.divider, marginBottom: 14 },
  upiName: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.text },
  upiMeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 3 },
  change: { fontFamily: fonts.monoSemi, fontSize: 11, color: colors.acc },
  kycNotice: { flexDirection: 'row', gap: 11, padding: 14, paddingHorizontal: 15, borderRadius: 15, backgroundColor: 'rgba(232,177,76,0.08)', borderWidth: 1, borderColor: 'rgba(232,177,76,0.25)', marginBottom: 24 },
  kycDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold, marginTop: 6 },
  kycText: { flex: 1, fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 17, color: colors.gold },
});
