import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSOS } from '../../hooks/useSoS';
import { CountdownTimer } from '../../components/sos/CountdownTimer';

export default function CountdownScreen() {
  const { countdownValue, startCountdown, cancelCountdown } = useSOS();

  useEffect(() => {
    startCountdown();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Sending SOS Alert...</Text>

        <CountdownTimer value={countdownValue} />

        <Text style={styles.subtitle}>
          Emergency services will be notified in {countdownValue} seconds
        </Text>

        {/* Red progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(countdownValue / 10) * 100}%` },
            ]}
          />
        </View>

        {/* Location info */}
        <View style={styles.locationBox}>
          <Text style={styles.locationLabel}>Sharing Location</Text>
          <Text style={styles.locationValue}>Live location tracking active</Text>
        </View>

        <TouchableOpacity onPress={cancelCountdown}>
          <Text style={styles.cancel}>Cancel SOS Alert</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  subtitle: {
    fontSize: 13,
    color: '#555555',
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#CC0000',
    borderRadius: 2,
  },
  locationBox: {
    alignItems: 'center',
    gap: 4,
  },
  locationLabel: {
    fontSize: 11,
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationValue: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  cancel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#CC0000',
    marginTop: 8,
  },
});
