import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { SOSButton } from '@/components/sos/SOSButton';

export default function SOSScreen() {
  const handleSOSPress = () => {
    router.push('/emergency/whoNeedsHelp');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header notificationCount={3} />

      <View style={styles.body}>
        <SOSButton onPress={handleSOSPress} />
        <Text style={styles.hint}>Tap the SOS button in case of emergency</Text>
      </View>

      {/* Bottom tab bar (single item in this flow) */}
      <View style={styles.bottomBar}>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabLabel}>Home</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
  },
  hint: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  bottomBar: {
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    alignItems: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 11,
    color: '#CC0000',
  },
});
