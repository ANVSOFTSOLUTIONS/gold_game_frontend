import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radii } from '../theme';

export default function BackButton({ onPress, style }: { onPress: () => void; style?: object }) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, style]} hitSlop={8}>
      <Text style={styles.arrow}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: { color: colors.muted, fontFamily: fonts.monoSemi, fontSize: 14 },
});
