import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, fonts, radii } from '../theme';
import { AdminConfigKey, money, useGameStore } from '../store/useGameStore';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import SectionLabel from '../components/SectionLabel';
import Row from '../components/Row';

type AdminTab = 'overview' | 'players' | 'withdrawals' | 'settings';

const TABS: { key: AdminTab; label: string }[] = [
  { key: 'overview', label: 'OVERVIEW' },
  { key: 'players', label: 'PLAYERS' },
  { key: 'withdrawals', label: 'PAYOUTS' },
  { key: 'settings', label: 'SETTINGS' },
];

const HOUSE_EDGE = '11.1';

const KPIS = [
  { label: 'GROSS STAKED', value: '₹8.4L', delta: '+12.4% vs yesterday', color: colors.text, deltaColor: colors.acc },
  { label: 'HOUSE NET', value: '₹92,400', delta: '11.0% margin', color: colors.acc, deltaColor: colors.muted },
  { label: 'ACTIVE PLAYERS', value: '1,284', delta: '+186 new today', color: colors.text, deltaColor: colors.acc },
  { label: 'PENDING PAYOUTS', value: '₹41,200', delta: '6 need approval', color: colors.gold, deltaColor: colors.gold },
];

const EXPOSURE_RAW = [
  { n: 1, v: 62 }, { n: 2, v: 38 }, { n: 3, v: 74 }, { n: 4, v: 45 }, { n: 5, v: 88 },
  { n: 6, v: 52 }, { n: 7, v: 96 }, { n: 8, v: 33 }, { n: 9, v: 70 },
];
const EXPOSURE = EXPOSURE_RAW.map((e) => {
  const hot = e.v > 80;
  const warm = e.v > 60;
  return {
    n: e.n,
    h: e.v,
    liability: money(e.v * 90),
    barBg: hot ? colors.red : warm ? colors.gold : 'rgba(0,229,160,0.55)',
    riskColor: hot ? colors.red : warm ? colors.gold : colors.muted,
    numColor: hot ? colors.red : colors.textDim,
  };
});

const REV_BARS = [
  { d: 'M', v: 58 }, { d: 'T', v: 72 }, { d: 'W', v: 49 }, { d: 'T', v: 88 },
  { d: 'F', v: 96 }, { d: 'S', v: 78 }, { d: 'S', v: 64 },
].map((r) => ({ ...r, bg: r.v > 90 ? colors.acc : 'rgba(0,229,160,0.35)' }));

const ADMIN_ROUNDS = [
  { id: '4126', drawn: 7, players: '842', in: '58,400', net: '+₹6,140', up: true },
  { id: '4125', drawn: 2, players: '799', in: '54,100', net: '+₹9,220', up: true },
  { id: '4124', drawn: 9, players: '861', in: '61,700', net: '−₹4,300', up: false },
  { id: '4123', drawn: 1, players: '810', in: '55,900', net: '+₹7,880', up: true },
  { id: '4122', drawn: 4, players: '788', in: '52,300', net: '+₹5,410', up: true },
];

interface AdminPlayer {
  name: string; phone: string; balance: number; deposited: number; pl: number;
  kyc: 'VERIFIED' | 'PENDING' | 'NONE'; status: 'ACTIVE' | 'LIMITED' | 'REVIEW' | 'BLOCKED'; av: string;
}
const PLAYERS: AdminPlayer[] = [
  { name: 'Vikram Shetty', phone: '+91 98201 44556', balance: 12480, deposited: 46000, pl: 18900, kyc: 'VERIFIED', status: 'ACTIVE', av: colors.gold },
  { name: 'Priya Nair', phone: '+91 99400 21873', balance: 6120, deposited: 31500, pl: 14400, kyc: 'VERIFIED', status: 'ACTIVE', av: colors.textDim },
  { name: 'Arjun Kapoor', phone: '+91 98110 77234', balance: 980, deposited: 22000, pl: -6300, kyc: 'PENDING', status: 'ACTIVE', av: colors.purple },
  { name: 'Meera Das', phone: '+91 90070 55190', balance: 3240, deposited: 12000, pl: 1850, kyc: 'VERIFIED', status: 'ACTIVE', av: colors.acc },
  { name: 'Sanjay Rao', phone: '+91 97390 66412', balance: 0, deposited: 8400, pl: -8400, kyc: 'NONE', status: 'LIMITED', av: '#C08A4A' },
  { name: 'Rahul Menon', phone: '+91 98765 43210', balance: 1240, deposited: 9000, pl: 1800, kyc: 'PENDING', status: 'ACTIVE', av: colors.accHover },
  { name: 'Farah Ali', phone: '+91 88000 31277', balance: 15600, deposited: 62000, pl: -2100, kyc: 'VERIFIED', status: 'REVIEW', av: '#FF8B6E' },
  { name: 'Dev Patel', phone: '+91 93000 18844', balance: 420, deposited: 3000, pl: -2580, kyc: 'NONE', status: 'BLOCKED', av: colors.muted },
];

interface Withdrawal {
  id: string; name: string; upi: string; amt: number; flag: string; when: string;
  kyc: 'VERIFIED' | 'PENDING' | 'REVIEW';
}
const WITHDRAWALS: Withdrawal[] = [
  { id: 'w1', name: 'Vikram Shetty', upi: 'vikram@ybl', amt: 12000, flag: 'Large amount', when: '8 min ago', kyc: 'VERIFIED' },
  { id: 'w2', name: 'Priya Nair', upi: 'priya.n@okicici', amt: 6000, flag: 'Routine', when: '22 min ago', kyc: 'VERIFIED' },
  { id: 'w3', name: 'Farah Ali', upi: 'farah@paytm', amt: 9400, flag: '3rd request today', when: '40 min ago', kyc: 'REVIEW' },
  { id: 'w4', name: 'Arjun Kapoor', upi: 'arjunk@okaxis', amt: 2300, flag: 'KYC incomplete', when: '1 hr ago', kyc: 'PENDING' },
  { id: 'w5', name: 'Meera Das', upi: 'meera@ybl', amt: 11500, flag: 'New bank account', when: '2 hrs ago', kyc: 'VERIFIED' },
];

const SETTINGS_META: { key: AdminConfigKey; label: string; help: string; opts: string[] }[] = [
  { key: 'round', label: 'Round length', help: 'Time bets stay open before the draw. Changes the live timer immediately.', opts: ['30s', '60s', '3m'] },
  { key: 'payout', label: 'Payout multiplier', help: 'Lower means a wider house edge. Changes payouts on the next draw.', opts: ['8×', '9×', '9.5×'] },
  { key: 'minStake', label: 'Minimum stake', help: 'Per number, per round. (Display only for now.)', opts: ['₹5', '₹10', '₹20'] },
  { key: 'maxStake', label: 'Maximum stake', help: 'Caps single-round liability. (Display only for now.)', opts: ['₹500', '₹1,000', '₹5,000'] },
  { key: 'rake', label: 'Platform rake', help: 'Taken off the pool before payout. (Display only for now.)', opts: ['2%', '4%', '6%'] },
  { key: 'autoPay', label: 'Auto-approve below', help: 'Verified players only. (Display only for now.)', opts: ['₹2,000', '₹5,000', '₹10,000'] },
];

export default function AdminScreen() {
  const go = useGameStore((s) => s.go);
  const cfg = useGameStore((s) => s.cfg);
  const setConfig = useGameStore((s) => s.setConfig);
  const roundId = useGameStore((s) => s.roundId);

  const [tab, setTab] = useState<AdminTab>('overview');

  return (
    <Screen>
      <BackButton onPress={() => go('profile')} style={{ marginBottom: 18 }} />
      <Text style={styles.title}>Admin</Text>
      <Text style={styles.sub}>Live · round #{roundId} · house edge {HOUSE_EDGE}%</Text>

      <View style={styles.tabsRow}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[styles.tab, { backgroundColor: active ? 'rgba(0,229,160,0.14)' : colors.card, borderColor: active ? colors.acc : colors.border }]}
            >
              <Text style={[styles.tabText, { color: active ? colors.acc : colors.muted }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'players' && <PlayersTab />}
      {tab === 'withdrawals' && <WithdrawalsTab />}
      {tab === 'settings' && <SettingsTab cfg={cfg} setConfig={setConfig} />}
    </Screen>
  );
}

function OverviewTab() {
  return (
    <View>
      <View style={styles.kpiGrid}>
        {KPIS.map((k) => (
          <View key={k.label} style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{k.label}</Text>
            <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
            <Text style={[styles.kpiDelta, { color: k.deltaColor }]}>{k.delta}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeaderRow}>
          <Text style={styles.panelTitle}>Live exposure this round</Text>
          <Text style={styles.panelHint}>stake in · payout if drawn</Text>
        </View>
        <View style={styles.exposureRow}>
          {EXPOSURE.map((e) => (
            <View key={e.n} style={styles.exposureCol}>
              <Text numberOfLines={1} style={[styles.exposureLiability, { color: e.riskColor }]}>
                ₹{e.liability}
              </Text>
              <View style={[styles.exposureBar, { backgroundColor: e.barBg, height: Math.max(6, e.h) }]} />
              <Text style={[styles.exposureNum, { color: e.numColor }]}>{e.n}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statsFooter}>
          <View>
            <Text style={styles.statFooterLabel}>POOL IN</Text>
            <Text style={styles.statFooterValue}>₹58,400</Text>
          </View>
          <View>
            <Text style={styles.statFooterLabel}>WORST CASE</Text>
            <Text style={[styles.statFooterValue, { color: colors.red }]}>−₹86,400</Text>
          </View>
          <View>
            <Text style={styles.statFooterLabel}>EXP. RAKE</Text>
            <Text style={[styles.statFooterValue, { color: colors.acc }]}>₹6,480</Text>
          </View>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Revenue, last 7 days</Text>
        <View style={[styles.exposureRow, { marginTop: 14 }]}>
          {REV_BARS.map((r, i) => (
            <View key={i} style={styles.exposureCol}>
              <View style={[styles.exposureBar, { backgroundColor: r.bg, height: Math.max(6, r.v) }]} />
              <Text style={styles.exposureNum}>{r.d}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.statsFooter, { justifyContent: 'space-between' }]}>
          <View>
            <Text style={styles.statFooterLabel}>NET THIS WEEK</Text>
            <Text style={[styles.statFooterValue, { color: colors.acc }]}>₹1,84,200</Text>
          </View>
          <View>
            <Text style={styles.statFooterLabel}>PAID OUT</Text>
            <Text style={styles.statFooterValue}>₹12.6L</Text>
          </View>
        </View>
      </View>

      <SectionLabel style={{ marginTop: 4 }}>RECENT ROUNDS</SectionLabel>
      <View style={{ gap: 8 }}>
        {ADMIN_ROUNDS.map((r) => (
          <Row
            key={r.id}
            title={`#${r.id} · drawn ${r.drawn}`}
            subtitle={`${r.players} players · in ₹${r.in}`}
            right={<Text style={[styles.roundNet, { color: r.up ? colors.acc : colors.red }]}>{r.net}</Text>}
          />
        ))}
      </View>
    </View>
  );
}

function PlayersTab() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PLAYERS;
    return PLAYERS.filter((p) => p.name.toLowerCase().includes(q) || p.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')));
  }, [query]);

  const exportCsv = async () => {
    const header = 'Name,Phone,Balance,Deposited,P&L,KYC,Status';
    const rows = filtered.map((p) => `${p.name},${p.phone},${p.balance},${p.deposited},${p.pl},${p.kyc},${p.status}`);
    await Clipboard.setStringAsync([header, ...rows].join('\n'));
    Alert.alert('Copied', `${filtered.length} players copied to clipboard as CSV.`);
  };

  return (
    <View>
      <Text style={styles.sectionSub}>18,402 registered · 1,284 online now</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by phone, name or ID…"
        placeholderTextColor={colors.faint}
        style={styles.searchInput}
      />
      <Pressable onPress={exportCsv} style={styles.exportBtn}>
        <Text style={styles.exportBtnText}>EXPORT CSV ({filtered.length})</Text>
      </Pressable>

      <View style={{ gap: 8 }}>
        {filtered.map((p) => {
          const initials = p.name.split(' ').map((w) => w[0]).join('');
          const plColor = p.pl >= 0 ? colors.acc : colors.red;
          const kycColor = p.kyc === 'VERIFIED' ? colors.acc : p.kyc === 'PENDING' ? colors.gold : colors.muted;
          const stBg = p.status === 'ACTIVE' ? 'rgba(0,229,160,0.12)' : p.status === 'BLOCKED' ? 'rgba(255,90,54,0.14)' : 'rgba(232,177,76,0.14)';
          const stColor = p.status === 'ACTIVE' ? colors.acc : p.status === 'BLOCKED' ? colors.red : colors.gold;
          return (
            <View key={p.phone} style={styles.playerCard}>
              <View style={styles.playerTopRow}>
                <View style={[styles.playerAvatar, { backgroundColor: p.av }]}>
                  <Text style={styles.playerAvatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.playerName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.playerPhone}>{p.phone}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: stBg }]}>
                  <Text style={[styles.statusPillText, { color: stColor }]}>{p.status}</Text>
                </View>
              </View>
              <View style={styles.playerStatsRow}>
                <View style={styles.playerStat}>
                  <Text style={styles.playerStatLabel}>BALANCE</Text>
                  <Text style={styles.playerStatValue}>₹{money(p.balance)}</Text>
                </View>
                <View style={styles.playerStat}>
                  <Text style={styles.playerStatLabel}>DEPOSITED</Text>
                  <Text style={styles.playerStatValue}>₹{money(p.deposited)}</Text>
                </View>
                <View style={styles.playerStat}>
                  <Text style={styles.playerStatLabel}>NET P/L</Text>
                  <Text style={[styles.playerStatValue, { color: plColor }]}>
                    {p.pl >= 0 ? '+' : '−'}₹{money(Math.abs(p.pl))}
                  </Text>
                </View>
                <View style={styles.playerStat}>
                  <Text style={styles.playerStatLabel}>KYC</Text>
                  <Text style={[styles.playerStatValue, { color: kycColor, fontSize: 10.5 }]}>{p.kyc}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function WithdrawalsTab() {
  const [status, setStatus] = useState<Record<string, 'approved' | 'held'>>({});

  const pending = WITHDRAWALS.filter((w) => !status[w.id]);
  const pendingTotal = pending.reduce((sum, w) => sum + w.amt, 0);

  return (
    <View>
      <Text style={styles.sectionSub}>{pending.length} awaiting approval · ₹{money(pendingTotal)} queued</Text>

      <View style={{ gap: 9, marginBottom: 16 }}>
        {WITHDRAWALS.map((w) => {
          const st = status[w.id];
          const kycColor = w.kyc === 'VERIFIED' ? colors.acc : w.kyc === 'PENDING' ? colors.gold : colors.red;
          const border = st === 'approved' ? 'rgba(0,229,160,0.4)' : st === 'held' ? 'rgba(255,90,54,0.4)' : w.kyc === 'VERIFIED' ? colors.borderSoft : 'rgba(232,177,76,0.28)';
          return (
            <View key={w.id} style={[styles.withdrawCard, { borderColor: border }]}>
              <View style={styles.withdrawTopRow}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.playerName} numberOfLines={1}>{w.name}</Text>
                  <Text style={styles.playerPhone}>{w.upi}</Text>
                </View>
                <Text style={styles.withdrawAmt}>₹{money(w.amt)}</Text>
              </View>
              <View style={styles.withdrawMetaRow}>
                <Text style={styles.withdrawFlag}>{w.flag} · {w.when}</Text>
                <Text style={[styles.withdrawKyc, { color: kycColor }]}>{w.kyc}</Text>
              </View>
              <View style={styles.withdrawActions}>
                <Pressable
                  onPress={() => setStatus((s) => ({ ...s, [w.id]: 'approved' }))}
                  style={[styles.approveBtn, { backgroundColor: st === 'approved' ? 'rgba(0,229,160,0.16)' : colors.acc }]}
                >
                  <Text style={[styles.approveBtnText, { color: colors.accDeep }]}>
                    {st === 'approved' ? 'APPROVED' : 'APPROVE'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setStatus((s) => ({ ...s, [w.id]: 'held' }))}
                  style={styles.holdBtn}
                >
                  <Text style={styles.holdBtnText}>{st === 'held' ? 'HELD' : 'HOLD'}</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteCardText}>
          Auto-approve is on for verified players withdrawing under {'₹'}5,000. Everything else lands here for a human.
        </Text>
      </View>
    </View>
  );
}

function SettingsTab({ cfg, setConfig }: { cfg: Record<AdminConfigKey, string>; setConfig: (key: AdminConfigKey, value: string) => void }) {
  return (
    <View>
      <Text style={styles.sectionSub}>Changes to round length and payout apply immediately. Everything else is display-only for now.</Text>

      <View style={{ gap: 10, marginBottom: 14 }}>
        {SETTINGS_META.map((s) => (
          <View key={s.key} style={styles.settingCard}>
            <Text style={styles.settingLabel}>{s.label}</Text>
            <Text style={styles.settingHelp}>{s.help}</Text>
            <View style={styles.settingOptsRow}>
              {s.opts.map((v) => {
                const active = cfg[s.key] === v;
                return (
                  <Pressable
                    key={v}
                    onPress={() => setConfig(s.key, v)}
                    style={[styles.settingOpt, { backgroundColor: active ? 'rgba(0,229,160,0.14)' : colors.card2, borderColor: active ? colors.acc : colors.border }]}
                  >
                    <Text style={[styles.settingOptText, { color: active ? colors.acc : colors.muted }]}>{v}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.fairnessCard}>
        <Text style={styles.fairnessTitle}>Fairness &amp; audit</Text>
        <Text style={styles.fairnessBody}>
          Draws are seeded server-side and hashed before the round opens; the seed is published after the draw so any
          player can verify it. Admins cannot see or set the winning number — this panel shows exposure only.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 26, letterSpacing: -0.7, color: colors.text, marginBottom: 5 },
  sub: { fontFamily: fonts.mono, fontSize: 11.5, color: colors.muted, marginBottom: 20 },

  tabsRow: { flexDirection: 'row', gap: 7, marginBottom: 20 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 11, borderWidth: 1 },
  tabText: { fontFamily: fonts.monoSemi, fontSize: 9.5, letterSpacing: 0.6 },

  sectionSub: { fontFamily: fonts.displayReg, fontSize: 12, color: colors.muted, marginBottom: 16 },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 14 },
  kpiCard: { width: '48%', borderRadius: radii.md, padding: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  kpiLabel: { fontFamily: fonts.monoSemi, fontSize: 9, letterSpacing: 1, color: colors.muted },
  kpiValue: { fontFamily: fonts.monoBold, fontSize: 19, letterSpacing: -0.5, marginTop: 8 },
  kpiDelta: { fontFamily: fonts.monoMed, fontSize: 9.5, marginTop: 5 },

  panel: { borderRadius: radii.lg, padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  panelHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 },
  panelTitle: { fontFamily: fonts.displaySemi, fontSize: 12.5, color: colors.text },
  panelHint: { fontFamily: fonts.monoMed, fontSize: 9, color: colors.muted },

  exposureRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 100 },
  exposureCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 5, height: '100%' },
  exposureLiability: { fontFamily: fonts.monoSemi, fontSize: 7.5 },
  exposureBar: { width: '100%', borderRadius: 4, minHeight: 6 },
  exposureNum: { fontFamily: fonts.monoBold, fontSize: 10.5, color: colors.textDim },

  statsFooter: { flexDirection: 'row', gap: 16, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
  statFooterLabel: { fontFamily: fonts.monoSemi, fontSize: 8.5, letterSpacing: 1, color: colors.muted },
  statFooterValue: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.text, marginTop: 4 },

  roundNet: { fontFamily: fonts.monoSemi, fontSize: 12.5 },

  searchInput: {
    padding: 13, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    fontFamily: fonts.displayReg, fontSize: 12.5, color: colors.text, marginBottom: 9,
  },
  exportBtn: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 11, backgroundColor: colors.acc, marginBottom: 16 },
  exportBtnText: { fontFamily: fonts.monoSemi, fontSize: 10.5, color: colors.accDeep },

  playerCard: { borderRadius: radii.md, padding: 14, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.borderSoft },
  playerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playerAvatar: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  playerAvatarText: { fontFamily: fonts.displaySemi, fontSize: 11.5, color: colors.bg },
  playerName: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.text },
  playerPhone: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.muted, marginTop: 2 },
  statusPill: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: radii.pill },
  statusPillText: { fontFamily: fonts.monoSemi, fontSize: 8.5, letterSpacing: 0.6 },
  playerStatsRow: { flexDirection: 'row', marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
  playerStat: { flex: 1 },
  playerStatLabel: { fontFamily: fonts.monoSemi, fontSize: 8, letterSpacing: 0.8, color: colors.muted },
  playerStatValue: { fontFamily: fonts.monoSemi, fontSize: 11.5, color: colors.text, marginTop: 4 },

  withdrawCard: { borderRadius: radii.md, padding: 15, backgroundColor: colors.card, borderWidth: 1 },
  withdrawTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  withdrawAmt: { fontFamily: fonts.monoBold, fontSize: 15, color: colors.text },
  withdrawMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  withdrawFlag: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.muted, flex: 1 },
  withdrawKyc: { fontFamily: fonts.monoSemi, fontSize: 9.5, letterSpacing: 0.6 },
  withdrawActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  approveBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  approveBtnText: { fontFamily: fonts.monoSemi, fontSize: 10.5 },
  holdBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: 'rgba(255,90,54,0.12)', borderWidth: 1, borderColor: 'rgba(255,90,54,0.3)' },
  holdBtnText: { fontFamily: fonts.monoSemi, fontSize: 10.5, color: colors.red },

  noteCard: { borderRadius: radii.md, padding: 15, backgroundColor: 'rgba(232,177,76,0.07)', borderWidth: 1, borderColor: 'rgba(232,177,76,0.25)' },
  noteCardText: { fontFamily: fonts.displayReg, fontSize: 12, lineHeight: 18, color: colors.gold },

  settingCard: { borderRadius: radii.md, padding: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  settingLabel: { fontFamily: fonts.displaySemi, fontSize: 12.5, color: colors.text },
  settingHelp: { fontFamily: fonts.displayReg, fontSize: 11, lineHeight: 16, color: colors.muted, marginTop: 4 },
  settingOptsRow: { flexDirection: 'row', gap: 7, marginTop: 12 },
  settingOpt: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  settingOptText: { fontFamily: fonts.monoSemi, fontSize: 11 },

  fairnessCard: { borderRadius: radii.md, padding: 15, backgroundColor: 'rgba(255,90,54,0.07)', borderWidth: 1, borderColor: 'rgba(255,90,54,0.24)' },
  fairnessTitle: { fontFamily: fonts.displaySemi, fontSize: 12, color: '#FF8B6E' },
  fairnessBody: { fontFamily: fonts.displayReg, fontSize: 11.5, lineHeight: 17, color: '#B99184', marginTop: 5 },
});
