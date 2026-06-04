import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  /** Override the subtitle shown under RoadSOS */
  subtitle?: string;
  /** Background colour – defaults to white */
  backgroundColor?: string;
  /** Tint colour for text/icon – defaults to dark */
  light?: boolean;
  /** Number of unread notifications shown on the bell badge */
  notificationCount?: number;
  onBellPress?: () => void;
}

export function Header({
  subtitle = 'Emergency Response',
  backgroundColor = '#FFFFFF',
  light = false,
  notificationCount = 0,
  onBellPress,
}: HeaderProps) {
  const textColor = light ? '#FFFFFF' : '#111111';
  const subColor = light ? 'rgba(255,255,255,0.75)' : '#666666';

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

      {/* Bell */}
      <TouchableOpacity
        style={styles.bellBtn}
        onPress={onBellPress}
        accessibilityLabel="Notifications"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={light ? '#FFFFFF' : '#111111'}
        />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    gap: 10,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  bellBtn: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 1,
    right: 1,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFD600',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#7A5F00',
  },
});
