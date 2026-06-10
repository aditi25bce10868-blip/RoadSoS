const { db } = require('../config/firebaseAdmin');

const hospitalsCollection = db.collection('hospitals');
const ambulancesCollection = db.collection('ambulances');

const EmergencyModel = {
  async seedHospitals(hospitals) {
    const batch = db.batch();
    hospitals.forEach(h => {
      const ref = hospitalsCollection.doc(h.id);
      batch.set(ref, h);
    });
    await batch.commit();
    return true;
  },

  async seedAmbulances(ambulances) {
    const batch = db.batch();
    ambulances.forEach(a => {
      const ref = ambulancesCollection.doc(a.id);
      batch.set(ref, a);
    });
    await batch.commit();
    return true;
  },

  async getAllHospitals() {
    const snapshot = await hospitalsCollection.get();
    return snapshot.docs.map(doc => doc.data());
  },

  async getAvailableAmbulances() {
    const snapshot = await ambulancesCollection
      .where('status', '==', 'available')
      .get();
    return snapshot.docs.map(doc => doc.data());
  },

  async updateAmbulanceStatus(id, status) {
    await ambulancesCollection.doc(id).update({ status });
  }
};

module.exports = EmergencyModel;
