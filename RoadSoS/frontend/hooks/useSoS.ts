import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from 'expo-router';
import { useSOSStore } from '../store/sosStore';
import { useLocation } from './useLocation';

const COUNTDOWN_SECONDS = 10;

interface UseSOSReturn {
  countdownValue: number;
  isCountingDown: boolean;
  startCountdown: () => void;
  cancelCountdown: () => void;
  cancelActiveSOS: () => void;
}

export function useSOS(): UseSOSReturn {
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_SECONDS);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { setStatus, triggerSOS, cancelSOS, reset } = useSOSStore();
  const { startTracking } = useLocation();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

 const whoNeedsHelpRef = useRef<string | null>(null);

const startCountdown = useCallback(() => {
  // capture it immediately when countdown starts
  const { sos } = useSOSStore.getState();
  whoNeedsHelpRef.current = sos.whoNeedsHelp;
  console.log('captured whoNeedsHelp:', whoNeedsHelpRef.current);

  clearTimer();
  setCountdownValue(COUNTDOWN_SECONDS);
  setIsCountingDown(true);
  setStatus('countdown');
  startTracking();

  timerRef.current = setInterval(() => {
    setCountdownValue((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        clearTimer();
        setIsCountingDown(false);
        triggerSOS();
        console.log('whoNeedsHelp at end:', whoNeedsHelpRef.current);
        if (whoNeedsHelpRef.current === 'other') {
          router.replace('/emergency/Somebodyelse' as any);
        } else {
          router.replace('/(tabs)/tracking');
        }
        return 0;
      }
      return next;
    });
  }, 1000);
}, [clearTimer, setStatus, startTracking, triggerSOS]);

  const cancelCountdown = useCallback(() => {
    clearTimer();
    setIsCountingDown(false);
    setCountdownValue(COUNTDOWN_SECONDS);
    reset();
    router.replace('/(tabs)/sos');
  }, [clearTimer, reset]);

  const cancelActiveSOS = useCallback(() => {
    cancelSOS();
    reset();
    router.replace('/(tabs)/sos');
  }, [cancelSOS, reset]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    countdownValue,
    isCountingDown,
    startCountdown,
    cancelCountdown,
    cancelActiveSOS,
  };
}
