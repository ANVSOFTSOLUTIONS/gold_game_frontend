import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../theme';

const SIZE = 126;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function TimerRing({ t, phaseLabel }: { t: number; phaseLabel: string }) {
  const progress = Math.max(0, Math.min(1, t / 60));
  const dashOffset = CIRC * (1 - progress);
  const clock = `0:${String(t).padStart(2, '0')}`;

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
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
          stroke={colors.acc}
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
        <Text style={styles.clock}>{clock}</Text>
        <Text style={styles.phase}>{phaseLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  inner: {
    width: SIZE - 20,
    height: SIZE - 20,
    borderRadius: (SIZE - 20) / 2,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: { fontFamily: fonts.monoBold, fontSize: 30, letterSpacing: -1, color: colors.text },
  phase: { fontFamily: fonts.monoSemi, fontSize: 9, letterSpacing: 1.8, color: colors.muted, marginTop: 2 },
});
