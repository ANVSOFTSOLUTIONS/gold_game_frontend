import { create } from 'zustand';

export type Screen =
  | 'onboard'
  | 'auth'
  | 'home'
  | 'game'
  | 'wallet'
  | 'add'
  | 'withdraw'
  | 'rewards'
  | 'profile'
  | 'history'
  | 'leaderboard'
  | 'referral'
  | 'kyc'
  | 'notif'
  | 'support'
  | 'admin';

export type AuthMode = 'login' | 'signup';
export type PayMethod = 'upi' | 'card' | 'net';
export type BoardTab = 'today' | 'week' | 'all';

export type AdminConfigKey = 'round' | 'payout' | 'minStake' | 'maxStake' | 'rake' | 'autoPay';

const ROUND_SECONDS: Record<string, number> = { '30s': 30, '60s': 60, '3m': 180, '30m': 1800 };
const parsePayoutMultiplier = (v: string) => parseFloat(v.replace('×', ''));

export interface Txn {
  label: string;
  when: string;
  amt: string;
  positive: boolean;
  gold?: boolean;
}

interface GameState {
  screen: Screen;
  authMode: AuthMode;
  authed: boolean;

  balance: number;
  playable: number;
  withdrawable: number;
  points: number;
  streak: number;

  picks: number[];
  stake: number;
  t: number;
  phase: 'open' | 'drawn';
  drawn: number | null;
  showResult: boolean;
  roundId: number;
  lastDraws: number[];

  addAmount: number;
  wdAmount: number;
  payMethod: PayMethod;

  boardTab: BoardTab;

  txns: Txn[];

  roundLen: number;
  payoutMultiplier: number;
  cfg: Record<AdminConfigKey, string>;
  setConfig: (key: AdminConfigKey, value: string) => void;

  go: (screen: Screen) => void;
  togglePick: (n: number) => void;
  setStake: (v: number) => void;
  placeBet: () => void;
  tick: () => void;
  nextRound: () => void;

  setAddAmount: (v: number) => void;
  confirmAdd: () => void;
  setWdAmount: (v: number) => void;
  confirmWithdraw: () => void;
  setPayMethod: (m: PayMethod) => void;

  toggleAuthMode: () => void;
  doAuth: () => void;
  logout: () => void;
  goSignup: () => void;
  goLogin: () => void;

  setBoardTab: (t: BoardTab) => void;
  redeem: (cost: number, ok: boolean) => void;
}

const ROUND_LEN = 1800;

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'onboard',
  authMode: 'login',
  authed: false,

  balance: 1240,
  playable: 940,
  withdrawable: 300,
  points: 2380,
  streak: 3,

  picks: [],
  stake: 50,
  t: ROUND_LEN,
  roundLen: ROUND_LEN,
  payoutMultiplier: 9,
  cfg: {
    round: '30m',
    payout: '9×',
    minStake: '₹10',
    maxStake: '₹500',
    rake: '4%',
    autoPay: '₹5,000',
  },
  phase: 'open',
  drawn: null,
  showResult: false,
  roundId: 4127,
  lastDraws: [7, 3, 9, 1, 4, 6],

  addAmount: 500,
  wdAmount: 500,
  payMethod: 'upi',

  boardTab: 'today',

  txns: [
    { label: 'Round #4126 · won on 7', when: '2 min ago', amt: '+₹450', positive: true },
    { label: 'Bet placed · 3 numbers', when: '3 min ago', amt: '−₹150', positive: false },
    { label: 'Added money · UPI', when: 'Yesterday', amt: '+₹1,000', positive: true },
    { label: 'Withdrawal · rahul@okaxis', when: '2 days ago', amt: '−₹800', positive: false },
    { label: 'Referral bonus · Anita', when: '4 days ago', amt: '+₹50', positive: true, gold: true },
  ],

  go: (screen) => {
    const { authed } = get();
    if ((screen === 'game' || screen === 'wallet' || screen === 'admin') && !authed) {
      set({ screen: 'auth' });
      return;
    }
    set((s) => ({ screen, t: screen === 'game' ? s.roundLen : s.t }));
  },

  togglePick: (n) =>
    set((s) => ({
      picks: s.picks.includes(n) ? s.picks.filter((x) => x !== n) : [...s.picks, n],
    })),

  setStake: (v) => set({ stake: v }),

  placeBet: () => {
    const s = get();
    const total = s.picks.length * s.stake;
    const placeable = s.picks.length > 0 && total <= s.balance;
    if (!placeable) return;
    set({ balance: s.balance - total, playable: Math.max(0, s.playable - total) });
  },

  tick: () => {
    const s = get();
    if (s.screen !== 'game' || s.showResult) return;
    if (s.t <= 1) {
      draw(set, get);
      return;
    }
    set({ t: s.t - 1 });
  },

  nextRound: () =>
    set((s) => ({
      showResult: false,
      picks: [],
      t: s.roundLen,
      drawn: null,
      roundId: s.roundId + 1,
      phase: 'open',
    })),

  setAddAmount: (v) => set({ addAmount: v }),
  confirmAdd: () =>
    set((s) => ({
      balance: s.balance + s.addAmount,
      playable: s.playable + s.addAmount,
      screen: 'wallet',
    })),

  setWdAmount: (v) => set({ wdAmount: v }),
  confirmWithdraw: () =>
    set((s) => {
      const amt = Math.min(s.wdAmount, s.withdrawable);
      return {
        balance: Math.max(0, s.balance - amt),
        withdrawable: Math.max(0, s.withdrawable - s.wdAmount),
        screen: 'wallet',
      };
    }),

  setPayMethod: (m) => set({ payMethod: m }),

  toggleAuthMode: () => set((s) => ({ authMode: s.authMode === 'login' ? 'signup' : 'login' })),
  doAuth: () => set((s) => ({ authed: true, screen: 'game', t: s.roundLen })),
  logout: () => set({ authed: false, screen: 'onboard', authMode: 'login' }),
  goSignup: () => set({ screen: 'auth', authMode: 'signup' }),
  goLogin: () => set({ screen: 'auth', authMode: 'login' }),

  setBoardTab: (t) => set({ boardTab: t }),

  setConfig: (key, value) =>
    set((s) => {
      const cfg = { ...s.cfg, [key]: value };
      if (key === 'round') return { cfg, roundLen: ROUND_SECONDS[value] ?? s.roundLen };
      if (key === 'payout') return { cfg, payoutMultiplier: parsePayoutMultiplier(value) };
      return { cfg };
    }),

  redeem: (cost, ok) => {
    if (!ok) return;
    set((s) => ({ points: Math.max(0, s.points - cost) }));
  },
}));

function draw(set: (partial: Partial<GameState>) => void, get: () => GameState) {
  const s = get();
  const n = 1 + Math.floor(Math.random() * 9);
  const hit = s.picks.includes(n);
  const win = hit ? s.stake * s.payoutMultiplier : 0;
  set({
    drawn: n,
    showResult: true,
    phase: 'drawn',
    balance: s.balance + win,
    withdrawable: s.withdrawable + win,
    points: s.points + 10 + (hit ? 100 : 0),
    streak: hit ? s.streak + 1 : 0,
    lastDraws: [n, ...s.lastDraws].slice(0, 6),
  });
}

export const money = (n: number) => n.toLocaleString('en-IN');
