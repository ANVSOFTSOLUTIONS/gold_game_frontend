import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { Screen, useGameStore } from '../store/useGameStore';

const ITEMS: { key: Screen; label: string }[] = [
  { key: 'home', label: 'HOME' },
  { key: 'wallet', label: 'WALLET' },
  { key: 'game', label: 'PLAY' },
  { key: 'profile', label: 'YOU' },
];

export default function BottomNav() {
  const screen = useGameStore((s) => s.screen);
  const go = useGameStore((s) => s.go);
  const insets = useSafeAreaInsets();

  if (screen === 'auth' || screen === 'onboard') return null;

  return (
    <View style={[styles.wrap, { height: 78 + insets.bottom, paddingBottom: insets.bottom }]}>
      {ITEMS.map((item) => {
        const active = screen === item.key;
        return (
          <Pressable key={item.key} style={styles.item} onPress={() => go(item.key)}>
            <View style={[styles.dot, { backgroundColor: active ? colors.acc : 'transparent' }]} />
            <Text style={[styles.label, { color: active ? colors.acc : colors.muted }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(11,12,16,0.86)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 12,
  },
  item: { flex: 1, alignItems: 'center', gap: 6, paddingTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontFamily: fonts.monoSemi, fontSize: 9.5, letterSpacing: 1.3 },
});
