import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii } from '../theme';
import { Screen as ScreenKey, money, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';

const STATIC_ROWS: { label: string; value: string; color: string; to: ScreenKey }[] = [
  { label: 'Verify identity (KYC)', value: 'PENDING', color: colors.gold, to: 'kyc' },
  { label: 'My results', value: '318 ROUNDS', color: colors.textDim, to: 'history' },
  { label: 'Leaderboard', value: '#24 TODAY', color: colors.textDim, to: 'leaderboard' },
  { label: 'Refer & earn', value: '₹250 EARNED', color: colors.acc, to: 'referral' },
  { label: 'Notifications', value: '2 NEW', color: colors.textDim, to: 'notif' },
  { label: 'Help & limits', value: 'OPEN', color: colors.textDim, to: 'support' },
  { label: 'Lifetime winnings', value: '₹14,220', color: colors.acc, to: 'history' },
  { label: 'Admin dashboard', value: 'OPEN', color: colors.purpleLight, to: 'admin' },
];

export default function ProfileScreen() {
  const go = useGameStore((s) => s.go);
  const logout = useGameStore((s) => s.logout);
  const points = useGameStore((s) => s.points);

  const rows = [
    { label: 'Rewards & redeem', value: `${money(points)} PTS`, color: colors.gold, to: 'rewards' as ScreenKey },
    ...STATIC_ROWS,
  ];

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <LinearGradient colors={['#7C5CFF', colors.acc]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
          <Text style={styles.avatarText}>RM</Text>
        </LinearGradient>
        <View>
          <Text style={styles.name}>Rahul Menon</Text>
          <Text style={styles.phone}>+91 98765 43210</Text>
        </View>
      </View>

      <View style={{ gap: 8, marginBottom: 20 }}>
        {rows.map((r) => (
          <Pressable key={r.label} style={styles.row} onPress={() => go(r.to)}>
            <Text style={styles.rowLabel}>{r.label}</Text>
            <Text style={[styles.rowValue, { color: r.color }]}>{r.value}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: radii.xl, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.divider, marginBottom: 18 },
  avatar: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 20, color: colors.bg },
  name: { fontFamily: fonts.display, fontSize: 16, color: colors.text },
  phone: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, marginTop: 3 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 15, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  rowLabel: { fontFamily: fonts.displayMed, fontSize: 13, color: colors.text },
  rowValue: { fontFamily: fonts.monoSemi, fontSize: 12 },
  logoutBtn: { alignItems: 'center', padding: 15, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: 'rgba(255,90,54,0.3)' },
  logoutText: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.red },
});
