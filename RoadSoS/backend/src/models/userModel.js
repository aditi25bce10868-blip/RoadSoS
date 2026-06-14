const { db } = require('../config/firebaseAdmin');

const usersCollection = db.collection('users');

const UserModel = {
  async create({ name, phone, email, blood_group, emergency_contacts }) {
    const docRef = usersCollection.doc();
    const user = {
      id: docRef.id,
      name,
      phone,
      email: email || '',
      blood_group: blood_group || '',
      emergency_contacts: emergency_contacts || [],
      createdAt: new Date().toISOString(),
    };
    await docRef.set(user);
    return user;
  },

  async findByPhone(phone) {
    const snapshot = await usersCollection
      .where('phone', '==', phone)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  },

  async findById(id) {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  },

  async update(id, data) {
    await usersCollection.doc(id).update(data);
    const updated = await usersCollection.doc(id).get();
    return updated.data();
  },
};

module.exports = UserModel;