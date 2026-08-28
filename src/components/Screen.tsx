import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface Props {
  children: React.ReactNode;
  withNav?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function Screen({ children, withNav = true, style, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, style]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 18,
            paddingBottom: (withNav ? 96 : 24) + insets.bottom,
          },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 22 },
});
