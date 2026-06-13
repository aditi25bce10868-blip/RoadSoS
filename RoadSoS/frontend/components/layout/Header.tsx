import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  subtitle?: string;
  backgroundColor?: string;
  light?: boolean;
}

export function Header({
  subtitle = 'Emergency Response',
  backgroundColor = '#FFFFFF',
  light = false,
}: HeaderProps) {
  const textColor = light ? '#FFFFFF' : '#111111';
  const subColor = light ? 'rgba(255,255,255,0.75)' : '#888888';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Logo */}
      <View style={[styles.logoCircle, light && styles.logoCircleLight]}>
        <Ionicons name="notifications" size={18} color="#FFFFFF" />
      </View>

      {/* Title block */}
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: textColor }]}>RoadSOS</Text>
        <Text style={[styles.subtitle, { color: subColor }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#CC0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircleLight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
    fontWeight: '400',
  },

});
