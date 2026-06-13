import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MapViewComponentProps {
  address?: string;
  latitude?: number;
  longitude?: number;
}

export function MapViewComponent({
  address = 'Downtown, Main Street, Los Angeles',
  latitude = 34.0522,
  longitude = -118.2437,
}: MapViewComponentProps) {
  // Pulse ring: scale and opacity must be separate Animated.Values
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.7)).current;
  // Live dot blink
  const blinkOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse ring
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, { toValue: 1.6, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseScale, { toValue: 1.0, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Blink
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkOpacity, { toValue: 0.15, duration: 600, useNativeDriver: true }),
        Animated.timing(blinkOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Cleanup
    return () => {
      pulseScale.stopAnimation();
      pulseOpacity.stopAnimation();
      blinkOpacity.stopAnimation();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.card}>
      {/* Map illustration */}
      <View style={styles.mapArea}>
        {/* Roads */}
        <View style={styles.roadH} />
        <View style={styles.roadV} />

        {/* Buildings */}
        <View style={[styles.block, { width: 58, height: 38, top: 10, left: 55 }]} />
        <View style={[styles.block, { width: 42, height: 48, top: 9, left: 196 }]} />
        <View style={[styles.block, { width: 52, height: 34, top: 82, left: 48 }]} />
        <View style={[styles.block, { width: 46, height: 42, top: 88, left: 196 }]} />

        {/* Your Location chip */}
        <View style={styles.locationLabel}>
          <Ionicons name="location" size={11} color="#CC0000" />
          <Text style={styles.locationLabelText}>Your Location</Text>
        </View>

        {/* User dot */}
        <View style={[styles.dot, styles.dotUser]} />

        {/* Pulse ring — MUST be its own Animated.View, separate from the pin dot */}
        <Animated.View
          style={[
            styles.pulseRing,
            { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
          ]}
        />

        {/* Emergency pin */}
        <View style={[styles.dot, styles.dotEmergency]} />

        {/* Service dot */}
        <View style={[styles.dot, styles.dotService]} />
      </View>

      {/* Info bar */}
      <View style={styles.infoBar}>
        <Ionicons name="location" size={16} color="#CC0000" />
        <View style={styles.infoText}>
          <Text style={styles.infoName} numberOfLines={1}>{address}</Text>
          <Text style={styles.infoCoord}>
            {latitude.toFixed(4)}° N, {Math.abs(longitude).toFixed(4)}° W
          </Text>
          <View style={styles.liveRow}>
            <Animated.View style={[styles.liveDot, { opacity: blinkOpacity }]} />
            <Text style={styles.liveText}>Live location tracking active</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  mapArea: {
    backgroundColor: '#C8D8EC',
    height: 148,
    position: 'relative',
    overflow: 'hidden',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20,
    top: '44%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 20,
    left: '38%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  block: {
    position: 'absolute',
    backgroundColor: '#a8bfd4',
    borderRadius: 3,
  },
  locationLabel: {
    position: 'absolute',
    top: '16%',
    left: '12%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  locationLabelText: {
    fontSize: 10,
    color: '#111',
    fontWeight: '500',
    marginLeft: 3,
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },
  dotUser: {
    width: 12,
    height: 12,
    backgroundColor: '#FF6600',
    top: '30%',
    left: '18%',
  },
  dotEmergency: {
    width: 14,
    height: 14,
    backgroundColor: '#CC0000',
    top: '44%',
    left: '47%',
    zIndex: 2,
  },
  // Pulse ring is a completely separate view — never mix with dotEmergency
  pulseRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(204,0,0,0.22)',
    top: '44%',
    left: '47%',
    marginTop: -13,
    marginLeft: -13,
    zIndex: 1,
  },
  dotService: {
    width: 11,
    height: 11,
    backgroundColor: '#1A6FC4',
    top: '52%',
    left: '63%',
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E5',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
  },
  infoName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111',
  },
  infoCoord: {
    fontSize: 10,
    color: '#888',
    marginTop: 1,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E9A4E',
    marginRight: 5,
  },
  liveText: {
    fontSize: 10,
    color: '#27500A',
  },
});
