import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NearbyService } from '../../types/services.types';

interface Props {
  service: NearbyService;
  onNavigate: (service: NearbyService) => void;
  onCardPress: (service: NearbyService) => void;
}

const STATUS_COLOR: Record<string, string> = {
  available: '#22C55E',
  busy: '#F59E0B',
  closed: '#EF4444',
};

const NearbyServiceCard: React.FC<Props> = ({ service, onNavigate, onCardPress }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${service.phone}`).catch(() =>
      Alert.alert('Error', 'Unable to make a call.')
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onCardPress(service)} activeOpacity={0.9}>
      <View style={styles.topRow}>
        <View style={styles.leftBlock}>
          <View style={styles.iconBox}>
            <Ionicons name="medkit-outline" size={22} color="#CC1818" />
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{service.name}</Text>
            {service.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#3B82F6" style={{ marginLeft: 4 }} />
            )}
          </View>
          {service.subcategory ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{service.subcategory}</Text>
            </View>
          ) : null}
          <Text style={styles.address} numberOfLines={1}>{service.address}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.distance}>{service.distanceKm} km</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.eta}>{service.etaMin} min</Text>
          </View>
        </View>

        <View style={styles.statusBlock}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[service.status] }]} />
          <Text style={[styles.statusText, { color: STATUS_COLOR[service.status] }]}>
            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnCall} onPress={handleCall} activeOpacity={0.85}>
          <Ionicons name="call-outline" size={18} color="#FFFFFF" />
          <Text style={styles.btnCallText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnNavigate} onPress={() => onNavigate(service)} activeOpacity={0.85}>
          <Ionicons name="navigate-outline" size={18} color="#CC1818" />
          <Text style={styles.btnNavigateText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  leftBlock: {
    marginRight: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FDECEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#991B1B',
  },
  address: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  dot: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  eta: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnCall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CC1818',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  btnCallText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  btnNavigate: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  btnNavigateText: {
    color: '#CC1818',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NearbyServiceCard;
