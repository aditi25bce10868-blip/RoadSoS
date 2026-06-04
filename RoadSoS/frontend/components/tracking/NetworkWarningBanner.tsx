import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NetworkWarningBannerProps {
  message?: string;
}

export function NetworkWarningBanner({
  message = 'Location updates may be delayed. Move to open area.',
}: NetworkWarningBannerProps) {
  return (
    <View style={styles.banner}>
      <Ionicons name="wifi-outline" size={17} color="#854F0B" style={styles.icon} />
      <View>
        <Text style={styles.title}>Low network signal</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FAEEDA',
    borderWidth: 0.5,
    borderColor: '#EF9F27',
    borderRadius: 10,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  icon: {
    marginTop: 1,
    flexShrink: 0,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#633806',
  },
  subtitle: {
    fontSize: 11,
    color: '#854F0B',
    marginTop: 1,
  },
});
