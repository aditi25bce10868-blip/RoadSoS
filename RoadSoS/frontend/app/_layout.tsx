import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import NotificationBanner from '../components/ui/NotificationBanner';
import { useNotification } from '../hooks/useNotification';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { onAuthChanged } from '../services/api/authApi';

export default function RootLayout() {
  const { banner, hide, notify } = useNotification();
  const { pendingType, clearNotification } = useNotificationStore();
  const { setUser, setInitialized } = useAuthStore();
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

  // Keep Zustand auth store in sync with Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setUser(user);
      setInitialized(true);
    });
    return unsubscribe;
  }, [setUser, setInitialized]);

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
