import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';

const NOTIFS = [
  { title: 'You won ₹450', body: 'Round #4126 drew 7. Credited to your wallet.', when: '2 min ago', unread: true },
  { title: 'Round #4127 is open', body: 'Bets close in under a minute.', when: 'just now', unread: true },
  { title: 'Anita joined with your code', body: '₹50 referral bonus added to your wallet.', when: '4 days ago', unread: false },
  { title: 'Withdrawal completed', body: '₹800 sent to rahul@okaxis.', when: '2 days ago', unread: false },
  { title: 'Complete your KYC', body: 'Raise your daily withdrawal limit to ₹25,000.', when: '1 week ago', unread: false },
];

export default function NotifScreen() {
  const go = useGameStore((s) => s.go);

  return (
    <Screen>
      <BackButton onPress={() => go('home')} style={{ marginBottom: 18 }} />
      <Text style={styles.title}>Notifications</Text>

      <View style={{ gap: 8 }}>
        {NOTIFS.map((n, i) => (
          <View
            key={i}
            style={[styles.row, { backgroundColor: n.unread ? 'rgba(0,229,160,0.06)' : colors.card2, borderColor: n.unread ? 'rgba(0,229,160,0.22)' : colors.borderSoft }]}
          >
            <View style={[styles.dot, { backgroundColor: n.unread ? colors.acc : 'rgba(255,255,255,0.15)' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.notifTitle}>{n.title}</Text>
              <Text style={styles.notifBody}>{n.body}</Text>
              <Text style={styles.notifWhen}>{n.when}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 18 },
  row: { flexDirection: 'row', gap: 13, padding: 15, borderRadius: radii.lg, borderWidth: 1 },
  dot: { width: 7, height: 7, borderRadius: 3.5, marginTop: 6 },
  notifTitle: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.text },
  notifBody: { fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 17, color: colors.muted, marginTop: 4 },
  notifWhen: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.faint, marginTop: 7 },
});
