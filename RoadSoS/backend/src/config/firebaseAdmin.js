const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');

if (!admin.apps.length) {
  let serviceAccount;

  // Prefer env var (e.g. for deployment on Render) if present,
  // otherwise fall back to local serviceAccountKey.json (for local dev)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('Firebase: using FIREBASE_SERVICE_ACCOUNT env var');
  } else {
    const keyPath = path.join(__dirname, '../../serviceAccountKey.json');
    console.log('Firebase: looking for key at:', keyPath);
    console.log('Firebase: file exists:', fs.existsSync(keyPath));
    serviceAccount = require(keyPath);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  console.log('Firebase Admin initialized');
}

const db  = admin.firestore();   // Firestore (used by sosModel, etc.)
const rtdb = admin.database();   // Realtime Database (used by trackingService)

module.exports = { admin, db, rtdb };
