import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSOS } from '../../hooks/useSoS';

export default function ConfirmationOtherModal() {
  const { startCountdown } = useSOS();

  const handleConfirm = () => {
    router.replace('/emergency/countdown' as any);
    setTimeout(() => startCountdown(), 100);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconCircle}>
            <Ionicons name="people" size={28} color="#CC0000" />
          </View>
          <Text style={styles.heading}>Report an Incident</Text>
          <Text style={styles.subtitle}>
            You are reporting an emergency for someone else. Confirming will
            alert nearby emergency services with your current location.
          </Text>
          <TouchableOpacity
            style={styles.btnRed}
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel="Yes, Report Incident"
          >
            <Text style={styles.btnRedText}>Yes, Report Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnGray}
            onPress={handleCancel}
            accessibilityRole="button"
          >
            <Text style={styles.btnGrayText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.warning}>
            False reports may result in unnecessary emergency response
          </Text>
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
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 26,
    paddingBottom: 20,
    width: 272,
    alignItems: 'center',
    gap: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(204,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111111',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 18,
  },
  btnRed: {
    width: '100%',
    paddingVertical: 13,
    backgroundColor: '#CC0000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  btnGray: {
    width: '100%',
    paddingVertical: 13,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGrayText: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '500',
  },
  warning: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
  },
});
