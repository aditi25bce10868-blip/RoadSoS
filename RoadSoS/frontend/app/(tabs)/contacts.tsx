// app/(tabs)/contacts.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Switch, Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors  from '../../constants/color';

const AVATARS = ['👤', '👦', '👧', '🧑', '👩', '👴', '👵', '👶'];
const AVATAR_Colors = ['#F02D4B', '#4285F4', '#34A853', '#9C27B0', '#E91E63', '#FF9800', '#F44336', '#00BCD4'];

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: boolean;
  avatarIndex: number;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'John Mitchell', relationship: 'Spouse', phone: '+1 (555) 234-5678', priority: true, avatarIndex: 0 },
  { id: '2', name: 'Emma Mitchell', relationship: 'Daughter', phone: '+1 (555) 345-6789', priority: true, avatarIndex: 2 },
  { id: '3', name: 'Robert Chen', relationship: 'Friend', phone: '+1 (555) 456-7890', priority: false, avatarIndex: 1 },
];

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', relationship: '', phone: '', priority: false, avatarIndex: 0 });

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.relationship.toLowerCase().includes(search.toLowerCase())
  );
  const priority = filtered.filter(c => c.priority);
  const others = filtered.filter(c => !c.priority);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Error', 'Unable to make a call.'));
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remove Contact', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setContacts(prev => prev.filter(c => c.id !== id)) },
    ]);
  };

  const handleAdd = () => {
    if (!form.name || !form.phone) {
      Alert.alert('Required', 'Name and phone number are required.');
      return;
    }
    setContacts(prev => [...prev, { ...form, id: Date.now().toString() }]);
    setForm({ name: '', relationship: '', phone: '', priority: false, avatarIndex: 0 });
    setModalVisible(false);
  };

  const ContactCard = ({ contact }: { contact: Contact }) => {
    const expanded = expandedId === contact.id;
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardTop} onPress={() => setExpandedId(expanded ? null : contact.id)} activeOpacity={0.7}>
          <View style={[styles.avatar, { backgroundColor: AVATAR_Colors[contact.avatarIndex] }]}>
            <Text style={styles.avatarEmoji}>{AVATARS[contact.avatarIndex]}</Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.contactName}>{contact.name}</Text>
              {contact.priority && <Text style={styles.star}>⭐</Text>}
            </View>
            <Text style={styles.contactMeta}>{contact.relationship} · {contact.phone}</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => handleDelete(contact.id)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textSecondary} />
          </View>
        </TouchableOpacity>
        {expanded && (
          <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(contact.phone)} activeOpacity={0.85}>
            <Ionicons name="call" size={18} color="#fff" />
            <Text style={styles.callBtnText}>Call Now</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSub}>Stay Protected</Text>
            <Text style={styles.headerTitle}>Emergency{'\n'}Contacts</Text>
          </View>
          <View style={styles.shieldWrap}>
            <Ionicons name="shield-outline" size={28} color="rgba(255,255,255,0.8)" />
          </View>
        </View>
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {/* Add Button */}
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>+ Add Emergency Contact</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {priority.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>PRIORITY CONTACTS · {priority.length}</Text>
            </View>
            {priority.map(c => <ContactCard key={c.id} contact={c} />)}
          </>
        )}
        {others.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>OTHER CONTACTS · {others.length}</Text>
            </View>
            {others.map(c => <ContactCard key={c.id} contact={c} />)}
          </>
        )}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No contacts found</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>

            {/* Avatar picker */}
            <Text style={styles.fieldLabel}>CONTACT AVATAR</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((emoji, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.avatarOption, { backgroundColor: AVATAR_Colors[i] }, form.avatarIndex === i && styles.avatarSelected]}
                  onPress={() => setForm(f => ({ ...f, avatarIndex: i }))}
                >
                  <Text style={styles.avatarEmoji}>{emoji}</Text>
                  {form.avatarIndex === i && (
                    <View style={styles.avatarCheck}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>FULL NAME *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contact name"
              placeholderTextColor={Colors.textMuted}
              value={form.name}
              onChangeText={t => setForm(f => ({ ...f, name: t }))}
            />

            <Text style={styles.fieldLabel}>RELATIONSHIP</Text>
            <TextInput
              style={styles.input}
              placeholder="Spouse, Friend, Parent..."
              placeholderTextColor={Colors.textMuted}
              value={form.relationship}
              onChangeText={t => setForm(f => ({ ...f, relationship: t }))}
            />

            <Text style={styles.fieldLabel}>PHONE NUMBER *</Text>
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor={Colors.textMuted}
              value={form.phone}
              onChangeText={t => setForm(f => ({ ...f, phone: t }))}
              keyboardType="phone-pad"
            />

            <View style={styles.priorityRow}>
              <View>
                <Text style={styles.priorityTitle}>⭐ Priority Contact</Text>
                <Text style={styles.prioritySub}>Show at the top of the list</Text>
              </View>
              <Switch
                value={form.priority}
                onValueChange={v => setForm(f => ({ ...f, priority: v }))}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleAdd}>
                <Text style={styles.confirmBtnText}>+ Add Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff', lineHeight: 34 },
  shieldWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 14 },
  addBtn: {
    backgroundColor: '#fff',
    borderRadius: 12, paddingVertical: 13,
    alignItems: 'center',
  },
  addBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },

  // List
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 4 },
  sectionAccent: { width: 3, height: 14, backgroundColor: Colors.primary, borderRadius: 2 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.5 },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 22 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  contactName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  star: { fontSize: 14 },
  contactMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { padding: 4 },
  callBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: 14, marginBottom: 14,
    borderRadius: 10, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  callBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.textSecondary },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 8 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  avatarOption: { width: 60, height: 60, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarSelected: { borderWidth: 3, borderColor: Colors.textPrimary },
  avatarCheck: {
    position: 'absolute', top: 2, right: 2,
    backgroundColor: Colors.textPrimary,
    borderRadius: 8, width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    backgroundColor: Colors.surfaceAlt, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: 16,
  },
  priorityRow: {
    backgroundColor: '#FFFBEA', borderRadius: 12,
    padding: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24,
  },
  priorityTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  prioritySub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  modalBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, borderRadius: 12, paddingVertical: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  confirmBtn: {
    flex: 1, borderRadius: 12, paddingVertical: 14,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  confirmBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
