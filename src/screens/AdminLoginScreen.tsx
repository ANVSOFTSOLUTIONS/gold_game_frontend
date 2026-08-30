import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme';
import { useGameStore } from '../store/useGameStore';
import PrimaryButton from '../components/PrimaryButton';

export default function AdminLoginScreen() {
  const insets = useSafeAreaInsets();
  const go = useGameStore((s) => s.go);
  const loginAdmin = useGameStore((s) => s.loginAdmin);
  const adminLoginError = useGameStore((s) => s.adminLoginError);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = username.trim().length > 0 && password.length > 0;

  return (
    <LinearGradient colors={['#1A1420', colors.bg]} style={styles.root} locations={[0, 0.7]}>
      <View style={{ paddingTop: insets.top + 34, paddingHorizontal: 26, paddingBottom: 40, flex: 1 }}>
        <Pressable onPress={() => go('profile')} hitSlop={10} style={{ marginBottom: 22 }}>
          <Text style={styles.backLink}>← Back</Text>
        </Pressable>

        <View style={styles.logo}>
          <Text style={styles.logoText}>⚑</Text>
        </View>

        <Text style={styles.title}>Super admin</Text>
        <Text style={styles.sub}>Restricted area. Staff credentials only.</Text>

        <View style={{ marginBottom: 14 }}>
          <Text style={styles.fieldLabel}>USERNAME</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="admin"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            style={styles.textField}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.textField}
          />
        </View>

        {adminLoginError && <Text style={styles.errorText}>{adminLoginError}</Text>}

        <PrimaryButton label="LOG IN" onPress={() => loginAdmin(username, password)} disabled={!canSubmit} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backLink: { fontFamily: fonts.displayMed, fontSize: 13, color: colors.muted },
  logo: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  logoText: { fontSize: 22, color: colors.bg },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 33, letterSpacing: -1, color: colors.text, marginBottom: 8 },
  sub: { fontFamily: fonts.displayReg, fontSize: 14, lineHeight: 21, color: colors.muted, marginBottom: 30 },
  fieldLabel: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 1.8, color: colors.muted, marginBottom: 8 },
  textField: {
    padding: 16,
    borderRadius: radii.md,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fonts.displayMed,
    fontSize: 15,
    color: colors.text,
  },
  errorText: { fontFamily: fonts.displayReg, fontSize: 12.5, lineHeight: 18, color: colors.red, marginBottom: 14 },
});
