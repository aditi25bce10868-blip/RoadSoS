// frontend/components/ui/NotificationBanner.tsx
// Slide-down banner notification — shows for 3 seconds then disappears

import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';

export interface BannerData {
  type:    string;
  icon:    string;
  title:   string;
  message: string;
  color:   string;  // border accent color
}

interface Props {
  banner:   BannerData | null;
  onHide:   () => void;
}

export default function NotificationBanner({ banner, onHide }: Props) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timerRef  = useRef<any>(null);

  useEffect(() => {
    if (!banner) return;

    // Slide in
    Animated.spring(slideAnim, {
      toValue:         0,
      useNativeDriver: true,
      tension:         80,
      friction:        10,
    }).start();

    // Auto hide after 3.5 sec
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => hide(), 3500);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [banner]);

  const hide = () => {
    Animated.timing(slideAnim, {
      toValue:         -100,
      duration:        250,
      useNativeDriver: true,
    }).start(() => onHide());
  };

  if (!banner) return null;

  return (
    <Animated.View style={[
      styles.banner,
      { borderLeftColor: banner.color, transform: [{ translateY: slideAnim }] }
    ]}>
      <TouchableOpacity style={styles.inner} onPress={hide} activeOpacity={0.9}>
        <Text style={styles.icon}>{banner.icon}</Text>
        <View style={styles.textBox}>
          <Text style={styles.title}>{banner.title}</Text>
          <Text style={styles.message} numberOfLines={2}>{banner.message}</Text>
        </View>
        <TouchableOpacity onPress={hide} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner:   { position: 'absolute', top: 48, left: 12, right: 12, zIndex: 9999, backgroundColor: '#1c1c1c', borderRadius: 12, borderLeftWidth: 4, elevation: 8 },
  inner:    { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  icon:     { fontSize: 22 },
  textBox:  { flex: 1 },
  title:    { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  message:  { color: '#aaa', fontSize: 12, lineHeight: 16 },
  closeBtn: { padding: 4 },
  closeText:{ color: '#666', fontSize: 12 },
});
