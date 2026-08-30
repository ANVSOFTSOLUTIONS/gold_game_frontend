import { create } from 'zustand';
import { api, ApiError } from '../api/client';

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
  | 'admin'
  | 'loans';

export type AuthMode = 'login' | 'signup';
export type PayMethod = 'upi' | 'card' | 'net';
export type BoardTab = 'today' | 'week' | 'all';

export type AdminConfigKey = 'round' | 'payout' | 'minStake' | 'maxStake' | 'rake' | 'autoPay';

const parsePayoutMultiplier = (v: string) => parseFloat(v.replace('×', ''));

export interface Txn {
  label: string;
  when: string;
  amt: string;
  positive: boolean;
  gold?: boolean;
}

interface MyBet {
  roundId: number;
  picks: number[];
  stake: number;
}

interface WalletOut {
  balance: number;
  playable: number;
  withdrawable: number;
  points: number;
  streak: number;
}

interface TransactionOut {
  id: number;
  type: string;
  label: string;
  amount: number;
  positive: boolean;
  created_at: string;
}

interface RoundOut {
  id: number;
  status: 'open' | 'drawn';
  seconds_remaining: number;
  drawn_number: number | null;
}

interface OtpResponse {
  message: string;
  dev_otp: string | null;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

function formatRelative(iso: string): string {
  const withZone = /[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`;
  const diffMs = Date.now() - new Date(withZone).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

interface GameState {
  screen: Screen;
  authMode: AuthMode;
  authed: boolean;
  token: string | null;
  authBusy: boolean;
  authError: string | null;
  authStage: 'form' | 'otp';
  pendingMobile: string;
  devOtpHint: string | null;

  balance: number;
  playable: number;
  withdrawable: number;
  points: number;
  streak: number;
  walletBusy: boolean;

  picks: number[];
  stake: number;
  t: number;
  phase: 'open' | 'drawn';
  drawn: number | null;
  showResult: boolean;
  roundId: number;
  lastDraws: number[];
  myBet: MyBet | null;
  gameError: string | null;

  addAmount: number;
  wdAmount: number;
  payMethod: PayMethod;

  boardTab: BoardTab;

  txns: Txn[];

  // Loans is a standalone demo ledger — not yet wired to the real backend
  // wallet, so it deliberately never touches `balance`/`playable` directly.
  loanBalance: number;
  loanLimit: number;
  takeLoan: (amount: number) => void;
  repayLoan: (amount: number) => void;

  roundLen: number;
  payoutMultiplier: number;
  cfg: Record<AdminConfigKey, string>;
  setConfig: (key: AdminConfigKey, value: string) => void;

  go: (screen: Screen) => void;
  togglePick: (n: number) => void;
  setStake: (v: number) => void;
  placeBet: () => Promise<void>;
  tick: () => Promise<void>;
  nextRound: () => void;
  refreshWallet: () => Promise<void>;

  setAddAmount: (v: number) => void;
  confirmAdd: () => Promise<void>;
  setWdAmount: (v: number) => void;
  confirmWithdraw: () => Promise<void>;
  setPayMethod: (m: PayMethod) => void;

  toggleAuthMode: () => void;
  requestAuthOtp: (fullName: string, mobile: string) => Promise<void>;
  verifyAuthOtp: (code: string) => Promise<void>;
  resendAuthOtp: () => Promise<void>;
  cancelOtp: () => void;
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
  token: null,
  authBusy: false,
  authError: null,
  authStage: 'form',
  pendingMobile: '',
  devOtpHint: null,

  balance: 0,
  playable: 0,
  withdrawable: 0,
  points: 0,
  streak: 0,
  walletBusy: false,

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
  roundId: 0,
  lastDraws: [],
  myBet: null,
  gameError: null,

  addAmount: 500,
  wdAmount: 500,
  payMethod: 'upi',

  boardTab: 'today',

  txns: [],

  loanBalance: 0,
  loanLimit: 5000,

  go: (screen) => {
    const { authed } = get();
    if ((screen === 'game' || screen === 'wallet' || screen === 'admin') && !authed) {
      set({ screen: 'auth' });
      return;
    }
    set({ screen });
  },

  togglePick: (n) =>
    set((s) => ({
      picks: s.picks.includes(n) ? s.picks.filter((x) => x !== n) : [...s.picks, n],
    })),

  setStake: (v) => set({ stake: v }),

  placeBet: async () => {
    const s = get();
    const total = s.picks.length * s.stake;
    const placeable = s.picks.length > 0 && total <= s.balance;
    if (!placeable || !s.token || s.walletBusy) return;
    set({ walletBusy: true, gameError: null });
    try {
      await api.post('/game/bets', { picks: s.picks, stake: s.stake }, s.token);
      await get().refreshWallet();
      set({ myBet: { roundId: s.roundId, picks: s.picks, stake: s.stake } });
    } catch (e) {
      set({ gameError: e instanceof ApiError ? e.message : 'Could not place bet' });
    } finally {
      set({ walletBusy: false });
    }
  },

  // Polled roughly once a second by useGameTimer whenever the timer is on
  // screen. The backend runs the actual round clock and draw — this just
  // mirrors that shared state locally instead of simulating it.
  tick: async () => {
    const s = get();
    if ((s.screen !== 'game' && s.screen !== 'home') || !s.token) return;
    try {
      const round = await api.get<RoundOut>('/game/current-round');
      const prevRoundId = s.roundId;

      let lastDraws = s.lastDraws;
      if (prevRoundId !== 0 && round.id !== prevRoundId) {
        const ld = await api.get<{ draws: number[] }>('/game/last-draws');
        lastDraws = ld.draws;
        const drawnNumber = lastDraws[0] ?? null;
        const myBet = s.myBet;
        if (myBet && myBet.roundId === prevRoundId && drawnNumber !== null) {
          get().refreshWallet();
          set({ drawn: drawnNumber, showResult: true });
        }
      }

      set({
        roundId: round.id,
        t: round.seconds_remaining,
        phase: round.status,
        lastDraws,
      });
    } catch {
      // Network hiccup — just skip this tick, next one will resync.
    }
  },

  nextRound: () => set({ showResult: false, picks: [], drawn: null, myBet: null }),

  refreshWallet: async () => {
    const s = get();
    if (!s.token) return;
    try {
      const wallet = await api.get<WalletOut>('/wallet', s.token);
      const txns = await api.get<TransactionOut[]>('/wallet/transactions?limit=20', s.token);
      set({
        balance: wallet.balance,
        playable: wallet.playable,
        withdrawable: wallet.withdrawable,
        points: wallet.points,
        streak: wallet.streak,
        txns: txns.map((t) => ({
          label: t.label,
          when: formatRelative(t.created_at),
          amt: `${t.positive ? '+' : '−'}₹${money(t.amount)}`,
          positive: t.positive,
          gold: t.type === 'referral_bonus',
        })),
      });
    } catch {
      // keep last known values on failure
    }
  },

  setAddAmount: (v) => set({ addAmount: v }),
  confirmAdd: async () => {
    const s = get();
    if (!s.token || s.walletBusy) return;
    set({ walletBusy: true });
    try {
      await api.post('/wallet/add', { amount: s.addAmount }, s.token);
      await get().refreshWallet();
      set({ screen: 'wallet' });
    } catch {
      // TODO: surface this to the user once AddMoneyScreen has an error state
    } finally {
      set({ walletBusy: false });
    }
  },

  setWdAmount: (v) => set({ wdAmount: v }),
  confirmWithdraw: async () => {
    const s = get();
    if (!s.token || s.walletBusy) return;
    set({ walletBusy: true });
    try {
      const amt = Math.min(s.wdAmount, s.withdrawable);
      await api.post('/wallet/withdraw', { amount: amt }, s.token);
      await get().refreshWallet();
      set({ screen: 'wallet' });
    } catch {
      // TODO: surface this to the user once WithdrawScreen has an error state
    } finally {
      set({ walletBusy: false });
    }
  },

  setPayMethod: (m) => set({ payMethod: m }),

  toggleAuthMode: () =>
    set((s) => ({
      authMode: s.authMode === 'login' ? 'signup' : 'login',
      authError: null,
      authStage: 'form',
    })),

  requestAuthOtp: async (fullName, mobile) => {
    const s = get();
    if (s.authBusy) return;
    set({ authBusy: true, authError: null });
    try {
      const otpResp =
        s.authMode === 'signup'
          ? await api.post<OtpResponse>('/auth/signup', { full_name: fullName, mobile })
          : await api.post<OtpResponse>('/auth/request-otp', { mobile });
      set({
        authBusy: false,
        authStage: 'otp',
        pendingMobile: mobile,
        devOtpHint: otpResp.dev_otp,
      });
    } catch (e) {
      set({
        authBusy: false,
        authError: e instanceof Error ? e.message : 'Something went wrong, please try again',
      });
    }
  },

  verifyAuthOtp: async (code) => {
    const s = get();
    if (s.authBusy) return;
    set({ authBusy: true, authError: null });
    try {
      const tokenResp = await api.post<TokenResponse>('/auth/verify-otp', { mobile: s.pendingMobile, code });
      set({
        token: tokenResp.access_token,
        authed: true,
        screen: 'game',
        authBusy: false,
        authStage: 'form',
        devOtpHint: null,
      });
      await get().refreshWallet();
    } catch (e) {
      set({
        authBusy: false,
        authError: e instanceof Error ? e.message : 'Incorrect code, please try again',
      });
    }
  },

  resendAuthOtp: async () => {
    const s = get();
    if (s.authBusy || !s.pendingMobile) return;
    set({ authBusy: true, authError: null });
    try {
      const otpResp =
        s.authMode === 'signup'
          ? await api.post<OtpResponse>('/auth/signup', { full_name: '', mobile: s.pendingMobile })
          : await api.post<OtpResponse>('/auth/request-otp', { mobile: s.pendingMobile });
      set({ authBusy: false, devOtpHint: otpResp.dev_otp });
    } catch (e) {
      set({
        authBusy: false,
        authError: e instanceof Error ? e.message : 'Could not resend the code',
      });
    }
  },

  cancelOtp: () => set({ authStage: 'form', authError: null, devOtpHint: null }),

  logout: () =>
    set({
      authed: false,
      token: null,
      authStage: 'form',
      pendingMobile: '',
      devOtpHint: null,
      screen: 'onboard',
      authMode: 'login',
      balance: 0,
      playable: 0,
      withdrawable: 0,
      points: 0,
      streak: 0,
      txns: [],
      myBet: null,
      picks: [],
    }),
  goSignup: () => set({ screen: 'auth', authMode: 'signup', authError: null, authStage: 'form' }),
  goLogin: () => set({ screen: 'auth', authMode: 'login', authError: null, authStage: 'form' }),

  setBoardTab: (t) => set({ boardTab: t }),

  setConfig: (key, value) =>
    set((s) => {
      const cfg = { ...s.cfg, [key]: value };
      if (key === 'payout') return { cfg, payoutMultiplier: parsePayoutMultiplier(value) };
      return { cfg };
    }),

  redeem: (cost, ok) => {
    if (!ok) return;
    set((s) => ({ points: Math.max(0, s.points - cost) }));
  },

  takeLoan: (amount) =>
    set((s) => {
      const room = s.loanLimit - s.loanBalance;
      const amt = Math.min(amount, room);
      if (amt <= 0) return s;
      return { loanBalance: s.loanBalance + amt };
    }),
  repayLoan: (amount) =>
    set((s) => ({ loanBalance: Math.max(0, s.loanBalance - amount) })),
}));

export const money = (n: number) => n.toLocaleString('en-IN');
