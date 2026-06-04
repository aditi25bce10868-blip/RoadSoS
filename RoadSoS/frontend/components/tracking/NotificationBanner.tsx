import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationBannerProps {
  title?: string;
  message?: string;
}

export function NotificationBanner({
  title = 'Emergency services & contacts notified',
  message = 'All 3 emergency contacts alerted via SMS.',
}: NotificationBannerProps) {
  return (
    <View style={styles.banner}>
      <Ionicons name="checkmark-circle" size={17} color="#27500A" style={styles.icon} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#EAF3DE',
    borderWidth: 0.5,
    borderColor: '#639922',
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
    color: '#173404',
  },
  subtitle: {
    fontSize: 11,
    color: '#3B6D11',
    marginTop: 1,
  },
});
