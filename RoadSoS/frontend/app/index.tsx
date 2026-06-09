import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    const checkFlow = async () => {
         await AsyncStorage.clear();
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');

      if (!isLoggedIn) {
        router.replace('/(auth)/login');
      } else if (!hasOnboarded) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)/sos');
      }
    };

    checkFlow();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#CC0000" size="large" />
    </View>
  );
}
