import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import NotificationBanner from '../components/ui/NotificationBanner';
import { useNotification } from '../hooks/useNotification';
import { useNotificationStore } from '../store/notificationStore';

export default function RootLayout() {
  const { banner, hide, notify } = useNotification();
  const { pendingType, clearNotification } = useNotificationStore();
  const [ready, setReady] = useState(false);  // ← ADD

  useEffect(() => {
    if (!pendingType) return;
    const key = pendingType as keyof typeof notify;
    if (notify[key]) notify[key]();
    clearNotification();
  }, [pendingType]);

  useEffect(() => {
    const init = async () => {
      await Location.requestForegroundPermissionsAsync();
      setReady(true);  // ← only render after permissions
    };
    init();
  }, []);

  // ← Show nothing until ready
  if (!ready) {
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#FFFFFF',  // force white
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <StatusBar style="dark" />
      <ActivityIndicator color="#CC0000" size="large" />
    </View>
  );
}

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="(auth)"
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="emergency" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <NotificationBanner banner={banner} onHide={hide} />
    </View>
  );
}
