import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ETACardProps {
  minutes: number;
  progressPercent?: number;
}

export function ETACard({ minutes, progressPercent = 68 }: ETACardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Estimated Arrival</Text>
        <View style={styles.livePill}>
          <Text style={styles.livePillText}>Live</Text>
        </View>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{minutes}</Text>
        <Text style={styles.unit}>minutes</Text>
      </View>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 11,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  livePill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 9,
  },
  livePillText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginBottom: 2,
  },
  value: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 38,
  },
  unit: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  barBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 4,
    marginTop: 9,
  },
  barFill: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
});
