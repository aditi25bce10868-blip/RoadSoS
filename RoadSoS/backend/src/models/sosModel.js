const { db } = require('../config/firebaseAdmin');

const sosCollection = db.collection('sos_requests');

const SOSModel = {
  async create(sosData) {
    const ref = sosCollection.doc();
    const sos = {
      id: ref.id,
      user_id: sosData.user_id,
      lat: sosData.lat,
      lng: sosData.lng,
      status: 'triggered',
      ambulance_id: sosData.ambulance_id || null,
      hospital_id: sosData.hospital_id || null,
      triggered_at: new Date().toISOString(),
      resolved_at: null
    };
    await ref.set(sos);
    return sos;
  },

  async findById(id) {
    const doc = await sosCollection.doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  },

  async updateStatus(id, status) {
    await sosCollection.doc(id).update({
      status,
      resolved_at: status === 'resolved' ? new Date().toISOString() : null
    });
  },

  async findByUser(userId) {
    const snapshot = await sosCollection
      .where('user_id', '==', userId)
      .orderBy('triggered_at', 'desc')
      .get();
    return snapshot.docs.map(doc => doc.data());
  }
};

module.exports = SOSModel;
