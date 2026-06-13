import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Card from '../../components/ui/Card';
import SettingToggle from '../../components/ui/SettingToggle';
import Colors from '../../constants/color';
import { triggerNotification } from '../../store/notificationStore';

const AVATARS = ['😊', '👤', '⭐', '⚡', '🌸', '🔥', '💎', '🚗'];
const AVATAR_BG = ['#FF8C42', '#5B6DD6', '#2ECC71', '#9B59B6', '#E91E8C', '#FF9800', '#00BCD4', '#E53935'];

const INITIAL_USER = {
  name: 'Sarah Mitchell',
  phone: '+1 (555) 123-4567',
  email: 'sarah.m@email.com',
  avatarIndex: 0,
  verified: true,
};

const INITIAL_VEHICLES = [
  { id: '1', name: 'Tesla Model 3', plate: 'ABC 1234', fuel: '⚡ Electric', insurance: 'Active' },
];

const INITIAL_MEDICAL = {
  bloodType: 'O+',
  allergies: 'Penicillin',
  notes: 'None',
};

const SAVED_LOCATIONS = [
  { id: '1', label: 'Home', icon: 'home', color: Colors.primary, address: '123 Main Street, San Francisco, CA' },
  { id: '2', label: 'Work', icon: 'briefcase', color: Colors.primaryLight, address: '456 Tech Avenue, San Francisco, CA' },
];

function ProfileHeader({ name }: { name: string }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.headerName}>{name}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/(tabs)/settings')}>
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────
function EditProfileModal({ visible, user, onClose, onSave }: any) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [avatarIndex, setAvatarIndex] = useState(user.avatarIndex);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <Text style={styles.modalLabel}>CHOOSE AVATAR</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((emoji, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.avatarOption, { backgroundColor: AVATAR_BG[i] },
                  avatarIndex === i && styles.avatarSelected]}
                onPress={() => setAvatarIndex(i)}
              >
                <Text style={styles.avatarOptionEmoji}>{emoji}</Text>
                {avatarIndex === i && (
                  <View style={styles.avatarCheck}>
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.modalLabel}>FULL NAME</Text>
          <TextInput style={styles.modalInput} value={name} onChangeText={setName} />

          <Text style={styles.modalLabel}>PHONE NUMBER</Text>
          <TextInput style={styles.modalInput} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Text style={styles.modalLabel}>EMAIL ADDRESS</Text>
          <TextInput style={styles.modalInput} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <View style={styles.modalBtns}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => onSave({ name, phone, email, avatarIndex })}>
              <Text style={styles.modalSaveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Add Vehicle Modal ────────────────────────────────────────
function AddVehicleModal({ visible, onClose, onAdd }: any) {
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [fuel, setFuel] = useState('');
  const [insurance, setInsurance] = useState('Active');

  const handleAdd = () => {
    if (!model || !plate || !fuel) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }
    onAdd({ id: Date.now().toString(), name: model, plate, fuel, insurance });
    setModel(''); setPlate(''); setFuel(''); setInsurance('Active');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Vehicle</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>VEHICLE MODEL *</Text>
          <TextInput style={styles.modalInput} placeholder="Tesla Model 3" value={model} onChangeText={setModel} />

          <Text style={styles.modalLabel}>PLATE NUMBER *</Text>
          <TextInput style={styles.modalInput} placeholder="ABC 1234" value={plate} onChangeText={setPlate} autoCapitalize="characters" />

          <Text style={styles.modalLabel}>FUEL TYPE *</Text>
          <TextInput style={styles.modalInput} placeholder="Electric, Gas, Diesel..." value={fuel} onChangeText={setFuel} />

          <Text style={styles.modalLabel}>INSURANCE STATUS</Text>
          <View style={styles.insuranceRow}>
            {['Active', 'Expired', 'Pending'].map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.insuranceChip, insurance === s && styles.insuranceChipActive]}
                onPress={() => setInsurance(s)}
              >
                <Text style={[styles.insuranceChipText, insurance === s && styles.insuranceChipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalBtns}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalSaveBtn, { opacity: (!model || !plate || !fuel) ? 0.5 : 1 }]} onPress={handleAdd}>
              <Text style={styles.modalSaveText}>+ Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Edit Medical Modal ───────────────────────────────────────
function EditMedicalModal({ visible, medical, onClose, onSave }: any) {
  const [bloodType, setBloodType] = useState(medical.bloodType);
  const [allergies, setAllergies] = useState(medical.allergies);
  const [notes, setNotes] = useState(medical.notes);

  const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Medical Information</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>BLOOD TYPE</Text>
          <View style={styles.bloodGrid}>
            {BLOOD_TYPES.map(bt => (
              <TouchableOpacity
                key={bt}
                style={[styles.bloodChip, bloodType === bt && styles.bloodChipActive]}
                onPress={() => setBloodType(bt)}
              >
                <Text style={[styles.bloodChipText, bloodType === bt && styles.bloodChipTextActive]}>{bt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.modalLabel}>ALLERGIES</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Penicillin, Peanuts..."
            value={allergies}
            onChangeText={setAllergies}
          />

          <Text style={styles.modalLabel}>MEDICAL NOTES</Text>
          <TextInput
            style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Any additional medical info..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View style={styles.modalBtns}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => onSave({ bloodType, allergies, notes })}>
              <Text style={styles.modalSaveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────
export default function ProfileScreen() {
  const [user, setUser] = useState(INITIAL_USER);
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [medical, setMedical] = useState(INITIAL_MEDICAL);
  const [autoSOS, setAutoSOS] = useState(true);
  const [liveLocation, setLiveLocation] = useState(true);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditMedical, setShowEditMedical] = useState(false);

  return (
    <View style={styles.container}>
      <ProfileHeader name={user.name} />

      <EditProfileModal
        visible={showEditProfile}
        user={user}
        onClose={() => setShowEditProfile(false)}
        onSave={(data: any) => { setUser({ ...user, ...data }); setShowEditProfile(false); }}
      />
      <AddVehicleModal
        visible={showAddVehicle}
        onClose={() => setShowAddVehicle(false)}
        onAdd={(v: any) => { setVehicles([...vehicles, v]); setShowAddVehicle(false); }}
      />
      <EditMedicalModal
        visible={showEditMedical}
        medical={medical}
        onClose={() => setShowEditMedical(false)}
        onSave={(data: any) => { setMedical(data); setShowEditMedical(false); }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Profile Card */}
        <View style={styles.section}>
          <Card>
            <View style={styles.profileTop}>
              <View style={styles.avatarWrap}>
                <View style={[styles.avatar, { backgroundColor: AVATAR_BG[user.avatarIndex] }]}>
                  <Text style={styles.avatarEmoji}>{AVATARS[user.avatarIndex]}</Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                {user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                    <Text style={styles.verifiedText}>Verified Driver</Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={14} color={Colors.primary} />
                  <Text style={styles.infoText}>{user.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.infoText}>{user.email}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditProfile(true)}>
              <Ionicons name="pencil" size={16} color="#fff" />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* My Vehicles */}
        <View style={styles.section}>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Vehicles</Text>
              <Ionicons name="car" size={20} color={Colors.primary} />
            </View>
            {vehicles.map(v => (
              <View key={v.id} style={styles.vehicleItem}>
                <View style={styles.vehicleTop}>
                  <Text style={styles.vehicleName}>{v.name}</Text>
                  <View style={styles.vehicleActions}>
                    <TouchableOpacity style={styles.iconBtn}>
                      <Ionicons name="pencil-outline" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() =>
                      Alert.alert('Delete', 'Remove this vehicle?', [
                        { text: 'Cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => setVehicles(vehicles.filter(x => x.id !== v.id)) }
                      ])}>
                      <Ionicons name="trash-outline" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Plate Number</Text>
                  <Text style={styles.vehicleValue}>{v.plate}</Text>
                </View>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Fuel Type</Text>
                  <Text style={styles.vehicleValue}>{v.fuel}</Text>
                </View>
                <View style={styles.vehicleRow}>
                  <Text style={styles.vehicleLabel}>Insurance</Text>
                  <View style={styles.activeBadge}>
                    <Ionicons name="shield-checkmark" size={12} color="#16A34A" />
                    <Text style={styles.activeText}>{v.insurance}</Text>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addRow} onPress={() => setShowAddVehicle(true)}>
              <Text style={styles.addRowText}>+ Add Another Vehicle</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Emergency Settings */}
        <View style={styles.section}>
          <Card>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrap}>
                <Ionicons name="shield" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Emergency Settings</Text>
            </View>
            <SettingToggle
              icon="radio-outline" iconBg="rgba(240,45,75,0.1)" iconColor={Colors.primary}
              label="Auto SOS Alerts" sub="Automatic emergency detection"
              value={autoSOS} onChange={(val) => { setAutoSOS(val); triggerNotification(val ? 'detection_enabled' : 'detection_disabled');}} trackOn={Colors.primary}
            />
            <SettingToggle
              icon="navigate-outline" iconBg="rgba(66,133,244,0.1)" iconColor="#4285F4"
              label="Live Location Sharing" sub="Share real-time location"
              value={liveLocation} onChange={setLiveLocation} trackOn="#4285F4"
            />
          </Card>
        </View>

        {/* Medical Information */}
        <View style={styles.section}>
          <Card>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, { backgroundColor: 'rgba(240,45,75,0.1)' }]}>
                <Ionicons name="heart" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Medical Information</Text>
            </View>
            <MedicalRow icon="water" iconColor="#F02D4B" label="Blood Type" value={medical.bloodType} valueBg="rgba(240,45,75,0.1)" valueColor={Colors.primary} />
            <MedicalRow icon="warning" iconColor="#FF9800" label="Allergies" value={medical.allergies} valueBg="rgba(255,152,0,0.1)" valueColor="#FF9800" />
            <MedicalRow icon="pulse" iconColor="#4285F4" label="Medical Notes" value={medical.notes} valueBg={Colors.surface} valueColor={Colors.textSecondary} />
            <TouchableOpacity style={[styles.editBtn, { marginTop: 12 }]} onPress={() => setShowEditMedical(true)}>
              <Ionicons name="pencil" size={16} color="#fff" />
              <Text style={styles.editBtnText}>Update Medical Info</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Saved Locations */}
        <View style={styles.section}>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Saved Locations</Text>
              <View style={[styles.cardIconWrap, { backgroundColor: 'rgba(66,133,244,0.1)' }]}>
                <Ionicons name="location" size={18} color="#4285F4" />
              </View>
            </View>
            {SAVED_LOCATIONS.map(loc => (
              <TouchableOpacity key={loc.id} style={styles.locationRow} activeOpacity={0.7}>
                <View style={[styles.locationIcon, { backgroundColor: `${loc.color}18` }]}>
                  <Ionicons name={loc.icon as any} size={18} color={loc.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationLabel}>{loc.label}</Text>
                  <Text style={styles.locationAddress}>{loc.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addRow}>
              <Text style={styles.addRowText}>+ Add New Location</Text>
            </TouchableOpacity>
          </Card>
        </View>

      </ScrollView>
    </View>
  );
}

const MedicalRow = ({ icon, iconColor, label, value, valueBg, valueColor }: any) => (
  <View style={styles.medicalRow}>
    <View style={[styles.medicalIcon, { backgroundColor: `${iconColor}18` }]}>
      <Ionicons name={icon} size={16} color={iconColor} />
    </View>
    <Text style={styles.medicalLabel}>{label}</Text>
    <View style={[styles.medicalValue, { backgroundColor: valueBg }]}>
      <Text style={[styles.medicalValueText, { color: valueColor }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '400' },
  headerName: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  headerIcons: { flexDirection: 'row', gap: 10 },
  headerIconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },

  section: { paddingHorizontal: 16, marginTop: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  cardIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(240,45,75,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  profileTop: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 36 },
  profileInfo: { flex: 1, justifyContent: 'center', gap: 6 },
  profileName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: Colors.textSecondary },
  editBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 13, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  editBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  vehicleItem: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12, marginBottom: 4 },
  vehicleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  vehicleName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  vehicleActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 4 },
  vehicleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  vehicleLabel: { fontSize: 13, color: Colors.textSecondary },
  vehicleValue: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EAF3DE', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  activeText: { fontSize: 12, color: '#16A34A', fontWeight: '500' },
  addRow: { paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border, alignItems: 'center' },
  addRowText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },

  medicalRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  medicalIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  medicalLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary },
  medicalValue: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  medicalValueText: { fontSize: 13, fontWeight: '600' },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  locationIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  locationLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  locationAddress: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  modalLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.8, marginBottom: 8, marginTop: 12 },
  modalInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.textPrimary, backgroundColor: '#FAFAFA',
  },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#F3F4F6', alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  modalSaveBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  modalSaveText: { fontSize: 15, fontWeight: '600', color: '#fff' },

  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  avatarOption: {
    width: 64, height: 64, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarSelected: { borderWidth: 3, borderColor: '#3B82F6' },
  avatarOptionEmoji: { fontSize: 30 },
  avatarCheck: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: '#3B82F6', borderRadius: 8,
    width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },

  insuranceRow: { flexDirection: 'row', gap: 8 },
  insuranceChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: '#F9F9F9',
  },
  insuranceChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  insuranceChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  insuranceChipTextActive: { color: '#fff' },

  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  bloodChip: {
    width: 56, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', backgroundColor: '#F9F9F9',
  },
  bloodChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  bloodChipText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  bloodChipTextActive: { color: '#fff' },
});
