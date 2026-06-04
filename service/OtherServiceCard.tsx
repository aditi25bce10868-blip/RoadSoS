import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NearbyService, ServiceCategory } from '../../types/services.types';

interface Props {
  service: NearbyService;
  onPress: (service: NearbyService) => void;
}

const CATEGORY_ICONS: Record<ServiceCategory, keyof typeof Ionicons.glyphMap> = {
  hospital: 'medkit-outline',
  police: 'shield-outline',
  ambulance: 'car-outline',
  tow: 'car-outline',
  repair: 'construct-outline',
  pharmacy: 'bandage-outline',
  gas: 'flame-outline',
  clinic: 'fitness-outline',
  trauma: 'pulse-outline',
};

const STATUS_COLOR: Record<string, string> = {
  available: '#22C55E',
  busy: '#F59E0B',
  closed: '#EF4444',
};

const OtherServiceCard: React.FC<Props> = ({ service, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(service)} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons
            name={CATEGORY_ICONS[service.category] ?? 'help-circle-outline'}
            size={22}
            color="#CC1818"
          />
        </View>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: STATUS_COLOR[service.status] ?? '#9CA3AF' },
          ]}
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>{service.name}</Text>
      <Text style={styles.distance}>{service.distanceKm} km</Text>
      <Text style={styles.eta}>{service.etaMin} min</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    width: '47%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconBox: {
    backgroundColor: '#FDECEA',
    borderRadius: 10,
    padding: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  eta: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default OtherServiceCard;
