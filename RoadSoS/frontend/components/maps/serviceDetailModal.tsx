import React, { useState } from 'react';
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
import { NearbyService, ServiceCategory } from '../../types/services.types';

interface Props {
  service: NearbyService | null;
  visible: boolean;
  onClose: () => void;
  onNavigate: (service: NearbyService) => void;
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

const ServiceDetailModal: React.FC<Props> = ({ service, visible, onClose, onNavigate }) => {
  const [calling, setCalling] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  if (!service) return null;

  const handleCall = () => {
    setCalling(true);
    Linking.openURL(`tel:${service.phone}`).catch(() =>
      Alert.alert('Error', 'Unable to make a call.')
    );
    setTimeout(() => setCalling(false), 3000);
  };

  const handleSMS = () => {
    Linking.openURL(`sms:${service.phone}`).catch(() =>
      Alert.alert('Error', 'Unable to open SMS.')
    );
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  const handleNavigate = () => {
    onNavigate(service);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {smsSent && (
            <View style={styles.toast}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.toastText}>SMS sent successfully</Text>
            </View>
          )}

          <View style={styles.modalHeader}>
            <View style={styles.serviceIconBox}>
              <Ionicons
                name={CATEGORY_ICONS[service.category] ?? 'help-circle-outline'}
                size={22}
                color="#CC1818"
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[service.status] }]} />
                <Text style={[styles.statusText, { color: STATUS_COLOR[service.status] }]}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.mapPlaceholder}>
            <Ionicons name="location" size={36} color="#3B82F6" />
          </View>

          <View style={styles.detailsBlock}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{service.address}</Text>

            <View style={styles.metaGrid}>
              <View>
                <Text style={styles.label}>Distance</Text>
                <Text style={styles.valueBold}>{service.distanceKm} km</Text>
              </View>
              <View>
                <Text style={styles.label}>ETA</Text>
                <Text style={styles.valueBold}>{service.etaMin} min</Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btnCall, calling && styles.btnCallActive]}
              onPress={handleCall}
              activeOpacity={0.85}
            >
              <Ionicons name="call-outline" size={18} color="#FFFFFF" />
              <Text style={styles.btnCallText}>{calling ? 'Calling...' : 'Call'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnNavigate} onPress={handleNavigate} activeOpacity={0.85}>
              <Ionicons name="navigate-outline" size={18} color="#CC1818" />
              <Text style={styles.btnNavigateText}>Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSMS} onPress={handleSMS} activeOpacity={0.85}>
              <Ionicons name="chatbox-outline" size={18} color="#6B7280" />
              <Text style={styles.btnSMSText}>SMS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  toast: {
    position: 'absolute',
    top: -52,
    alignSelf: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
    zIndex: 10,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FDECEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: {
    height: 130,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  detailsBlock: {
    marginBottom: 20,
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 12,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 40,
  },
  valueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
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
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  btnCallActive: {
    backgroundColor: '#991818',
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
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  btnNavigateText: {
    color: '#CC1818',
    fontSize: 14,
    fontWeight: '600',
  },
  btnSMS: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  btnSMSText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ServiceDetailModal;
