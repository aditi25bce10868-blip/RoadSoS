import React, { useEffect, useRef } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, Animated, Vibration, Platform,
} from 'react-native';
import { CountdownTimer } from './CountdownTimer';

interface Props {
  visible:        boolean;
  countdown:      number;
  events:         string[];
  onSafe:         () => void;
  onNeedHelp:     () => void;
  onCountdownEnd: () => void;
}

export function AccidentAlertModal({
  visible, countdown, events, onSafe, onNeedHelp, onCountdownEnd,
}: Props) {
  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const prevCountdown = useRef(countdown);

  // Slide up + fade in when visible
  useEffect(() => {
    if (visible) {
      // Strong vibration pattern when alert appears
      Vibration.vibrate([0, 400, 200, 400, 200, 400]);

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0, useNativeDriver: true,
          tension: 70, friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, duration: 250, useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(60);
      opacityAnim.setValue(0);
      Vibration.cancel();
    }
  }, [visible]);

  // Short vibrate on each countdown tick
  useEffect(() => {
    if (visible && countdown !== prevCountdown.current) {
      if (countdown <= 3 && countdown > 0) {
        Vibration.vibrate(150); // urgent short buzz last 3 sec
      }
      prevCountdown.current = countdown;
    }
    if (countdown === 0) {
      Vibration.cancel();
      onCountdownEnd();
    }
  }, [countdown, visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[
          styles.sheet,
          { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }
        ]}>

          {/* Top pill handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Text style={styles.iconText}>⚠️</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Possible Accident Detected</Text>
              <Text style={styles.subtitle}>Are you okay? Tap below to respond.</Text>
            </View>
          </View>

          {/* Countdown */}
          <View style={styles.countdownWrap}>
            <CountdownTimer value={countdown} total={10} size={120} />
            <Text style={styles.countdownLabel}>
              Emergency alert sends automatically in {countdown}s
            </Text>
          </View>

          {/* Detected signals */}
          {events.length > 0 && (
            <View style={styles.eventsCard}>
              <Text style={styles.eventsTitle}>Detected signals</Text>
              {events.slice(0, 3).map((e, i) => (
                <View key={i} style={styles.eventRow}>
                  <View style={styles.eventDot} />
                  <Text style={styles.eventText}>{e}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.safeBtn}
              onPress={() => { Vibration.cancel(); onSafe(); }}
              activeOpacity={0.85}
            >
              <Text style={styles.safeBtnText}>✅ I'm Safe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helpBtn}
              onPress={() => { Vibration.cancel(); onNeedHelp(); }}
              activeOpacity={0.85}
            >
              <Text style={styles.helpBtnText}>🚨 Need Help</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            No response = emergency alert sent automatically
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:          { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 36 },
  handle:         { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 },

  header:         { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  iconWrap:       { width: 52, height: 52, borderRadius: 16, backgroundColor: '#FFF3F3', alignItems: 'center', justifyContent: 'center' },
  iconText:       { fontSize: 26 },
  headerText:     { flex: 1 },
  title:          { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 3 },
  subtitle:       { fontSize: 13, color: '#6B7280' },

  countdownWrap:  { alignItems: 'center', marginBottom: 20 },
  countdownLabel: { marginTop: 14, fontSize: 13, color: '#6B7280', textAlign: 'center' },

  eventsCard:     { backgroundColor: '#F7F4F8', borderRadius: 12, padding: 14, marginBottom: 20 },
  eventsTitle:    { fontSize: 12, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  eventRow:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  eventDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CC0000' },
  eventText:      { fontSize: 13, color: '#1A1A2E', flex: 1 },

  buttonRow:      { flexDirection: 'row', gap: 12, marginBottom: 14 },
  safeBtn:        { flex: 1, backgroundColor: '#F0FDF4', borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#10B981' },
  safeBtnText:    { color: '#10B981', fontWeight: '700', fontSize: 15 },
  helpBtn:        { flex: 1, backgroundColor: '#CC0000', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  helpBtnText:    { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  footerNote:     { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
});
