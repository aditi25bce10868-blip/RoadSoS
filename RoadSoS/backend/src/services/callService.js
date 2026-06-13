// backend/src/services/callService.js
// Native calling — no API needed
// Returns call list to frontend, frontend opens native dialer

/**
 * Returns ordered list of contacts to call
 * Frontend will open native dialer one by one
 * @param {Array}  contacts - [{ name, phone, type, callOrder }]
 * @param {String} userName
 * @param {Object} location
 */
const getCallQueue = (contacts, userName, location) => {
  return contacts
    .sort((a, b) => (a.callOrder || 0) - (b.callOrder || 0))
    .map((contact) => ({
      contact,
      phone:   contact.phone,
      message: `SOS: ${userName} needs help at ${location.address || 'unknown location'}`,
    }));
};

// Kept for API consistency — native calls handled on frontend
const callEmergencyContacts = async (contacts, userName, location) => {
  const queue = getCallQueue(contacts, userName, location);
  return queue.map((item) => ({
    contact: item.contact,
    status:  'pending', // frontend handles actual dialing
    callSid: null,
    phone:   item.phone,
    error:   null,
  }));
};

module.exports = { callEmergencyContacts, getCallQueue };
