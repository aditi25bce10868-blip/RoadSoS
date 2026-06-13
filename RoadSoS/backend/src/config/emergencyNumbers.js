const YOUR_TEST_NUMBER = process.env.TEST_EMERGENCY_NUMBER;

const EMERGENCY_CONTACTS = {
  IN: {
    countryName: 'India',
    callingCode: '+91',

    // SMS only contacts
    smsContacts: [
    // { name: 'Police', phone: YOUR_TEST_NUMBER, type: 'police' },
      // { name: 'Ambulance',    phone: YOUR_TEST_NUMBER, type: 'ambulance' },
      // { name: 'Highway Toll', phone: YOUR_TEST_NUMBER, type: 'toll'      },
    ],

    // Call priority order — native dialer
    callContacts: [
    //  { name: 'Nearest Hospital', phone: YOUR_TEST_NUMBER, type: 'hospital', callOrder: 1 },
      // { name: 'Road Rescue', phone: YOUR_TEST_NUMBER, type: 'road_rescue', callOrder: 2 },
    ],
  },

  BD: {
    countryName: 'Bangladesh',
    callingCode: '+880',
    smsContacts: [
      { name: 'Police', phone: YOUR_TEST_NUMBER, type: 'police' },
    ],
    callContacts: [
      { name: 'Nearest Hospital', phone: YOUR_TEST_NUMBER, type: 'hospital', callOrder: 1 },
    ],
  },

  MM: {
    countryName: 'Myanmar',
    callingCode: '+95',
    smsContacts: [
      { name: 'Police', phone: YOUR_TEST_NUMBER, type: 'police' },
    ],
    callContacts: [
      { name: 'Nearest Hospital', phone: YOUR_TEST_NUMBER, type: 'hospital', callOrder: 1 },
    ],
  },
};

const getSMSContacts = (countryCode = 'IN', personalContacts = []) => {
  const services = EMERGENCY_CONTACTS[countryCode]?.smsContacts || [];
  return [
    ...personalContacts.map((c) => ({ ...c, type: 'personal' })),
    ...services,
  ];
};

const getCallContacts = (countryCode = 'IN', personalContacts = []) => {
  const services = EMERGENCY_CONTACTS[countryCode]?.callContacts || [];
  return [
    ...personalContacts.map((c) => ({ ...c, type: 'personal', callOrder: 0 })),
    ...services,
  ].sort((a, b) => (a.callOrder || 0) - (b.callOrder || 0));
};

module.exports = { EMERGENCY_CONTACTS, getSMSContacts, getCallContacts };
