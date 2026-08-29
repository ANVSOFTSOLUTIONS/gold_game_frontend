import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { BoardTab, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';

const TABS: { key: BoardTab; label: string }[] = [
  { key: 'today', label: 'TODAY' },
  { key: 'week', label: 'THIS WEEK' },
  { key: 'all', label: 'ALL TIME' },
];

const LEADERS = [
  { rank: 1, name: 'Vikram S.', initials: 'VS', wins: '22', amt: '18,900', av: '#E8B14C', me: false },
  { rank: 2, name: 'Priya N.', initials: 'PN', wins: '19', amt: '14,400', av: '#C9CEDB', me: false },
  { rank: 3, name: 'Arjun K.', initials: 'AK', wins: '17', amt: '12,150', av: '#C08A4A', me: false },
  { rank: 4, name: 'Meera D.', initials: 'MD', wins: '14', amt: '9,900', av: '#7C5CFF', me: false },
  { rank: 5, name: 'Sanjay R.', initials: 'SR', wins: '12', amt: '8,100', av: '#E8845C', me: false },
  { rank: 24, name: 'You · Rahul M.', initials: 'RM', wins: '4', amt: '1,800', av: '#E8845C', me: true },
];

export default function LeaderboardScreen() {
  const boardTab = useGameStore((s) => s.boardTab);
  const setBoardTab = useGameStore((s) => s.setBoardTab);

  return (
    <Screen>
      <Text style={styles.title}>Leaderboard</Text>
      <Text style={styles.sub}>Top winners · resets at midnight</Text>

      <View style={styles.tabsRow}>
        {TABS.map((t) => {
          const active = boardTab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setBoardTab(t.key)}
              style={[styles.tab, { backgroundColor: active ? 'rgba(232,132,92,0.14)' : colors.card, borderColor: active ? colors.acc : colors.border }]}
            >
              <Text style={[styles.tabText, { color: active ? colors.acc : colors.muted }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: 8, marginBottom: 20 }}>
        {LEADERS.map((l) => (
          <View
            key={l.rank}
            style={[styles.row, { backgroundColor: l.me ? 'rgba(232,132,92,0.08)' : colors.card2, borderColor: l.me ? 'rgba(232,132,92,0.4)' : colors.borderSoft }]}
          >
            <Text style={[styles.rank, { color: l.rank <= 3 ? colors.gold : colors.muted }]}>{l.rank}</Text>
            <View style={[styles.avatar, { backgroundColor: l.av }]}>
              <Text style={styles.avatarText}>{l.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: l.me ? colors.acc : colors.text }]}>{l.name}</Text>
              <Text style={styles.wins}>{l.wins} wins</Text>
            </View>
            <Text style={styles.amt}>₹{l.amt}</Text>
          </View>
        ))}
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Finish top 10 today and take a share of the ₹10,000 daily pool.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 5 },
  sub: { fontFamily: fonts.displayReg, fontSize: 13, color: colors.muted, marginBottom: 20 },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 13, borderWidth: 1 },
  tabText: { fontFamily: fonts.monoSemi, fontSize: 11, letterSpacing: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, paddingHorizontal: 14, borderRadius: radii.md, borderWidth: 1 },
  rank: { width: 22, fontFamily: fonts.monoBold, fontSize: 14 },
  avatar: { width: 34, height: 34, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 12, color: colors.bg },
  name: { fontFamily: fonts.displaySemi, fontSize: 13 },
  wins: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 2 },
  amt: { fontFamily: fonts.monoSemi, fontSize: 13, color: colors.acc },
  banner: { borderRadius: radii.md, padding: 15, backgroundColor: 'rgba(124,92,255,0.1)', borderWidth: 1, borderColor: 'rgba(124,92,255,0.3)' },
  bannerText: { fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 18, color: colors.purpleLight },
});
