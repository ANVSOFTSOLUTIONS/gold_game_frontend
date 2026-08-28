import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme';
import { useGameStore } from '../store/useGameStore';
import PrimaryButton from '../components/PrimaryButton';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const authMode = useGameStore((s) => s.authMode);
  const toggleAuthMode = useGameStore((s) => s.toggleAuthMode);
  const doAuth = useGameStore((s) => s.doAuth);

  const isSignup = authMode === 'signup';
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [agree, setAgree] = useState(true);
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[i] = clean;
    setOtp(next);
    if (clean && i < 3) otpRefs.current[i + 1]?.focus();
  };

  return (
    <LinearGradient colors={['#152437', colors.bg]} style={styles.root} locations={[0, 0.7]}>
      <View style={{ paddingTop: insets.top + 34, paddingHorizontal: 26, paddingBottom: 40 }}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>9</Text>
        </View>

        <Text style={styles.title}>{isSignup ? 'Create account' : 'Welcome back'}</Text>
        <Text style={styles.sub}>
          {isSignup
            ? '18+ only. Takes about thirty seconds.'
            : 'Enter your mobile number and we will text you a code.'}
        </Text>

        {isSignup && (
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Rahul Menon"
              placeholderTextColor={colors.muted}
              style={styles.textField}
            />
          </View>
        )}

        <View style={{ marginBottom: 14 }}>
          <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>
          <View style={styles.mobileField}>
            <Text style={styles.mobilePrefix}>+91</Text>
            <View style={styles.mobileDivider} />
            <TextInput
              value={mobile}
              onChangeText={(v) => setMobile(v.replace(/[^0-9]/g, '').slice(0, 10))}
              placeholder="98765 43210"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              style={styles.mobileInput}
            />
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.fieldLabel}>OTP</Text>
          <View style={styles.otpRow}>
            {otp.map((v, i) => (
              <TextInput
                key={i}
                ref={(r) => {
                  otpRefs.current[i] = r;
                }}
                value={v}
                onChangeText={(t) => setDigit(i, t)}
                keyboardType="number-pad"
                maxLength={1}
                style={[styles.otpBox, { borderColor: v ? 'rgba(0,229,160,0.45)' : colors.border }]}
              />
            ))}
          </View>
          <Text style={styles.resend}>Resend code in 0:24</Text>
        </View>

        {isSignup && (
          <Pressable style={styles.termsRow} onPress={() => setAgree((a) => !a)}>
            <View style={[styles.checkbox, { backgroundColor: agree ? colors.acc : 'transparent', borderColor: agree ? colors.acc : colors.border }]}>
              {agree && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I am 18+ and accept the terms. Play responsibly — set a deposit limit any time in Profile.
            </Text>
          </Pressable>
        )}

        <PrimaryButton
          label={isSignup ? 'CREATE ACCOUNT' : 'VERIFY & CONTINUE'}
          onPress={doAuth}
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.switchLink} onPress={toggleAuthMode}>
          {isSignup ? 'Already have an account? Log in' : 'New here? Create an account'}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.acc,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  logoText: { fontFamily: fonts.monoBold, fontSize: 24, color: colors.accDeep },
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
  mobileField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: radii.md,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: 'rgba(0,229,160,0.4)',
  },
  mobilePrefix: { fontFamily: fonts.monoSemi, fontSize: 15, color: colors.muted },
  mobileDivider: { width: 1, height: 18, backgroundColor: colors.border },
  mobileInput: { flex: 1, fontFamily: fonts.monoSemi, fontSize: 15, letterSpacing: 1, color: colors.text, padding: 0 },
  otpRow: { flexDirection: 'row', gap: 9 },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radii.md,
    backgroundColor: colors.card2,
    borderWidth: 1,
    textAlign: 'center',
    fontFamily: fonts.monoBold,
    fontSize: 22,
    color: colors.text,
  },
  resend: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted, marginTop: 10 },
  termsRow: { flexDirection: 'row', gap: 11, alignItems: 'flex-start', marginBottom: 20 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkMark: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.accDeep },
  termsText: { flex: 1, fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 17, color: colors.muted },
  switchLink: { fontFamily: fonts.displayMed, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
