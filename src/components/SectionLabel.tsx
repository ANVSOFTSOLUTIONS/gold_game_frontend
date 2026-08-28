import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fonts } from '../theme';

export default function SectionLabel({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.monoSemi,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.muted,
    marginBottom: 12,
  },
});
