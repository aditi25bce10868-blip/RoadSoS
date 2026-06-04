import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from 'expo-router';
import { useSOSStore } from '@/store/sosStore';
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

  const startCountdown = useCallback(() => {
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
          router.replace('/tracking');
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
    router.replace('/');
  }, [clearTimer, reset]);

  const cancelActiveSOS = useCallback(() => {
    cancelSOS();
    reset();
    router.replace('/');
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