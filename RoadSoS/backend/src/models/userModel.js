const { db } = require('../config/firebaseAdmin');

const usersCollection = db.collection('users');

const UserModel = {
  async create(userData) {
    const ref = usersCollection.doc();
    const user = {
      id: ref.id,
      name: userData.name,
      phone: userData.phone,
      email: userData.email || '',
      blood_group: userData.blood_group || '',
      emergency_contacts: userData.emergency_contacts || [],
      created_at: new Date().toISOString()
    };
    await ref.set(user);
    return user;
  },

  async findByPhone(phone) {
    const snapshot = await usersCollection
      .where('phone', '==', phone)
      .get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  },

  async findById(id) {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  },

  async update(id, updates) {
    await usersCollection.doc(id).update(updates);
    return await UserModel.findById(id);
  }
};

module.exports = UserModel;
