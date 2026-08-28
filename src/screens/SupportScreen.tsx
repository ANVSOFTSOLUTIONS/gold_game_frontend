import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import SectionLabel from '../components/SectionLabel';

const LIMITS = [
  { label: 'Daily deposit cap', value: '₹5,000', color: colors.textDim },
  { label: 'Daily loss limit', value: 'NOT SET', color: colors.gold },
  { label: 'Session reminder', value: 'EVERY 30 MIN', color: colors.textDim },
  { label: 'Self-exclude', value: 'PAUSE 30 DAYS', color: colors.red },
];

const FAQS = [
  {
    q: 'How is the winning number chosen?',
    a: 'Draws are seeded server-side and hashed before the round opens. The seed is published after the draw so anyone can verify it.',
  },
  {
    q: 'When does my withdrawal arrive?',
    a: 'Withdrawals settle in about 2 hours once approved. Verified accounts under the auto-approve threshold are instant.',
  },
  {
    q: 'Why do I need KYC?',
    a: 'KYC raises your daily withdrawal limit from ₹2,000 to ₹25,000 and is required once before larger payouts.',
  },
  {
    q: 'Can I cancel a bet after placing it?',
    a: 'No — once a bet is placed for the current round it is locked in until the draw completes.',
  },
];

export default function SupportScreen() {
  const go = useGameStore((s) => s.go);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <Screen>
      <BackButton onPress={() => go('profile')} style={{ marginBottom: 18 }} />
      <Text style={styles.title}>Help & limits</Text>

      <View style={styles.warnBox}>
        <Text style={styles.warnTitle}>Take control of your play</Text>
        <Text style={styles.warnBody}>
          Set a daily deposit cap, a loss limit, or pause your account for 30 days. Changes apply immediately.
        </Text>
      </View>

      <View style={{ gap: 8, marginBottom: 22 }}>
        {LIMITS.map((l) => (
          <View key={l.label} style={styles.row}>
            <Text style={styles.rowLabel}>{l.label}</Text>
            <Text style={[styles.rowValue, { color: l.color }]}>{l.value}</Text>
          </View>
        ))}
      </View>

      <SectionLabel>COMMON QUESTIONS</SectionLabel>
      <View style={{ gap: 8, marginBottom: 22 }}>
        {FAQS.map((f, i) => {
          const open = openIdx === i;
          return (
            <Pressable key={f.q} style={styles.faqRow} onPress={() => setOpenIdx(open ? null : i)}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQ}>{f.q}</Text>
                <Text style={styles.faqIcon}>{open ? '−' : '+'}</Text>
              </View>
              {open && <Text style={styles.faqA}>{f.a}</Text>}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.chatBtn} onPress={() => {}}>
          <Text style={styles.chatBtnText}>CHAT WITH US</Text>
        </Pressable>
        <Pressable style={styles.emailBtn} onPress={() => Linking.openURL('mailto:support@ninebox.in')}>
          <Text style={styles.emailBtnText}>EMAIL SUPPORT</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 20 },
  warnBox: { borderRadius: radii.lg, padding: 18, backgroundColor: 'rgba(255,90,54,0.08)', borderWidth: 1, borderColor: 'rgba(255,90,54,0.26)', marginBottom: 20 },
  warnTitle: { fontFamily: fonts.displaySemi, fontSize: 13, color: '#FF8B6E' },
  warnBody: { fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 18, color: '#B99184', marginTop: 5 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: radii.md, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  rowLabel: { fontFamily: fonts.displayMed, fontSize: 13, color: colors.text },
  rowValue: { fontFamily: fonts.monoSemi, fontSize: 12 },
  faqRow: { padding: 15, borderRadius: radii.md, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  faqQ: { flex: 1, fontFamily: fonts.displayMed, fontSize: 12.5, lineHeight: 17, color: colors.textDim },
  faqIcon: { fontFamily: fonts.monoSemi, fontSize: 15, color: colors.faint },
  faqA: { fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 18, color: colors.muted, marginTop: 10 },
  actionsRow: { flexDirection: 'row', gap: 9 },
  chatBtn: { flex: 1, alignItems: 'center', padding: 15, borderRadius: radii.lg, backgroundColor: colors.acc },
  chatBtnText: { fontFamily: fonts.display, fontSize: 12.5, color: colors.accDeep },
  emailBtn: { flex: 1, alignItems: 'center', padding: 15, borderRadius: radii.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  emailBtnText: { fontFamily: fonts.display, fontSize: 12.5, color: colors.text },
});
