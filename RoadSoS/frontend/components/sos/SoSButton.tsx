import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SOSButtonProps {
  onPress: () => void;
  size?: number;
}

export function SOSButton({ onPress, size = 160 }: SOSButtonProps) {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  const createPulse = (anim: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

  useEffect(() => {
    const a1 = createPulse(pulse1, 0);
    const a2 = createPulse(pulse2, 500);
    const a3 = createPulse(pulse3, 1000);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  const ringStyle = (anim: Animated.Value, maxScale: number) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, maxScale],
        }),
      },
    ],
  });

  const iconSize = size * 0.25;

  return (
    <View style={[styles.wrapper, { width: size * 1.3, height: size * 1.3 }]}>
      {/* Pulse rings */}
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2 },
          ringStyle(pulse1, 1.18),
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2 },
          ringStyle(pulse2, 1.35),
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2 },
          ringStyle(pulse3, 1.5),
        ]}
      />

      {/* Main button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        accessibilityLabel="SOS Emergency Button"
        accessibilityRole="button"
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Ionicons name="notifications" size={iconSize} color="#FFFFFF" />
        <Text style={styles.label}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    backgroundColor: 'rgba(204, 0, 0, 0.15)',
  },
  button: {
    backgroundColor: '#CC0000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#CC0000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});
