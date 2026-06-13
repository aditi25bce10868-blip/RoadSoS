import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmergencyContact } from '../../types/sos.types';

interface EmergencyContactCardProps {
  contact: EmergencyContact;
}

export function EmergencyContactCard({ contact }: EmergencyContactCardProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Ionicons
            name={contact.avatarIcon === 'heart' ? 'heart' : 'person'}
            size={20}
            color="#CC0000"
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.role}>{contact.role}</Text>
          <Text style={styles.phone}>{contact.phone}</Text>
        </View>
      </View>

      {contact.notified && (
        <View style={styles.notifiedRow}>
          <Ionicons name="checkmark-circle" size={12} color="#27500A" />
          <Text style={styles.notifiedText}>Notified via SMS</Text>
        </View>
      )}

      <TouchableOpacity style={styles.callBtn} onPress={handleCall} accessibilityLabel={`Call ${contact.name}`}>
        <Ionicons name="call" size={14} color="#FFFFFF" />
        <Text style={styles.callText}>Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(204,0,0,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  role: {
    fontSize: 12,
    color: '#888888',
    marginTop: 1,
  },
  phone: {
    fontSize: 12,
    color: '#888888',
    marginTop: 1,
  },
  notifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  notifiedText: {
    fontSize: 11,
    color: '#27500A',
  },
  callBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  callText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
