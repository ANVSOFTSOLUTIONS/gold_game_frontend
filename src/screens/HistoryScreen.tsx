import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import Screen from '../components/Screen';
import SectionLabel from '../components/SectionLabel';

const STATS = [
  { v: '318', k: 'ROUNDS', color: colors.text },
  { v: '41', k: 'WINS', color: colors.acc },
  { v: '₹14,220', k: 'LIFETIME', color: colors.gold },
];

const ROUNDS = [
  { id: '4126', drawn: 7, picked: '3 · 7', stake: '100', when: '2 min ago', amt: '+₹450', hit: true },
  { id: '4125', drawn: 2, picked: '5', stake: '50', when: '3 min ago', amt: '−₹50', hit: false },
  { id: '4124', drawn: 9, picked: '9', stake: '50', when: '4 min ago', amt: '+₹450', hit: true },
  { id: '4123', drawn: 1, picked: '4 · 6', stake: '100', when: '6 min ago', amt: '−₹100', hit: false },
  { id: '4122', drawn: 4, picked: '8', stake: '10', when: '7 min ago', amt: '−₹10', hit: false },
  { id: '4121', drawn: 6, picked: '2 · 6', stake: '50', when: '8 min ago', amt: '+₹450', hit: true },
];

export default function HistoryScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Results</Text>

      <View style={styles.statsRow}>
        {STATS.map((s) => (
          <View key={s.k} style={styles.statCard}>
            <Text style={[styles.statV, { color: s.color }]}>{s.v}</Text>
            <Text style={styles.statK}>{s.k}</Text>
          </View>
        ))}
      </View>

      <SectionLabel>YOUR ROUNDS</SectionLabel>
      <View style={{ gap: 8 }}>
        {ROUNDS.map((r) => (
          <View key={r.id} style={styles.roundRow}>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: r.hit ? 'rgba(0,229,160,0.14)' : colors.card,
                  borderColor: r.hit ? 'rgba(0,229,160,0.4)' : colors.border,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: r.hit ? colors.acc : colors.textDim }]}>{r.drawn}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.roundTitle}>#{r.id} · picked {r.picked}</Text>
              <Text style={styles.roundMeta}>{r.when} · ₹{r.stake} staked</Text>
            </View>
            <Text style={[styles.roundAmt, { color: r.hit ? colors.acc : colors.muted }]}>{r.amt}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 18 },
  statsRow: { flexDirection: 'row', gap: 9, marginBottom: 22 },
  statCard: { flex: 1, borderRadius: radii.md, padding: 15, paddingHorizontal: 13, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderFaint },
  statV: { fontFamily: fonts.monoBold, fontSize: 19 },
  statK: { fontFamily: fonts.monoMed, fontSize: 9, letterSpacing: 1.2, color: colors.muted, marginTop: 6 },
  roundRow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 13, paddingHorizontal: 14, borderRadius: radii.md, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  chip: { width: 38, height: 38, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  chipText: { fontFamily: fonts.monoBold, fontSize: 16 },
  roundTitle: { fontFamily: fonts.displaySemi, fontSize: 12.5, color: colors.text },
  roundMeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 3 },
  roundAmt: { fontFamily: fonts.monoSemi, fontSize: 13 },
});
