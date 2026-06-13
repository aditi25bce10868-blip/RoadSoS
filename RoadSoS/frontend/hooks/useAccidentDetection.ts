import { useState, useEffect, useRef, useCallback } from 'react';
import { startMotionListening, stopMotionListening, MotionReading } from '../services/location/motionService';
import { getCurrentLocation } from '../services/location/gpsService';
import { SimulatedEvent } from '../components/sos/simulatorPanel';
import { API_BASE_URL } from '../constants/api';



const THRESHOLDS = {
  IMPACT_G: 2.5, DECEL_SPEED: 20, DECEL_TIME: 4000,
  ROTATION_MAG: 3.0, INACTIVITY_TIME: 20000,
  INACTIVITY_MAG: 0.3, DETECTION_SCORE: 80, SCORE_DECAY_AFTER: 10000,
};
const SCORES = {
  HIGH_IMPACT: 40, RAPID_DECELERATION: 30,
  ROTATION_ANOMALY: 20, POST_IMPACT_INACTIVITY: 40,
};
const COOLDOWN_MS = 30000;

export type DetectionStatus = 'inactive' | 'monitoring' | 'alert' | 'triggered' | 'cooldown';
export interface DetectionState {
  status: DetectionStatus; score: number; events: string[]; lastImpactAt: number | null;
}

export const useAccidentDetection = (enabled: boolean, onAccidentConfirmed: () => void) => {
  const [state, setState] = useState<DetectionState>({
    status: enabled ? 'monitoring' : 'inactive', score: 0, events: [], lastImpactAt: null,
  });

  const scoreRef           = useRef(0);
  const eventsRef          = useRef<string[]>([]);
  const lastImpactTimeRef  = useRef<number | null>(null);
  const lastSpeedRef       = useRef<number | null>(null);
  const inactivityTimerRef = useRef<any>(null);
  const cooldownTimerRef   = useRef<any>(null);
  const decayTimerRef      = useRef<any>(null);
  const alertActiveRef     = useRef(false);
  const readingBufferRef   = useRef<MotionReading[]>([]);

  const startDecayTimer = useCallback(() => {
    if (decayTimerRef.current) clearTimeout(decayTimerRef.current);
    decayTimerRef.current = setTimeout(() => {
      if (alertActiveRef.current) return;
      scoreRef.current = 0; eventsRef.current = []; lastImpactTimeRef.current = null;
      setState((s) => ({ ...s, score: 0, events: [] }));
    }, THRESHOLDS.SCORE_DECAY_AFTER);
  }, []);

  const addScore = useCallback((points: number, event: string) => {
    if (alertActiveRef.current) return;
    scoreRef.current += points; eventsRef.current = [...eventsRef.current, event];
    startDecayTimer();
    setState((s) => ({ ...s, score: scoreRef.current, events: eventsRef.current }));
    if (scoreRef.current >= THRESHOLDS.DETECTION_SCORE) triggerAlert();
  }, [startDecayTimer]);

  const triggerAlert = useCallback(() => {
    if (alertActiveRef.current) return;
    alertActiveRef.current = true;
    stopMotionListening();
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (decayTimerRef.current) clearTimeout(decayTimerRef.current);
    setState((s) => ({ ...s, status: 'alert', lastImpactAt: Date.now() }));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const gpsInterval = setInterval(async () => {
      if (alertActiveRef.current) return;
      try {
        const loc = await getCurrentLocation();
        if (loc?.speed != null) {
          const speedKmh = (loc.speed || 0) * 3.6;
          if (lastSpeedRef.current !== null && lastSpeedRef.current - speedKmh > THRESHOLDS.DECEL_SPEED) {
            addScore(SCORES.RAPID_DECELERATION, `Rapid decel (${lastSpeedRef.current.toFixed(0)}→${speedKmh.toFixed(0)} km/h)`);
          }
          lastSpeedRef.current = speedKmh;
        }
      } catch {}
    }, 2000);
    return () => clearInterval(gpsInterval);
  }, [enabled, addScore]);

  const checkInactivity = useCallback(() => {
    if (alertActiveRef.current || !lastImpactTimeRef.current) return;
    const recent = readingBufferRef.current.slice(-10);
    if (recent.length < 5) return;
    const avgMag = recent.reduce((s, r) => s + r.magnitude, 0) / recent.length;
    if (avgMag < THRESHOLDS.INACTIVITY_MAG) addScore(SCORES.POST_IMPACT_INACTIVITY, 'Post-impact inactivity');
  }, [addScore]);

  const processReading = useCallback((reading: MotionReading) => {
    if (alertActiveRef.current) return;
    readingBufferRef.current.push(reading);
    if (readingBufferRef.current.length > 20) readingBufferRef.current.shift();
    if (reading.magnitude > THRESHOLDS.IMPACT_G) {
      lastImpactTimeRef.current = reading.timestamp;
      addScore(SCORES.HIGH_IMPACT, `High impact (${reading.magnitude.toFixed(1)}g)`);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(checkInactivity, THRESHOLDS.INACTIVITY_TIME);
    }
    if (reading.gMagnitude > THRESHOLDS.ROTATION_MAG && lastImpactTimeRef.current &&
        reading.timestamp - lastImpactTimeRef.current < 5000) {
      addScore(SCORES.ROTATION_ANOMALY, `Rotation (${reading.gMagnitude.toFixed(1)})`);
    }
  }, [addScore, checkInactivity]);

  const simulateEvent = useCallback((event: SimulatedEvent) => {
    scoreRef.current = 0; eventsRef.current = []; lastImpactTimeRef.current = null;
    alertActiveRef.current = false; readingBufferRef.current = [];
    if (decayTimerRef.current) clearTimeout(decayTimerRef.current);
    setState((s) => ({ ...s, score: 0, events: [], status: 'monitoring' }));
    if (event.magnitude > THRESHOLDS.IMPACT_G)
      setTimeout(() => { lastImpactTimeRef.current = Date.now(); addScore(SCORES.HIGH_IMPACT, `[SIM] High impact (${event.magnitude}g)`); }, 100);
    if (event.gMagnitude > THRESHOLDS.ROTATION_MAG)
      setTimeout(() => { if (!lastImpactTimeRef.current) lastImpactTimeRef.current = Date.now(); addScore(SCORES.ROTATION_ANOMALY, `[SIM] Rotation (${event.gMagnitude})`); }, 300);
    if (event.speedBefore - event.speedAfter > THRESHOLDS.DECEL_SPEED)
      setTimeout(() => addScore(SCORES.RAPID_DECELERATION, `[SIM] Decel (${event.speedBefore}→${event.speedAfter} km/h)`), 500);
    if (event.inactivity)
      setTimeout(() => addScore(SCORES.POST_IMPACT_INACTIVITY, '[SIM] Post-impact inactivity'), 1000);
  }, [addScore]);

  const markSafe = useCallback(() => {
    alertActiveRef.current = false; scoreRef.current = 0; eventsRef.current = [];
    lastImpactTimeRef.current = null; readingBufferRef.current = [];
    if (decayTimerRef.current) clearTimeout(decayTimerRef.current);
    setState((s) => ({ ...s, status: 'cooldown', score: 0, events: [] }));
    cooldownTimerRef.current = setTimeout(() => {
      if (!enabled) return;
      alertActiveRef.current = false;
      setState((s) => ({ ...s, status: 'monitoring' }));
      startMotionListening(processReading);
    }, COOLDOWN_MS);
  }, [enabled, processReading]);

  // ── Confirm accident → same flow as "I Need Help" ─────────────
  const confirmAccident = useCallback(async () => {
    alertActiveRef.current = false;
    setState((s) => ({ ...s, status: 'triggered' }));

    // Get last known location
    let location = { lat: 0, lng: 0, address: 'Unknown Location' };
    try {
      const loc = await getCurrentLocation();
      if (loc) {
        location = { lat: loc.lat, lng: loc.lng, address: loc.address || 'Unknown Location' };
      }
    } catch {}

    // Trigger full "I Need Help" SOS flow in background
    try {
      const response = await fetch(`${API_BASE_URL}/api/sos/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          location,
          emergencyContacts: [],   // replace with real contacts when ready
          countryCode:       'IN',
          userName:          'User',
          triggeredBy:       'auto_detection',
        }),
      });
      const data = await response.json() as { summary?: string };
      console.log('Auto-detection SOS sent:', data.summary);
    } catch (err: any) {
      console.warn('Auto-detection SOS failed:', err.message);
    }

    

    // Call parent callback (starts tracking, navigates etc.)
    onAccidentConfirmed();
  }, [onAccidentConfirmed]);

  useEffect(() => {
    if (enabled) {
      alertActiveRef.current = false; scoreRef.current = 0; eventsRef.current = [];
      setState({ status: 'monitoring', score: 0, events: [], lastImpactAt: null });
      startMotionListening(processReading, 200);
    } else {
      stopMotionListening();
      [inactivityTimerRef, cooldownTimerRef, decayTimerRef].forEach((r) => { if (r.current) clearTimeout(r.current); });
      setState((s) => ({ ...s, status: 'inactive' }));
    }
    return () => {
      stopMotionListening();
      [inactivityTimerRef, cooldownTimerRef, decayTimerRef].forEach((r) => { if (r.current) clearTimeout(r.current); });
    };
  }, [enabled, processReading]);

  return { ...state, markSafe, confirmAccident, simulateEvent };
};
