import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface AlertStatusProps {
  value: number;
  total?: number;
  address?: string;
}

export function AlertStatus({
  value,
  total = 10,
  address = 'Downtown, Main Street, Los Angeles',
}: AlertStatusProps) {
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: value / total,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [value, total]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sending SOS Alert...</Text>
      <Text style={styles.subtitle}>
        Emergency services will be notified in {value} second{value !== 1 ? 's' : ''}
      </Text>

      {/* Progress bar */}
      <View style={styles.trackBg}>
        <Animated.View
          style={[
            styles.trackFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Location card */}
      <View style={styles.locCard}>
        <View style={styles.locRow}>
          <Text style={styles.locIcon}>📍</Text>
          <View>
            <Text style={styles.locLabel}>Sharing Location</Text>
            <Text style={styles.locValue}>{address}</Text>
          </View>
        </View>
        <Text style={styles.liveText}>🟢 Live location tracking active</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111111',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  trackBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
  },
  trackFill: {
    height: 4,
    backgroundColor: '#CC0000',
    borderRadius: 4,
  },
  locCard: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  locIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  locLabel: {
    fontSize: 10,
    color: '#888888',
  },
  locValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111111',
  },
  liveText: {
    fontSize: 11,
    color: '#27500A',
  },
});
