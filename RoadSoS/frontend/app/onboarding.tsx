// frontend/app/onboarding.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { storage } from '../utils/storage';
import { triggerNotification } from '../store/notificationStore';

export default function OnboardingScreen() {
  const handleEnable = async () => {
   await  storage.setItem('detectionEnabled', 'true');
    await storage.setItem('onboardingDone',   'true');
    triggerNotification('detectionEnabled'); 
    router.replace('/(tabs)/sos' );
  };

  const handleLater =async () => {
   await storage.setItem('detectionEnabled', 'false');
   await storage.setItem('onboardingDone',   'true');
    router.replace('/(tabs)/sos' );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🚨</Text>
      <Text style={styles.title}>Auto Accident Detection</Text>
      <Text style={styles.subtitle}>
        RoadSOS can detect possible accidents using motion and location sensors
        and automatically trigger emergency assistance if you are unable to respond.
      </Text>

      <View style={styles.featureBox}>
        <Text style={styles.featureItem}>✔ Works only during emergencies</Text>
        <Text style={styles.featureItem}>✔ Uses temporary tracking</Text>
        <Text style={styles.featureItem}>✔ Can be turned off anytime in Settings</Text>
        <Text style={styles.featureItem}>✔ 10 second countdown before SOS</Text>
        <Text style={styles.featureItem}>✔ Multi-sensor detection reduces false alarms</Text>
      </View>

      <TouchableOpacity style={styles.enableBtn} onPress={handleEnable}>
        <Text style={styles.enableBtnText}>🛡 Enable Protection</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.laterBtn} onPress={handleLater}>
        <Text style={styles.laterBtnText}>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0f0f0f', padding: 28, justifyContent: 'center', alignItems: 'center' },
  icon:          { fontSize: 64, marginBottom: 20 },
  title:         { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 14 },
  subtitle:      { fontSize: 15, color: '#aaa', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  featureBox:    { backgroundColor: '#1c1c1c', borderRadius: 12, padding: 18, width: '100%', marginBottom: 32, gap: 10 },
  featureItem:   { color: '#4caf50', fontSize: 14 },
  enableBtn:     { backgroundColor: '#e53935', borderRadius: 14, padding: 18, width: '100%', alignItems: 'center', marginBottom: 12 },
  enableBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  laterBtn:      { padding: 12 },
  laterBtnText:  { color: '#666', fontSize: 15 },
});
