import { useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSOSStore } from '../store/sosStore';

const COUNTDOWN_SECONDS = 10;

export function useSOS() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    status,
    whoNeedsHelp,
    countdownValue,
    setStatus,
    setWhoNeedsHelp,
    setCountdown,
    activateSOS,
    cancelSOS,
  } = useSOSStore();

  /** Clear any running countdown interval. */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** User presses the big SOS button → navigate to "Who Needs Help?" */
  const triggerSOS = useCallback(() => {
    setStatus('who_needs_help');
    router.push('/emergency/whoNeedsHelp');
  }, [router, setStatus]);

  /** After "Who Needs Help?" choice → navigate to confirmation */
  const selectWhoNeedsHelp = useCallback(
    (who: 'self' | 'other') => {
      setWhoNeedsHelp(who);
      setStatus('confirming');
      if (who === 'self') {
        router.push('/emergency/confirmation');
      } else {
        // "Somebody else" → dedicated help screen (map + nearby services + call buttons)
        setStatus('active');
        router.push('/emergency/somebodyElse');
      }
    },
    [router, setWhoNeedsHelp, setStatus, activateSOS]
  );

  /** User confirms → start 10-second countdown */
  const confirmSOS = useCallback(() => {
    setStatus('countdown');
    setCountdown(COUNTDOWN_SECONDS);
    router.replace('/(tabs)/sos'); // shows countdown overlay

    timerRef.current = setInterval(() => {
      useSOSStore.setState((state) => {
        const next = state.countdownValue - 1;
        if (next <= 0) {
          clearTimer();
          // Activate after small delay so UI shows "0"
          setTimeout(() => {
            activateSOS();
            router.replace('/(tabs)/tracking');
          }, 600);
          return { countdownValue: 0 };
        }
        return { countdownValue: next };
      });
    }, 1000);
  }, [router, setStatus, setCountdown, activateSOS, clearTimer]);

  /** Cancel at any point and reset state. */
  const cancelAlert = useCallback(() => {
    clearTimer();
    cancelSOS();
    router.replace('/(tabs)/sos');
  }, [router, clearTimer, cancelSOS]);

  // Clean up on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    status,
    whoNeedsHelp,
    countdownValue,
    triggerSOS,
    selectWhoNeedsHelp,
    confirmSOS,
    cancelAlert,
  };
}