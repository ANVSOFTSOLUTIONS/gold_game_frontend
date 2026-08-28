import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii } from '../theme';
import { money, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import SectionLabel from '../components/SectionLabel';
import Row from '../components/Row';

export default function WalletScreen() {
  const balance = useGameStore((s) => s.balance);
  const playable = useGameStore((s) => s.playable);
  const withdrawable = useGameStore((s) => s.withdrawable);
  const txns = useGameStore((s) => s.txns);
  const go = useGameStore((s) => s.go);

  return (
    <Screen>
      <Text style={styles.title}>Wallet</Text>

      <LinearGradient
        colors={['#0F2A22', '#101218']}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
        <Text style={styles.balanceValue}>₹{money(balance)}</Text>
        <View style={styles.subRow}>
          <Text style={styles.subText}>
            Playable <Text style={styles.subValue}>₹{money(playable)}</Text>
          </Text>
          <Text style={styles.subText}>
            Withdrawable <Text style={styles.subValue}>₹{money(withdrawable)}</Text>
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.actionsRow}>
        <Pressable style={styles.addBtn} onPress={() => go('add')}>
          <Text style={styles.addBtnText}>+ ADD MONEY</Text>
        </Pressable>
        <Pressable style={styles.withdrawBtn} onPress={() => go('withdraw')}>
          <Text style={styles.withdrawBtnText}>↑ WITHDRAW</Text>
        </Pressable>
      </View>

      <SectionLabel>TRANSACTIONS</SectionLabel>
      <View style={{ gap: 8 }}>
        {txns.map((t, i) => (
          <Row
            key={i}
            title={t.label}
            subtitle={t.when}
            right={
              <Text style={[styles.amt, { color: t.gold ? colors.gold : t.positive ? colors.acc : colors.textDim }]}>
                {t.amt}
              </Text>
            }
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 20 },
  balanceCard: { borderRadius: radii.xxl, padding: 24, borderWidth: 1, borderColor: 'rgba(0,229,160,0.22)', marginBottom: 14 },
  balanceLabel: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 2, color: colors.acc },
  balanceValue: { fontFamily: fonts.monoBold, fontSize: 42, letterSpacing: -2, color: colors.text, marginTop: 10 },
  subRow: { flexDirection: 'row', gap: 18, marginTop: 14 },
  subText: { fontFamily: fonts.displayReg, fontSize: 12, color: colors.muted },
  subValue: { color: colors.text, fontFamily: fonts.displaySemi },

  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  addBtn: { flex: 1, alignItems: 'center', padding: 16, borderRadius: radii.md, backgroundColor: colors.acc },
  addBtnText: { fontFamily: fonts.display, fontSize: 13, color: colors.accDeep },
  withdrawBtn: { flex: 1, alignItems: 'center', padding: 16, borderRadius: radii.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  withdrawBtnText: { fontFamily: fonts.display, fontSize: 13, color: colors.text },

  amt: { fontFamily: fonts.monoSemi, fontSize: 14 },
});
