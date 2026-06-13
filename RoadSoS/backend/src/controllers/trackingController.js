// backend/src/controllers/trackingController.js
const { v4: uuidv4 } = require('uuid');
const {
  createSession, updateLocation, markOffline,
  extendSession, endSession, getSession, PHASES,
} = require('../services/trackingService');
const { sendSMS } = require('../services/smsService');

const startTracking = async (req, res) => {
  try {
    const { userName, userId, location, contacts = [], battery, network } = req.body;

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ success: false, message: 'Location required' });
    }

    const sessionId   = uuidv4();
    const trackingUrl = `${process.env.BACKEND_URL}/track/${sessionId}`;

    const session = await createSession(sessionId, {
      userId, userName, location, contacts, battery, network,
    });

    // Send tracking link via SMS to contacts
    if (contacts.length > 0) {
      const smsBody =
        `SOS! ${userName} needs help. ` +
        `Track live: ${trackingUrl} (No login needed). ` +
        `RoadSOS Alert.`;

      await Promise.allSettled(
        contacts.map((c) => sendSMS(c.phone, smsBody))
      );
    }

    return res.status(200).json({
      success:     true,
      sessionId,
      trackingUrl,
      phase:       1,
      phaseInfo:   PHASES[1],
      hardTimeout: session.hardTimeout,
    });

  } catch (err) {
    console.error('Start tracking error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateTracking = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { location, battery, network } = req.body;

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ success: false, message: 'Location required' });
    }

    const result = await updateLocation(sessionId, location, { battery, network });

    if (result.error) {
      return res.status(404).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success:      true,
      phase:        result.phase,
      nextUpdateIn: PHASES[result.phase]?.interval || 30000,
    });

  } catch (err) {
    console.error('Update tracking error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const reportOffline = async (req, res) => {
  try {
    await markOffline(req.params.sessionId);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const extendTracking = async (req, res) => {
  try {
    const result = await extendSession(req.params.sessionId);
    if (result.error) {
      return res.status(404).json({ success: false, message: result.error });
    }
    return res.status(200).json({
      success:    true,
      newTimeout: result.newTimeout,
      message:    'Tracking extended by 30 minutes',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const stopTracking = async (req, res) => {
  try {
    const { sessionId } = req.params;
    // reason: 'manual' | 'resolved' | 'hard_timeout' | 'network_lost'
    const reason = req.body?.reason || 'manual';
    await endSession(sessionId, reason);
    return res.status(200).json({
      success: true,
      message: reason === 'resolved'
        ? 'Emergency resolved. Summary saved.'
        : 'Tracking stopped. Summary saved.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getTrackingSession = async (req, res) => {
  try {
    const session = await getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    return res.status(200).json({
      success:        true,
      sessionId:      req.params.sessionId,
      userName:       session.userName,
      phase:          session.phase,
      status:         session.status,
      lastLocation:   session.lastLocation,
      lastUpdateTime: session.lastUpdateTime,
      startTime:      session.startTime,
      battery:        session.battery,
      network:        session.network,
      hardTimeout:    session.hardTimeout,
      contacts:       session.contacts,
      history:        (session.history || []).slice(-10),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  startTracking, updateTracking, reportOffline,
  extendTracking, stopTracking, getTrackingSession,
};
