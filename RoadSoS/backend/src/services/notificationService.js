// backend/src/services/notificationService.js
// Firebase Admin SDK — sends FCM push notifications
const admin = require('firebase-admin');
const path  = require('path');

// Initialize Firebase Admin once
if (!admin.apps.length) {
  const serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Send SOS push notification to a single device
 * @param {String} pushToken - Expo push token OR FCM token
 * @param {Object} sosData   - { userName, address, lat, lng }
 */
const sendSOSNotification = async (pushToken, sosData) => {
  const { userName, address, lat, lng } = sosData;

  const message = {
    notification: {
      title: `🚨 SOS Alert from ${userName}`,
      body:  `Needs help at ${address || 'Unknown location'}`,
    },
    data: {
      type:     'incoming_sos',
      userName,
      address:  address || '',
      lat:      String(lat),
      lng:      String(lng),
      mapLink:  `https://maps.google.com/?q=${lat},${lng}`,
    },
    android: {
      priority: 'high',
      notification: {
        sound:       'default',
        channelId:   'sos-alerts',
        priority:    'max',
        visibility:  'public',
        color:       '#e53935',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
    token: pushToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('FCM notification sent:', response);
    return { status: 'fulfilled', messageId: response };
  } catch (err) {
    console.error('FCM notification failed:', err.message);
    return { status: 'rejected', error: err.message };
  }
};

/**
 * Send SOS notification to multiple devices
 * @param {Array}  pushTokens - list of FCM/Expo tokens
 * @param {Object} sosData    - { userName, address, lat, lng }
 */
const sendSOSNotificationToAll = async (pushTokens, sosData) => {
  if (!pushTokens || pushTokens.length === 0) return [];

  const results = await Promise.allSettled(
    pushTokens.map((token) => sendSOSNotification(token, sosData))
  );

  return results.map((result, i) => ({
    token:  pushTokens[i],
    status: result.value?.status || 'rejected',
    error:  result.value?.error  || result.reason?.message || null,
  }));
};

module.exports = { sendSOSNotification, sendSOSNotificationToAll };
