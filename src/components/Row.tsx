import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: object;
}

export default function Row({ title, subtitle, right, onPress, style, titleStyle }: Props) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={[styles.row, style]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    paddingHorizontal: 15,
    borderRadius: radii.md,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  title: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.text },
  subtitle: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 3 },
});
