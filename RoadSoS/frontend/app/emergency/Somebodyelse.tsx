import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../components/layout/Header';
import { MapViewComponent } from '../../components/maps/MapView';
import { NetworkWarningBanner } from '../../components/tracking/NetworkWarningBanner';
import { useSOSStore } from '../../store/sosStore';
import { useLocation } from '../../hooks/useLocation';

const NEARBY_SERVICES = [
  { id: 'ns-1', name: 'City Ambulance Service', phone: '+15559110000', icon: 'medkit' as const },
  { id: 'ns-2', name: 'Downtown Police Station', phone: '+15559110001', icon: 'shield' as const },
  { id: 'ns-3', name: 'City Fire Department',   phone: '+15559110002', icon: 'flame'  as const },
];

export default function SomebodyElseScreen() {
  const router = useRouter();
  const { cancelSOS } = useSOSStore();
  const { location } = useLocation();
  // Simple network warning flag; replace with real network status hook if available
  const networkWarning = false;

  const handleCancelAlert = () => {
    cancelSOS();
    router.replace('/(tabs)/sos');
  };

  const handleFindServices = () => {
    // In production, open a map search or nearby-services list
    const lat = location?.latitude ?? 34.0522;
    const lng = location?.longitude ?? -118.2437;
    Linking.openURL(`https://www.google.com/maps/search/emergency+services/@${lat},${lng},15z`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Nav bar */}
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Low network warning */}
        {networkWarning && (
          <NetworkWarningBanner message="Your network connection is weak. Some features may be limited or delayed." />
        )}

        {/* Orange info banner */}
        <View style={styles.orangeBanner}>
          <Ionicons name="information-circle-outline" size={20} color="#7C2D12" style={{ marginTop: 1 }} />
          <Text style={styles.orangeText}>
            If someone else needs emergency help, call the relevant services directly
            or use the button below to find nearby emergency responders.
          </Text>
        </View>

        {/* Live Tracking map */}
        <Text style={styles.sectionTitle}>Live Tracking</Text>
        <MapViewComponent
          address={location?.address ?? 'Downtown, Main Street, Los Angeles'}
          latitude={location?.latitude ?? 34.0522}
          longitude={location?.longitude ?? -118.2437}
        />

        {/* Quick-call emergency services */}
        <Text style={styles.sectionTitle}>Nearby Emergency Services</Text>
        <View style={styles.servicesCard}>
          {NEARBY_SERVICES.map((svc, idx) => (
            <View
              key={svc.id}
              style={[
                styles.serviceRow,
                idx < NEARBY_SERVICES.length - 1 && styles.serviceRowBorder,
              ]}
            >
              <View style={styles.serviceIcon}>
                <Ionicons name={svc.icon} size={18} color="#CC0000" />
              </View>
              <Text style={styles.serviceName}>{svc.name}</Text>
              <TouchableOpacity
                style={styles.callChip}
                onPress={() => Linking.openURL(`tel:${svc.phone}`)}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={14} color="#fff" />
                <Text style={styles.callChipText}>Call</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Find on map button */}
        <TouchableOpacity style={styles.findBtn} onPress={handleFindServices} activeOpacity={0.85}>
          <Ionicons name="location" size={18} color="#fff" />
          <Text style={styles.findBtnText}>Find Nearby Emergency Services</Text>
        </TouchableOpacity>

        {/* Cancel alert */}
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelAlert} activeOpacity={0.85}>
          <Ionicons name="shield-outline" size={18} color="#111" />
          <Text style={styles.cancelBtnText}>Cancel Alert</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  body: {
    padding: 14,
    gap: 12,
    paddingBottom: 32,
  },

  // Orange info banner
  orangeBanner: {
    backgroundColor: '#FFF7ED',
    borderWidth: 2,
    borderColor: '#F97316',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  orangeText: {
    flex: 1,
    fontSize: 12,
    color: '#7C2D12',
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },

  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111',
    marginBottom: 4,
  },

  // Services quick-call card
  servicesCard: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    overflow: 'hidden',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  serviceRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(204,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  serviceName: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#111',
  },
  callChip: {
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  callChipText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },

  // Find on map button
  findBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  findBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Cancel
  cancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#111',
  },
});
