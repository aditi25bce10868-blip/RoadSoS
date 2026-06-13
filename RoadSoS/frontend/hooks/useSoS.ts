import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from 'expo-router';
import { useSOSStore } from '../store/sosStore';
import { useLocation } from './useLocation';
import { API_BASE_URL } from '../constants/api';
import { triggerNotification } from '../store/notificationStore';
import {Linking} from 'react-native'

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

  const { setStatus, triggerSOS, cancelSOS, reset ,setSessionId} = useSOSStore();
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
  triggerSOS(); // update store

  // Get location from store
  const { sos } = useSOSStore.getState();
  const location = sos.location || {
    lat: 28.6139, lng: 77.2090,
    address: 'Unknown Location',
  };

  if (whoNeedsHelpRef.current === 'other') {
    // Bystander — SMS to services only
    fetch(`${API_BASE_URL}/api/sos/bystander`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ location, countryCode: 'IN' }),
    })
    .then((r) => r.json() as Promise<{ summary?: string }>)
    .then((data) => console.log('Bystander SOS sent:', JSON.stringify(data)))
    .catch(err => {
  console.warn('SOS failed:', err.message);
  Linking.openURL(`sms:112?body=EMERGENCY! I need help. Location: ${location.address}`);
})

    router.replace('/emergency/Somebodyelse' as any);
    triggerNotification('bystander_submitted');

  } else {
    // User needs help — SMS + tracking link to contacts + services
    fetch(`${API_BASE_URL}/api/sos/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({
        location,
        emergencyContacts: [], // hardcoded mock for now
        countryCode: 'IN',
        userName: 'User',      // replace with real user when auth ready
      }),
    })
      .then((r) => r.json() as Promise<{ summary?: string; sessionId?: string }>)
    .then((data) => {
  if (data.sessionId) setSessionId(data.sessionId);
  console.log('SOS sent:', JSON.stringify(data));
})
    .catch(err => {
  console.warn('SOS failed:', err.message);
  Linking.openURL(`sms:112?body=EMERGENCY! I need help. Location: ${location.address}`);
})

    router.replace('/(tabs)/tracking');
    triggerNotification('sos_activated');   
   setTimeout(() => triggerNotification('tracking_started'), 3500);
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
