import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SOSLocation } from '@/types/sos.types';

interface MapViewProps {
  location: SOSLocation | null;
}

/**
 * Simplified map placeholder that mirrors the design.
 * In production, replace the map-area with react-native-maps <MapView>.
 */
export function SOSMapView({ location }: MapViewProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.card}>
      {/* Map placeholder */}
      <View style={styles.mapArea}>
        {/* Buildings */}
        <View style={[styles.block, { width: 58, height: 38, top: 10, left: 55 }]} />
        <View style={[styles.block, { width: 42, height: 48, top: 9, left: 196 }]} />
        <View style={[styles.block, { width: 52, height: 34, top: 82, left: 48 }]} />
        <View style={[styles.block, { width: 46, height: 42, top: 88, left: 196 }]} />
        {/* Roads */}
        <View style={styles.roadH} />
        <View style={styles.roadV} />
        {/* Location label */}
        <View style={styles.yourLocation}>
          <Text style={styles.yourLocationText}>📍 Your Location</Text>
        </View>
        {/* Dots */}
        <View style={[styles.dot, styles.dotYou]} />
        {/* Pulsing red dot */}
        <Animated.View
          style={[
            styles.dotPulse,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />
        <View style={[styles.dot, styles.dotEmergency]} />
        <View style={[styles.dot, styles.dotService]} />
      </View>

      {/* Info row */}
      <View style={styles.infoRow}>
        <Text style={styles.infoPin}>📍</Text>
        <View>
          <Text style={styles.infoName}>
            {location?.address ?? 'Downtown, Main Street, Los Angeles'}
          </Text>
          <Text style={styles.infoCoord}>
            {location
              ? `${location.latitude.toFixed(4)}° N, ${Math.abs(location.longitude).toFixed(4)}° W`
              : '34.0522° N, 118.2437° W'}
          </Text>
          <View style={styles.liveRow}>
            <Animated.View style={[styles.liveDot, { opacity: blinkAnim }]} />
            <Text style={styles.liveText}>Live location tracking active</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  mapArea: {
    backgroundColor: '#C8D8EC',
    height: 148,
    position: 'relative',
  },
  block: {
    position: 'absolute',
    backgroundColor: '#A8BFD4',
    borderRadius: 3,
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    top: '50%',
    marginTop: -10,
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    left: '38%',
  },
  yourLocation: {
    position: 'absolute',
    top: '22%',
    left: '18%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  yourLocationText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#111111',
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dotYou: {
    backgroundColor: '#FF6600',
    top: '34%',
    left: '22%',
  },
  dotEmergency: {
    backgroundColor: '#CC0000',
    width: 13,
    height: 13,
    borderRadius: 6.5,
    top: '50%',
    left: '49%',
    marginTop: -6.5,
    marginLeft: -6.5,
  },
  dotPulse: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(204,0,0,0.14)',
    top: '50%',
    left: '49%',
    marginTop: -19,
    marginLeft: -19,
  },
  dotService: {
    backgroundColor: '#1A6FC4',
    width: 11,
    height: 11,
    borderRadius: 5.5,
    top: '54%',
    left: '65%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 9,
    gap: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  infoPin: {
    fontSize: 16,
    marginTop: 1,
  },
  infoName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
  },
  infoCoord: {
    fontSize: 10,
    color: '#888888',
    marginTop: 1,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
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
