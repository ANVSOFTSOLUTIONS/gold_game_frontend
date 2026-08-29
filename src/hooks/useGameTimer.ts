import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useGameTimer() {
  useEffect(() => {
    let inFlight = false;
    const id = setInterval(() => {
      if (inFlight) return;
      inFlight = true;
      useGameStore
        .getState()
        .tick()
        .finally(() => {
          inFlight = false;
        });
    }, 1000);
    return () => clearInterval(id);
  }, []);
}
