import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { money, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import SectionLabel from '../components/SectionLabel';
import PrimaryButton from '../components/PrimaryButton';

const BORROW_CHIPS = [500, 1000, 2000, 5000];

export default function LoanScreen() {
  const go = useGameStore((s) => s.go);
  const loanBalance = useGameStore((s) => s.loanBalance);
  const loanLimit = useGameStore((s) => s.loanLimit);
  const takeLoan = useGameStore((s) => s.takeLoan);
  const repayLoan = useGameStore((s) => s.repayLoan);

  const available = Math.max(0, loanLimit - loanBalance);
  const [amount, setAmount] = useState(Math.min(1000, available));

  return (
    <Screen>
      <BackButton onPress={() => go('profile')} style={{ marginBottom: 18 }} />
      <Text style={styles.title}>Loans</Text>
      <Text style={styles.sub}>
        Borrow against your play history, repay whenever. Preview feature — not yet linked to your real wallet
        balance.
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>OUTSTANDING</Text>
          <Text style={styles.summaryValue}>₹{money(loanBalance)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>AVAILABLE CREDIT</Text>
          <Text style={[styles.summaryValue, { color: colors.acc }]}>₹{money(available)}</Text>
        </View>
      </View>

      {available > 0 && (
        <>
          <SectionLabel>BORROW AMOUNT</SectionLabel>
          <View style={styles.chipsRow}>
            {BORROW_CHIPS.map((v) => {
              const capped = Math.min(v, available);
              const active = amount === capped;
              return (
                <Pressable
                  key={v}
                  onPress={() => setAmount(capped)}
                  style={[styles.chip, { backgroundColor: active ? 'rgba(232,132,92,0.14)' : colors.card, borderColor: active ? colors.acc : colors.border }]}
                >
                  <Text style={[styles.chipText, { color: active ? colors.acc : colors.textDim }]}>₹{money(capped)}</Text>
                </Pressable>
              );
            })}
          </View>
          <PrimaryButton label={`BORROW ₹${money(amount)}`} onPress={() => takeLoan(amount)} style={{ marginBottom: 24 }} />
        </>
      )}

      {loanBalance > 0 && (
        <>
          <SectionLabel>REPAY</SectionLabel>
          <PrimaryButton
            variant="outline"
            label={`REPAY ₹${money(Math.min(500, loanBalance))}`}
            onPress={() => repayLoan(Math.min(500, loanBalance))}
            style={{ marginBottom: 10 }}
          />
          <PrimaryButton variant="outline" label={`REPAY ALL · ₹${money(loanBalance)}`} onPress={() => repayLoan(loanBalance)} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.displayReg, fontSize: 13, lineHeight: 20, color: colors.muted, marginBottom: 22 },

  summaryCard: { borderRadius: radii.xl, padding: 20, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.divider, marginBottom: 22 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 1.6, color: colors.muted },
  summaryValue: { fontFamily: fonts.monoBold, fontSize: 20, color: colors.text },
  summaryDivider: { height: 1, backgroundColor: colors.divider, marginVertical: 14 },

  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 14, borderWidth: 1 },
  chipText: { fontFamily: fonts.monoSemi, fontSize: 13 },
});
