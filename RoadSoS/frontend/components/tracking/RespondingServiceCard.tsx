import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RespondingService, ServiceStatus } from '../../types/sos.types';

interface RespondingServiceCardProps {
  service: RespondingService;
}

const STATUS_LABEL: Record<ServiceStatus, string> = {
  en_route: 'En route',
  dispatched: 'Dispatched',
  arrived: 'Arrived',
};

export function RespondingServiceCard({ service }: RespondingServiceCardProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${service.phone}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{service.name}</Text>
          <Text style={styles.type}>{service.type.charAt(0).toUpperCase() + service.type.slice(1)}</Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{STATUS_LABEL[service.status]}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color="#888" />
          <Text style={styles.metaText}>{service.etaMinutes} min</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="navigate-outline" size={13} color="#888" />
          <Text style={styles.metaText}>{service.distanceKm} km</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.callBtn} onPress={handleCall} accessibilityLabel={`Call ${service.name}`}>
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
    borderRadius: 12,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  type: {
    fontSize: 10,
    color: '#888888',
    marginTop: 1,
  },
  statusPill: {
    backgroundColor: '#EAF3DE',
    borderWidth: 0.5,
    borderColor: '#639922',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#27500A',
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 7,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: '#888888',
  },
  callBtn: {
    marginTop: 10,
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
