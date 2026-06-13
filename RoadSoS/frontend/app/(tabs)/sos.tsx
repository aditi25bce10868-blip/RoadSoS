import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  StatusBar, Platform, Vibration,
} from 'react-native';
import { router } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { SOSButton } from '../../components/sos/SoSButton';
import { AccidentAlertModal } from '../../components/sos/AccidentAlertModal';
import { useAccidentDetection } from '../../hooks/useAccidentDetection';
import { storage } from '../../utils/storage';
import { useSOSStore } from '../../store/sosStore';
import { triggerNotification } from '../../store/notificationStore';
import SimulatorPanel from '../../components/sos/simulatorPanel';

const COUNTDOWN_SECONDS = 10;

export default function SOSScreen() {
  const [showAlert,    setShowAlert]    = useState(false);
  const [countdown,    setCountdown]    = useState(COUNTDOWN_SECONDS);
  const [detectionEnabled, setDetectionEnabled] = useState(false);
  const countdownRef   = useRef<any>(null);

  useEffect(() => {
    let active = true;

    storage.getItem('detectionEnabled').then((value) => {
      if (active) {
        setDetectionEnabled(value === 'true');
      }
    });

    return () => {
      active = false;
    };
  }, []);

  // ── Accident detection ────────────────────────────────────────
  const detection = useAccidentDetection(
    detectionEnabled,
    () => {
      // Auto-confirmed (countdown reached 0 or user tapped Need Help)
      // Backend call already made inside confirmAccident()
      // Navigate to tracking
      
     triggerNotification('sos_activated');
     setTimeout(() => triggerNotification('tracking_started'), 3500);
    }
  );

  // Show modal when detection triggers alert
  useEffect(() => {
    if (detection.status === 'alert' && !showAlert) {
      setShowAlert(true);
      setCountdown(COUNTDOWN_SECONDS);
      startCountdownTimer();
    }
  }, [detection.status]);

  const startCountdownTimer = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSafe = () => {
    clearInterval(countdownRef.current);
    setShowAlert(false);
    setCountdown(COUNTDOWN_SECONDS);
    detection.markSafe();
  };

  const handleNeedHelp = () => {
    clearInterval(countdownRef.current);
    setShowAlert(false);
    detection.confirmAccident();
  };

  const handleCountdownEnd = () => {
    clearInterval(countdownRef.current);
    setShowAlert(false);
    detection.confirmAccident();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleSOSPress = () => {
    router.push('/emergency/whoNeedsHelp');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header />

      {detectionEnabled && (
       <SimulatorPanel
      onSimulate={detection.simulateEvent}
      currentScore={detection.score}
  />
)}


      <View style={styles.body}>
        {/* Detection status indicator */}
        {detectionEnabled && (
          <View style={[
            styles.detectionBadge,
            detection.status === 'monitoring' ? styles.badgeActive :
            detection.status === 'cooldown'   ? styles.badgeCooldown :
            styles.badgeInactive,
          ]}>
            <View style={[
              styles.detectionDot,
              detection.status === 'monitoring' ? styles.dotActive : styles.dotInactive,
            ]} />
            <Text style={styles.detectionText}>
              {detection.status === 'monitoring' ? 'Auto Detection Active' :
               detection.status === 'cooldown'   ? 'Cooling Down...' :
               detection.status === 'triggered'  ? 'SOS Triggered' :
               'Auto Detection'}
            </Text>
            {detection.score > 0 && detection.status === 'monitoring' && (
              <Text style={styles.detectionScore}>{detection.score}/80</Text>
            )}
          </View>
        )}

        <SOSButton onPress={handleSOSPress} />
        <Text style={styles.hint}>Tap the SOS button in case of emergency</Text>
      </View>
      
      {/* Accident detection alert modal */}
      <AccidentAlertModal
        visible={showAlert}
        countdown={countdown}
        events={detection.events}
        onSafe={handleSafe}
        onNeedHelp={handleNeedHelp}
        onCountdownEnd={handleCountdownEnd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
  },
  hint: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  // Detection badge
  detectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeActive:   { backgroundColor: '#F0FDF4', borderColor: '#10B981' },
  badgeCooldown: { backgroundColor: '#FFF7ED', borderColor: '#F59E0B' },
  badgeInactive: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
  detectionDot:  { width: 7, height: 7, borderRadius: 4 },
  dotActive:     { backgroundColor: '#10B981' },
  dotInactive:   { backgroundColor: '#9CA3AF' },
  detectionText: { fontSize: 13, fontWeight: '500', color: '#1A1A2E' },
  detectionScore:{ fontSize: 11, color: '#9CA3AF', marginLeft: 4 },
});
