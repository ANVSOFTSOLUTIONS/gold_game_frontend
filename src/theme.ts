export const colors = {
  acc: '#E8845C',
  accHover: '#F2A67E',
  accDeep: '#3A1B0E',
  gold: '#E8B14C',
  muted: '#8A90A2',
  red: '#FF5A36',
  purple: '#7C5CFF',
  purpleLight: '#C6B8FF',

  bg: '#0B0C10',
  card: '#14161C',
  card2: '#101218',
  text: '#F2F4F8',
  textDim: '#C9CEDB',
  faint: '#5C6273',

  border: 'rgba(255,255,255,0.08)',
  borderSoft: 'rgba(255,255,255,0.055)',
  borderFaint: 'rgba(255,255,255,0.06)',
  divider: 'rgba(255,255,255,0.07)',
};

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  displayMed: 'SpaceGrotesk_500Medium',
  displayReg: 'SpaceGrotesk_400Regular',
  mono: 'JetBrainsMono_400Regular',
  monoMed: 'JetBrainsMono_500Medium',
  monoSemi: 'JetBrainsMono_600SemiBold',
  monoBold: 'JetBrainsMono_700Bold',
};

// One distinct color pair per pick (1-9) — [base, light] — used to tint the
// number grid so each pick reads as its own color, not just on/off.
export const numberColors: Record<number, [string, string]> = {
  1: ['#FF6B6B', '#FF9E9E'],
  2: ['#FFA94D', '#FFCB8A'],
  3: ['#FFD43B', '#FFE382'],
  4: ['#69DB7C', '#9AE8A8'],
  5: ['#38D9A9', '#7CE9C8'],
  6: ['#4DABF7', '#8BC8FA'],
  7: ['#748FFC', '#A6B7FD'],
  8: ['#DA77F2', '#E7A9F7'],
  9: ['#F783AC', '#FAAEC7'],
  0: ['#ADB5BD', '#E9ECEF'],
};

export const radii = {
  sm: 11,
  md: 15,
  lg: 18,
  xl: 20,
  xxl: 24,
  pill: 999,
};

export const spacing = {
  screenH: 22,
};

export const shadows = {
  glowAcc: {
    shadowColor: '#E8845C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  glowRed: {
    shadowColor: '#FF5A36',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
};
