import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NearbyServiceCard from '../../components/maps/NearbyServiceCard';
import OtherServiceCard from '../../components/maps/OtherServiceCard';
import ServiceDetailModal from '../../components/maps/ServiceDetailModal';
import RoutePreviewModal from '../../components/maps/RoutePreviewModal';
import { NearbyService, FilterTab } from '../../types/services.types';
import { MAIN_SERVICES, OTHER_SERVICES } from '../../constants/serviceData';

const FILTER_TABS: {
  key: FilterTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'hospitals', label: 'Hospitals', icon: 'medkit-outline' },
  { key: 'police', label: 'Police', icon: 'shield-outline' },
  { key: 'ambulance', label: 'Ambulance', icon: 'car-outline' },
];

export default function ServicesScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('hospitals');
  const [selectedService, setSelectedService] = useState<NearbyService | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [routeVisible, setRouteVisible] = useState(false);
  const [routeService, setRouteService] = useState<NearbyService | null>(null);

  const handleCardPress = (service: NearbyService) => {
    setSelectedService(service);
    setDetailVisible(true);
  };

  const handleNavigate = (service: NearbyService) => {
    setDetailVisible(false);
    setRouteService(service);
    setRouteVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setSelectedService(null);
  };

  const handleCloseRoute = () => {
    setRouteVisible(false);
    setRouteService(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Nearby Emergency Services</Text>
          <Text style={styles.subheading}>Emergency help around your current location</Text>
        </View>

        {/* GPS + Location + Refresh row */}
        <View style={styles.locationRow}>
          <View style={styles.gpsPill}>
            <View style={styles.gpsDot} />
            <Text style={styles.gpsText}>Live GPS detected</Text>
          </View>
          <View style={styles.locationPill}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.locationText}>Downtown, City Center</Text>
          </View>
          <TouchableOpacity style={styles.refreshPill}>
            <Ionicons name="refresh-outline" size={14} color="#CC1818" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                activeFilter === tab.key && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(tab.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={activeFilter === tab.key ? '#FFFFFF' : '#374151'}
              />
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === tab.key && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Available Near You */}
        <Text style={styles.sectionTitle}>Available Near You</Text>

        {MAIN_SERVICES.map((service) => (
          <NearbyServiceCard
            key={service.id}
            service={service}
            onNavigate={handleNavigate}
            onCardPress={handleCardPress}
          />
        ))}

        {/* Other Nearby Services */}
        <Text style={styles.sectionTitle}>Other Nearby Services</Text>

        <View style={styles.otherGrid}>
          {OTHER_SERVICES.map((service) => (
            <OtherServiceCard
              key={service.id}
              service={service}
              onPress={handleCardPress}
            />
          ))}
        </View>
      </ScrollView>

      <ServiceDetailModal
        service={selectedService}
        visible={detailVisible}
        onClose={handleCloseDetail}
        onNavigate={handleNavigate}
      />

      <RoutePreviewModal
        service={routeService}
        visible={routeVisible}
        onClose={handleCloseRoute}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerBlock: {
    paddingTop: 20,
    marginBottom: 14,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  gpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  gpsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationText: {
    fontSize: 12,
    color: '#374151',
  },
  refreshPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CC1818',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#CC1818',
    borderColor: '#CC1818',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginTop: 4,
  },
  otherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
