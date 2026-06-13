// backend/src/services/smsService.js
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const formatNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+91${cleaned}`;
  if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
  return phone; // already in E.164
};

/**
 * Build short SMS message — Twilio trial has 160 char segment limit
 * Keeping it under 160 chars to fit in 1 segment
 */
const buildMessage = (location, userName) => {
  if (location.isOffline) {
    // Offline — no live map, use last known
    return (
      `SOS! ${userName} needs help. ` +
      `Last location: ${location.address || 'Unknown'}. ` +
      `Last online: ${location.lastOnlineAt || 'Unknown'}. ` +
      `RoadSOS Alert.`
    );
  }
  // Online — include live map link
  return (
    `SOS! ${userName} needs help. ` +
    `Location: ${location.address || 'Unknown'}. ` +
    `Map: maps.google.com/?q=${location.lat},${location.lng} ` +
    `RoadSOS Alert.`
  );
};

const sendSOSMessages = async (contacts, location, userName, customMessage = null) => {
  const message = customMessage || buildMessage(location, userName);
 

  console.log(`SMS length: ${message.length} chars`);
  console.log(`Message: ${message}`);

  const results = await Promise.allSettled(
    contacts.map((contact) =>
      client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to:   formatNumber(contact.phone),
      })
    )
  );

  return results.map((result, i) => ({
    contact: contacts[i],
    status:  result.status,
    sid:     result.value?.sid ?? null,
    error:   result.reason?.message ?? null,
  }));
};

const sendSMS = async (to, body) => {
  const message = await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to:   formatNumber(to),
  });
  return message.sid;
};

module.exports = { sendSOSMessages, sendSMS };
