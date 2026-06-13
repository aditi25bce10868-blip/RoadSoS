import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NearbyService } from '../../types/services.types';

interface Props {
  service: NearbyService | null;
  visible: boolean;
  onClose: () => void;
}

const RoutePreviewModal: React.FC<Props> = ({ service, visible, onClose }) => {
  if (!service) return null;

  const handleStartNavigation = () => {
    const query = encodeURIComponent(service.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open maps.')
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Route Preview</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.mapBox}>
            <Ionicons name="navigate-outline" size={40} color="#3B82F6" />
            <View style={styles.routeBadge}>
              <Text style={styles.routeBadgeText}>Fastest route selected</Text>
            </View>
          </View>

          <View style={styles.details}>
            <Text style={styles.destLabel}>Destination</Text>
            <Text style={styles.destName}>{service.name}</Text>

            <View style={styles.metaRow}>
              <View>
                <Text style={styles.metaLabel}>Distance</Text>
                <Text style={styles.metaValue}>{service.distanceKm} km</Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Estimated Time</Text>
                <Text style={styles.metaValue}>{service.etaMin} min</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={handleStartNavigation} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBox: {
    height: 180,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  routeBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  routeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  details: {
    marginBottom: 20,
  },
  destLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  destName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 40,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  startBtn: {
    backgroundColor: '#CC1818',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RoutePreviewModal;
