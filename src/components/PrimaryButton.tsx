import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, disabled, variant = 'solid', style }: Props) {
  const solid = variant === 'solid' && !disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        solid ? styles.solid : styles.outline,
        disabled && styles.disabled,
        pressed && !disabled && { transform: [{ scale: 0.985 }] },
        style,
      ]}
    >
      <Text style={[styles.label, { color: solid ? colors.accDeep : disabled ? colors.muted : colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 17,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: { backgroundColor: colors.acc },
  outline: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  disabled: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  label: { fontFamily: fonts.display, fontSize: 15, letterSpacing: 0.2 },
});
