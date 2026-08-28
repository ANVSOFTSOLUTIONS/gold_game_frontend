import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { money, PayMethod, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import SectionLabel from '../components/SectionLabel';
import PrimaryButton from '../components/PrimaryButton';

const CHIPS = [100, 500, 1000, 2000];
const METHODS: { key: PayMethod; name: string; meta: string }[] = [
  { key: 'upi', name: 'UPI', meta: 'rahul@okaxis · instant' },
  { key: 'card', name: 'Debit / credit card', meta: '•••• 4417' },
  { key: 'net', name: 'Net banking', meta: 'HDFC Bank' },
];

export default function AddMoneyScreen() {
  const addAmount = useGameStore((s) => s.addAmount);
  const payMethod = useGameStore((s) => s.payMethod);
  const setAddAmount = useGameStore((s) => s.setAddAmount);
  const setPayMethod = useGameStore((s) => s.setPayMethod);
  const confirmAdd = useGameStore((s) => s.confirmAdd);
  const go = useGameStore((s) => s.go);

  return (
    <Screen>
      <BackButton onPress={() => go('wallet')} style={{ marginBottom: 18 }} />
      <Text style={styles.title}>Add money</Text>
      <Text style={styles.sub}>Instant credit. No fee below ₹5,000.</Text>

      <View style={styles.amountCard}>
        <SectionLabel>AMOUNT</SectionLabel>
        <View style={styles.amountRow}>
          <Text style={styles.rupee}>₹</Text>
          <Text style={styles.amountText}>{money(addAmount)}</Text>
        </View>
      </View>

      <View style={styles.chipsRow}>
        {CHIPS.map((v) => {
          const active = addAmount === v;
          return (
            <Pressable
              key={v}
              onPress={() => setAddAmount(v)}
              style={[styles.chip, { backgroundColor: active ? 'rgba(0,229,160,0.14)' : colors.card, borderColor: active ? colors.acc : colors.border }]}
            >
              <Text style={[styles.chipText, { color: active ? colors.acc : colors.textDim }]}>+{v}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionLabel>PAY WITH</SectionLabel>
      <View style={{ gap: 8, marginBottom: 26 }}>
        {METHODS.map((m) => {
          const active = payMethod === m.key;
          return (
            <Pressable
              key={m.key}
              onPress={() => setPayMethod(m.key)}
              style={[styles.methodRow, { backgroundColor: active ? 'rgba(0,229,160,0.08)' : colors.card2, borderColor: active ? 'rgba(0,229,160,0.5)' : colors.divider }]}
            >
              <View>
                <Text style={styles.methodName}>{m.name}</Text>
                <Text style={styles.methodMeta}>{m.meta}</Text>
              </View>
              <View style={[styles.radio, { borderColor: active ? colors.acc : 'rgba(255,255,255,0.2)', backgroundColor: active ? colors.acc : 'transparent' }]} />
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label={`PAY ₹${money(addAmount)}`} onPress={confirmAdd} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.displayReg, fontSize: 13, lineHeight: 20, color: colors.muted, marginBottom: 24 },
  amountCard: { borderRadius: radii.xl, padding: 22, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.divider, marginBottom: 14 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  rupee: { fontFamily: fonts.monoSemi, fontSize: 26, color: colors.muted },
  amountText: { fontFamily: fonts.monoBold, fontSize: 44, letterSpacing: -2, color: colors.text },
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  chip: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 14, borderWidth: 1 },
  chipText: { fontFamily: fonts.monoSemi, fontSize: 13 },
  methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 15, borderWidth: 1 },
  methodName: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.text },
  methodMeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 3 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5 },
});
