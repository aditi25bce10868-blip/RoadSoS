import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { auth } from '../services/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function Index() {
  useEffect(() => {
    // Wait for Firebase to resolve the persisted session, then route accordingly.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // No session — go to login
        router.replace('/(auth)/login');
      } else {
        // User is authenticated — check onboarding status
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
        if (!hasOnboarded) {
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)/sos');
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#CC0000" size="large" />
    </View>
  );
}
