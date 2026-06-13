// backend/src/controllers/sosController.js
const { sendSOSMessages }          = require('../services/smsService');
const { callEmergencyContacts }    = require('../services/callService');
const { getSMSContacts, getCallContacts } = require('../config/emergencyNumbers');
const { sendSOSNotificationToAll } = require('../services/notificationService');

const triggerSOS = async (req, res) => {
  try {
    const {
      location,
      emergencyContacts = [],
      countryCode       = 'IN',
      userName          = 'Unknown User',
      pushTokens        = [], // push tokens of contacts who have the app
    } = req.body;

    console.log('TEST_EMERGENCY_NUMBER:', process.env.TEST_EMERGENCY_NUMBER);
  console.log('countryCode:', countryCode);

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({
        success: false,
        message: 'Location (lat, lng) is required.',
      });
    }

    console.log(`\n SOS triggered by ${userName}`);
    console.log(`Location: ${location.address} (offline: ${location.isOffline})`);

    const smsContacts  = getSMSContacts(countryCode, []);
   
    const callContacts = getCallContacts(countryCode, []);

    // Run SMS, calls and push notifications in parallel
    const [smsResults, callResults, notifResults] = await Promise.all([
      sendSOSMessages(smsContacts, location, userName),
      callEmergencyContacts(callContacts, userName, location),
      pushTokens.length > 0
        ? sendSOSNotificationToAll(pushTokens, {
            userName,
            address: location.address,
            lat:     location.lat,
            lng:     location.lng,
          })
        : Promise.resolve([]),
    ]);

    return res.status(200).json({
      success: true,
      userName,
      location,
      smsResults,
      callResults,
      notifResults,
      summary: {
        smsSentTo:     smsContacts.length,
        smsSent:       smsResults.filter((r) => r.status === 'fulfilled').length,
        smsFailed:     smsResults.filter((r) => r.status === 'rejected').length,
        calledIn:      callContacts.map((c) => c.name),
        notifsSent:    notifResults.filter((r) => r.status === 'fulfilled').length,
      },
    });

  } catch (err) {
    console.error('SOS trigger error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// For "Someone Else Needs Help" — SMS to nearby services only
const triggerBystanderSOS = async (req, res) => {
  try {
    const {
      location,
      countryCode = 'IN',
    } = req.body;

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({
        success: false,
        message: 'Location (lat, lng) is required.',
      });
    }

    console.log(`\n Bystander SOS at ${location.address}`);

    // Only SMS to nearby services — no personal contacts, no calls
    const smsContacts = getSMSContacts(countryCode, []); // empty personal contacts

     console.log('smsContacts:', JSON.stringify(smsContacts));

    const message = `🚨 Incident reported at ${location.address || `${location.lat},${location.lng}`}. Please respond immediately. Reported via RoadSOS.`;

    const smsResults = await sendSOSMessages(smsContacts, location, 'Bystander', message);


    return res.status(200).json({
      success: true,
      type: 'bystander',
      location,
      smsResults,
      summary: {
        smsSent:   smsResults.filter((r) => r.status === 'fulfilled').length,
        smsFailed: smsResults.filter((r) => r.status === 'rejected').length,
      },
    });

  } catch (err) {
    console.error('Bystander SOS error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Save push token for a user
const savePushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;
    if (!pushToken) {
      return res.status(400).json({ success: false, message: 'pushToken is required' });
    }
    // TODO: save to DB when UserModel is ready
    // For now just log it
    console.log('Push token saved:', pushToken);
    return res.status(200).json({ success: true, message: 'Token saved' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const callStatusWebhook = async (req, res) => {
  const { CallSid, Status, To } = req.body;
  console.log(`Call ${CallSid} to ${To} -> ${Status}`);
  res.status(200).send('OK');
};

module.exports = { triggerSOS, triggerBystanderSOS, savePushToken, callStatusWebhook };
