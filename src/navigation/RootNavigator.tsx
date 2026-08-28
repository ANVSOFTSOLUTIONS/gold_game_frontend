import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Screen, useGameStore } from '../store/useGameStore';
import BottomNav from '../components/BottomNav';

import OnboardScreen from '../screens/OnboardScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import WalletScreen from '../screens/WalletScreen';
import AddMoneyScreen from '../screens/AddMoneyScreen';
import WithdrawScreen from '../screens/WithdrawScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ReferralScreen from '../screens/ReferralScreen';
import KycScreen from '../screens/KycScreen';
import NotifScreen from '../screens/NotifScreen';
import SupportScreen from '../screens/SupportScreen';
import AdminScreen from '../screens/AdminScreen';

const SCREEN_MAP: Record<Screen, React.ComponentType> = {
  onboard: OnboardScreen,
  auth: AuthScreen,
  home: HomeScreen,
  game: GameScreen,
  wallet: WalletScreen,
  add: AddMoneyScreen,
  withdraw: WithdrawScreen,
  rewards: RewardsScreen,
  profile: ProfileScreen,
  history: HistoryScreen,
  leaderboard: LeaderboardScreen,
  referral: ReferralScreen,
  kyc: KycScreen,
  notif: NotifScreen,
  support: SupportScreen,
  admin: AdminScreen,
};

const BACK_MAP: Partial<Record<Screen, Screen>> = {
  game: 'home',
  add: 'wallet',
  withdraw: 'wallet',
  kyc: 'profile',
  notif: 'home',
  support: 'profile',
  referral: 'rewards',
  auth: 'onboard',
  admin: 'profile',
};

export default function RootNavigator() {
  const screen = useGameStore((s) => s.screen);
  const go = useGameStore((s) => s.go);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = useGameStore.getState().screen;
      const target = BACK_MAP[current];
      if (target) {
        go(target);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [go]);

  const Comp = SCREEN_MAP[screen];

  return (
    <View style={styles.root}>
      <Comp />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
