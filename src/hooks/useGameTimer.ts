import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useGameTimer() {
  useEffect(() => {
    const id = setInterval(() => {
      useGameStore.getState().tick();
    }, 1000);
    return () => clearInterval(id);
  }, []);
}
