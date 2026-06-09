import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { router } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { SOSButton } from '../../components/sos/SoSButton';

export default function SOSScreen() {
  const handleSOSPress = () => {
    router.push('/emergency/whoNeedsHelp');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header />
      <View style={styles.body}>
        <SOSButton onPress={handleSOSPress} />
        <Text style={styles.hint}>Tap the SOS button in case of emergency</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
});
