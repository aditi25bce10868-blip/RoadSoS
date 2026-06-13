const admin = require('firebase-admin');
const env = require('./env');

// Initialize Firebase Admin SDK.
// Uses a service account JSON file if FIREBASE_SERVICE_ACCOUNT is set,
// otherwise falls back to individual credential fields.
if (!admin.apps.length) {
  const credential = env.FIREBASE_SERVICE_ACCOUNT
    ? admin.credential.cert(require(env.FIREBASE_SERVICE_ACCOUNT))
    : admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
      });

  admin.initializeApp({ credential });
  console.log('✅ Firebase Admin SDK initialized');
}

module.exports = admin;
