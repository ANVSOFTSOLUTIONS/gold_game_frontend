import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts, shadows } from '../theme';

const SIZE = 132;
const STROKE = 11;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function TimerRing({ t, total, phaseLabel }: { t: number; total: number; phaseLabel: string }) {
  const progress = Math.max(0, Math.min(1, t / total));
  const dashOffset = CIRC * (1 - progress);
  const mins = Math.floor(t / 60);
  const secs = t % 60;
  const clock = `${mins}:${String(secs).padStart(2, '0')}`;
  const urgent = t > 0 && t <= 10;

  return (
    <View style={[styles.wrap, urgent ? shadows.glowRed : shadows.glowAcc]}>
      <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={urgent ? colors.red : colors.acc} />
            <Stop offset="100%" stopColor={urgent ? '#FF9466' : colors.accHover} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="url(#ring)"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
          rotation={-90}
        />
      </Svg>
      <View style={styles.inner}>
        <Text style={[styles.clock, urgent && { color: colors.red }]}>{clock}</Text>
        <Text style={[styles.phase, urgent && { color: colors.red }]}>{phaseLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center', borderRadius: SIZE / 2 },
  inner: {
    width: SIZE - 22,
    height: SIZE - 22,
    borderRadius: (SIZE - 22) / 2,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: { fontFamily: fonts.monoBold, fontSize: 32, letterSpacing: -1, color: colors.text },
  phase: { fontFamily: fonts.monoSemi, fontSize: 9, letterSpacing: 1.8, color: colors.muted, marginTop: 2 },
});
