import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSOSStore } from '../../store/sosStore';

export default function WhoNeedsHelpModal() {
  const { setWhoNeedsHelp } = useSOSStore();

  const handleSelf = () => {
    setWhoNeedsHelp('self');
    router.push('/emergency/confirmation');
  };

 const handleOther = () => {
  setWhoNeedsHelp('other');
  router.push('/emergency/confirmationOther');
};

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconCircle}>
            <Ionicons name="alert-circle" size={28} color="#CC0000" />
          </View>

          <Text style={styles.heading}>Who Needs Help?</Text>
          <Text style={styles.subtitle}>
            Please select who requires emergency assistance
          </Text>

          <TouchableOpacity style={styles.btnRed} onPress={handleSelf} accessibilityRole="button">
            <Ionicons name="person" size={16} color="#FFFFFF" />
            <Text style={styles.btnRedText}>I Want Help</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={handleOther} accessibilityRole="button">
            <Ionicons name="people" size={16} color="#CC0000" />
            <Text style={styles.btnOutlineText}>Somebody Else Wants Help</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCancel} accessibilityRole="button" style={styles.cancelLink}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnRedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  btnOutline: {
    width: '100%',
    paddingVertical: 13,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#CC0000',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnOutlineText: {
    color: '#CC0000',
    fontSize: 13,
    fontWeight: '500',
  },
  cancelLink: {
    padding: 3,
  },
  cancelText: {
    fontSize: 12,
    color: '#888888',
  },
});
