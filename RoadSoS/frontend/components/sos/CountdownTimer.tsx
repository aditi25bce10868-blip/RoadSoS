import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface CountdownTimerProps {
  value: number;
  total?: number;
  size?: number;
}

export function CountdownTimer({ value, total = 10, size = 148 }: CountdownTimerProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Subtle pulse on each tick
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.06,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [value]);

  const fontSize = size * 0.35;

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={[styles.number, { fontSize }]}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#CC0000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#CC0000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  number: {
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: undefined,
  },
});
