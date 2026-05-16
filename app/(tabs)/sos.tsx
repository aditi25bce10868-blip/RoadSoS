import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SOSScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sosButton}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
      <Text style={styles.instruction}>Tap to trigger emergency alert</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosText: { color: 'white', fontSize: 40, fontWeight: 'bold' },
  instruction: { marginTop: 20, fontSize: 16, color: '#666' }
});