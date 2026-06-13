import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import SettingToggle from '../../components/ui/SettingToggle';
import SettingRow from '../../components/ui/SettingRow';
import  Colors  from '../../constants/color';
import { triggerNotification } from '../../store/notificationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';


export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [autoCall, setAutoCall] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        // hasOnboarded is NOT removed — onboarding won't show again
        router.replace('/(auth)/login');
      } }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Settings</Text>
        </View>

        <SectionLabel label="APPEARANCE" />
        <View style={styles.section}>
          <Card style={styles.cardReset}>
            <SettingToggle
              icon="moon" iconBg="rgba(99,102,241,0.1)" iconColor="#6366F1"
              label="Dark Mode" sub="Easy on the eyes at night"
              value={darkMode} onChange={setDarkMode} trackOn="#6366F1"
            />
          </Card>
        </View>

        <SectionLabel label="NOTIFICATIONS" />
        <View style={styles.section}>
          <Card style={styles.cardReset}>
            <SettingToggle
              icon="notifications" iconBg="rgba(66,133,244,0.1)" iconColor="#4285F4"
              label="Push Notifications" sub="Emergency alerts & updates"
              value={pushNotif} onChange={setPushNotif} trackOn="#4285F4"
            />
          </Card>
        </View>

        <SectionLabel label="EMERGENCY" />
        <View style={styles.section}>
          <Card style={styles.cardReset}>
            <SettingToggle
              icon="call" iconBg="rgba(240,45,75,0.1)" iconColor={Colors.primary}
              label="Auto-Call 911" sub="Call emergency when SOS triggered"
              value={autoCall} onChange={setAutoCall} trackOn={Colors.primary}
            />
          </Card>
        </View>

        <SectionLabel label="GENERAL" />
        <View style={styles.section}>
          <Card style={styles.cardReset}>
            <SettingRow
              icon="globe" iconBg="rgba(52,168,83,0.1)" iconColor="#34A853"
              label="Language" sub="English"
            />
          </Card>
        </View>

        <SectionLabel label="ABOUT" />
        <View style={styles.section}>
          <Card style={styles.cardReset}>
            <SettingRow
              icon="information-circle" iconBg={Colors.background} iconColor={Colors.textSecondary}
              label="App Version" sub="v1.0.0"
            />
          </Card>
        </View>

        <View style={styles.logoutWrap}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const SectionLabel = ({ label }: { label: string }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  titleRow: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 0.5, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  section: { paddingHorizontal: 16 },
  cardReset: { padding: 0 },
  logoutWrap: { paddingHorizontal: 16, marginTop: 24 },
  logoutBtn: {
    borderRadius: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.error,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(229,62,62,0.05)',
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: Colors.error },
});
