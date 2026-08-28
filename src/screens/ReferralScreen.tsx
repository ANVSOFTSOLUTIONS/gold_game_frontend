import React, { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { colors, fonts, radii } from '../theme';
import { useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import SectionLabel from '../components/SectionLabel';

const CODE = 'NINE-K7QX';

const INVITES = [
  { name: 'Anita P.', status: 'PAID ₹50', gold: false },
  { name: 'Karan M.', status: 'PAID ₹50', gold: false },
  { name: 'Deepak V.', status: 'PLAYED 0 ROUNDS', gold: false },
  { name: 'Sneha T.', status: 'NOT JOINED', gold: false },
];

export default function ReferralScreen() {
  const go = useGameStore((s) => s.go);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await Clipboard.setStringAsync(CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shareLink = () => {
    Share.share({ message: `Join me on NINEBOX! Use my code ${CODE} and we both get ₹50.` });
  };

  return (
    <Screen>
      <BackButton onPress={() => go('rewards')} style={{ marginBottom: 18 }} />
      <Text style={styles.title}>Invite friends,{'\n'}earn ₹50 each</Text>
      <Text style={styles.sub}>They get ₹50 too, credited after their first round.</Text>

      <LinearGradient colors={['#1C1832', '#101218']} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={styles.codeCard}>
        <Text style={styles.codeLabel}>YOUR CODE</Text>
        <Text style={styles.codeValue}>{CODE}</Text>
        <View style={styles.codeActions}>
          <Pressable style={styles.copyBtn} onPress={copyCode}>
            <Text style={styles.copyBtnText}>{copied ? 'COPIED' : 'COPY CODE'}</Text>
          </Pressable>
          <Pressable style={styles.shareBtn} onPress={shareLink}>
            <Text style={styles.shareBtnText}>SHARE LINK</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>INVITED</Text>
          <Text style={styles.statValue}>7</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>EARNED</Text>
          <Text style={[styles.statValue, { color: colors.acc }]}>₹250</Text>
        </View>
      </View>

      <SectionLabel>YOUR INVITES</SectionLabel>
      <View style={{ gap: 8 }}>
        {INVITES.map((i) => (
          <View key={i.name} style={styles.inviteRow}>
            <Text style={styles.inviteName}>{i.name}</Text>
            <Text style={[styles.inviteStatus, { color: i.status.startsWith('PAID') ? colors.acc : colors.muted }]}>
              {i.status}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, letterSpacing: -0.7, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.displayReg, fontSize: 13, lineHeight: 20, color: colors.muted, marginBottom: 22 },
  codeCard: { borderRadius: radii.xl, padding: 22, borderWidth: 1, borderColor: 'rgba(124,92,255,0.3)', marginBottom: 14 },
  codeLabel: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 2, color: colors.purpleLight },
  codeValue: { fontFamily: fonts.monoBold, fontSize: 30, letterSpacing: 1, color: colors.text, marginTop: 10 },
  codeActions: { flexDirection: 'row', gap: 9, marginTop: 18 },
  copyBtn: { flex: 1, alignItems: 'center', padding: 13, borderRadius: 13, backgroundColor: colors.purple },
  copyBtnText: { fontFamily: fonts.display, fontSize: 12, color: colors.bg },
  shareBtn: { flex: 1, alignItems: 'center', padding: 13, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  shareBtnText: { fontFamily: fonts.display, fontSize: 12, color: colors.text },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  statCard: { flex: 1, borderRadius: radii.md, padding: 16, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderFaint },
  statLabel: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 1.5, color: colors.muted },
  statValue: { fontFamily: fonts.monoBold, fontSize: 24, color: colors.text, marginTop: 8 },
  inviteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, paddingHorizontal: 15, borderRadius: radii.md, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  inviteName: { fontFamily: fonts.displayMed, fontSize: 13, color: colors.text },
  inviteStatus: { fontFamily: fonts.monoSemi, fontSize: 11, letterSpacing: 0.5 },
});
