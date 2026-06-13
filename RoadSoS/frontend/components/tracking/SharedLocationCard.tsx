import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SOSLocation } from '../../types/sos.types';

interface SharedLocationCardProps {
  location: SOSLocation;
}

export function SharedLocationCard({ location }: SharedLocationCardProps) {
  return (
    <View style={styles.card}>
      <Ionicons name="location" size={17} color="#CC0000" style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.name}>{location.address}</Text>
        <Text style={styles.coord}>
          {location.latitude.toFixed(4)}° N, {Math.abs(location.longitude).toFixed(4)}° W
        </Text>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live location tracking active</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  icon: {
    marginTop: 1,
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111111',
  },
  coord: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E9A4E',
  },
  liveText: {
    fontSize: 10,
    color: '#27500A',
  },
});
