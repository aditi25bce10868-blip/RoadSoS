import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSOSStore } from '../../store/sosStore';
import { ETACard } from '../../components/tracking/ETACard';
import  {MapViewComponent}  from '../../components/maps/MapView';
import { NetworkWarningBanner } from '../../components/tracking/NetworkWarningBanner';
import { NotificationBanner } from '../../components/tracking/NotificationBanner';
import { RespondingServiceCard } from '../../components/tracking/RespondingServiceCard';
import { EmergencyContactCard } from '../../components/tracking/EmergencyContactCard';
import { SharedLocationCard } from '../../components/tracking/SharedLocationCard';

export default function TrackingScreen() {
  const { sos, reset } = useSOSStore();

  const handleCancel = () => {
    reset();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Red header */}
      <View style={styles.redHeader}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
              <Ionicons name="notifications" size={19} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>SOS Alert Active</Text>
              <Text style={styles.headerSub}>Help is on the way</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellBtn} accessibilityLabel="Notifications">
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleCancel}
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ETACard minutes={sos.etaMinutes ?? 8} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Tracking */}
        <View>
          <Text style={styles.sectionTitle}>Live Tracking</Text>
          <View style={styles.banners}>
            <NetworkWarningBanner />
            <NotificationBanner />
          </View>
          {sos.location && (
            // @ts-ignore - MapViewComponent props differ; pass location at runtime
            <MapViewComponent initialLocation={sos.location} />
          )}
        </View>

        {/* Responding Services */}
        <View style={styles.serviceSection}>
          <View style={styles.serviceSectionHeader}>
            <Text style={styles.sectionTitleInCard}>Responding Services</Text>
          </View>
          <View style={styles.serviceList}>
            {sos.respondingServices.map((svc) => (
              <RespondingServiceCard key={svc.id} service={svc} />
            ))}
          </View>
        </View>

        {/* Emergency Contacts */}
        <View>
          <Text style={styles.sectionTitle}>Emergency Contacts — Manual</Text>
          <View style={styles.contactList}>
            {sos.emergencyContacts.map((contact) => (
              <EmergencyContactCard key={contact.id} contact={contact} />
            ))}
          </View>
        </View>

        {/* Shared Location */}
        {sos.location && (
          <View style={styles.sharedSection}>
            <View style={styles.serviceSectionHeader}>
              <Text style={styles.sectionTitleInCard}>Shared Location</Text>
            </View>
            <View style={{ padding: 14 }}>
              <SharedLocationCard location={sos.location} />
            </View>
          </View>
        )}

        {/* Cancel */}
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#111111" />
          <Text style={styles.cancelText}>I'm Safe - Cancel Alert</Text>
        </TouchableOpacity>
        <Text style={styles.cancelNote}>Only cancel if you're safe and don't need help</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  redHeader: {
    backgroundColor: '#CC0000',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellBtn: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFD600',
    borderWidth: 2,
    borderColor: '#CC0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#7A5F00',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  body: {
    padding: 14,
    paddingBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 8,
  },
  banners: {
    gap: 8,
    marginBottom: 8,
  },
  serviceSection: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  serviceSectionHeader: {
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F7F7F7',
  },
  sectionTitleInCard: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  serviceList: {
    padding: 12,
    gap: 8,
  },
  contactList: {
    gap: 8,
  },
  sharedSection: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111111',
  },
  cancelNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#AAAAAA',
  },
});
