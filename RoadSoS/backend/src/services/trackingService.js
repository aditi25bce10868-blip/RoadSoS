// backend/src/services/trackingService.js

const { db, rtdb } = require('../config/firebaseAdmin');
const firestore = db; // Firestore (used for emergencySessions summaries)

const PHASES = {
  1: { name: 'Critical', duration: 20 * 60 * 1000, interval: 5000      },
  2: { name: 'Reduced',  duration: 20 * 60 * 1000, interval: 15000     },
  3: { name: 'Passive',  duration: 20 * 60 * 1000, interval: 60000     },
};

const HARD_TIMEOUT       = 60 * 60 * 1000; // = sum of all phase durations
const EXTEND_DURATION    = 30 * 60 * 1000;
const MAX_HISTORY_POINTS = 50;
const OFFLINE_TERMINATE  = 30 * 60 * 1000;

const sessionTimers = {};

// ── Get phase from elapsed time ───────────────────────────────
const getCurrentPhase = (startTime) => {
  const elapsed = Date.now() - startTime;
  if (elapsed < PHASES[1].duration) return 1;
  if (elapsed < PHASES[1].duration + PHASES[2].duration) return 2;
  return 3;
};

// ── Create session ────────────────────────────────────────────
const createSession = async (sessionId, data) => {
  const { userId, userName, location, contacts, battery, network } = data;
  const now = Date.now();

  const sessionData = {
    sessionId,
    userId:         userId || 'unknown',
    userName,
    phase:          1,
    status:         'active',
    startTime:      now,
    lastUpdateTime: now,
    offlineSince:   null,
    hardTimeout:    now + HARD_TIMEOUT,
    lastLocation: {
      lat:       location.lat,
      lng:       location.lng,
      address:   location.address || '',
      timestamp: now,
    },
    battery:  battery  || null,
    network:  network  || 'online',
    contacts: contacts || [],
    history:  [{ lat: location.lat, lng: location.lng, timestamp: now, phase: 1 }],
  };

  await rtdb.ref(`/tracking/${sessionId}`).set(sessionData);
  startSessionTimers(sessionId, now);
  return sessionData;
};

// ── Update location ───────────────────────────────────────────
const updateLocation = async (sessionId, location, deviceState = {}) => {
  const ref      = rtdb.ref(`/tracking/${sessionId}`);
  const snapshot = await ref.once('value');
  const session  = snapshot.val();

  if (!session) return { error: 'Session not found' };
  if (session.status === 'ended' || session.status === 'resolved' || session.status === 'tracking_lost') {
    return { error: 'Session already ended' };
  }

  const now   = Date.now();
  const phase = getCurrentPhase(session.startTime);

  const history = session.history || [];
  history.push({ lat: location.lat, lng: location.lng, timestamp: now, phase });
  if (history.length > MAX_HISTORY_POINTS) history.splice(0, history.length - MAX_HISTORY_POINTS);

  await ref.update({
    phase,
    lastLocation: {
      lat:       location.lat,
      lng:       location.lng,
      address:   location.address || session.lastLocation?.address || '',
      timestamp: now,
    },
    lastUpdateTime: now,
    offlineSince:   null,
    network:        deviceState.network  || 'online',
    battery:        deviceState.battery  ?? session.battery,
    history,
    status: session.status === 'paused' ? 'active' : session.status,
  });

  return { success: true, phase };
};

// ── Mark offline ──────────────────────────────────────────────
const markOffline = async (sessionId) => {
  const ref      = rtdb.ref(`/tracking/${sessionId}`);
  const snapshot = await ref.once('value');
  const session  = snapshot.val();
  if (!session || session.status === 'ended') return;

  const now = Date.now();
  if (!session.offlineSince) {
    await ref.update({ offlineSince: now, network: 'offline', status: 'paused' });
    sessionTimers[`${sessionId}_offline`] = setTimeout(async () => {
      await terminateOfflineSession(sessionId);
    }, OFFLINE_TERMINATE);
  }
};

const terminateOfflineSession = async (sessionId) => {
  const ref      = rtdb.ref(`/tracking/${sessionId}`);
  const snapshot = await ref.once('value');
  const session  = snapshot.val();
  if (!session || session.status === 'ended' || session.status === 'resolved') return;
  await ref.update({ status: 'tracking_lost', endTime: Date.now() });
  // Only save summary on actual termination — not on every phase
  await saveSessionSummary(sessionId, session, 'tracking_lost');
};

// ── Extend session ────────────────────────────────────────────
const extendSession = async (sessionId) => {
  const ref      = rtdb.ref(`/tracking/${sessionId}`);
  const snapshot = await ref.once('value');
  const session  = snapshot.val();
  if (!session) return { error: 'Session not found' };

  const newTimeout = Date.now() + EXTEND_DURATION;
  await ref.update({ status: 'active', hardTimeout: newTimeout, extendedAt: Date.now() });
  clearExistingTimers(sessionId);
  startSessionTimers(sessionId, session.startTime, newTimeout);
  return { success: true, newTimeout };
};

// ── End session — ONLY save summary on actual end ─────────────
const endSession = async (sessionId, reason = 'manual') => {
  const ref      = rtdb.ref(`/tracking/${sessionId}`);
  const snapshot = await ref.once('value');
  const session  = snapshot.val();
  if (!session) return { error: 'Session not found' };

  const now = Date.now();
  await ref.update({ status: reason === 'resolved' ? 'resolved' : 'ended', endTime: now });

  // Save to Firestore ONLY when session truly ends (not on phase change)
  await saveSessionSummary(sessionId, session, reason);
  clearExistingTimers(sessionId);

  // Delete from Realtime DB after 24 hours
  setTimeout(async () => {
    await rtdb.ref(`/tracking/${sessionId}`).remove();
  }, 24 * 60 * 60 * 1000);

  return { success: true };
};

// ── Save Firestore summary ────────────────────────────────────
const saveSessionSummary = async (sessionId, session, reason) => {
  // Guard — only save for valid end reasons
  const validEndReasons = ['manual', 'resolved', 'hard_timeout', 'tracking_lost', 'resolved_by_contact'];
  if (!validEndReasons.includes(reason)) return;

  // Don't save if already saved (check Firestore)
  try {
    const existing = await firestore.collection('emergencySessions').doc(sessionId).get();
    if (existing.exists) {
      console.log(`Summary already saved for ${sessionId} — skipping`);
      return;
    }
  } catch { /* non critical */ }

  const history = session.history || [];
  const endTime = Date.now();

  await firestore.collection('emergencySessions').doc(sessionId).set({
    sessionId,
    userId:        session.userId,
    userName:      session.userName,
    startTime:     session.startTime,
    endTime,
    duration:      endTime - session.startTime,
    startLocation: history[0]           || null,
    finalLocation: session.lastLocation || null,
    totalPoints:   history.length,
    status:        reason,
    createdAt:     new Date(),
  });

  console.log(`Session ${sessionId} summary saved — reason: ${reason}`);
};

// ── Session timers ────────────────────────────────────────────
const startSessionTimers = (sessionId, startTime, customTimeout = null) => {
  const timeout  = customTimeout || (startTime + HARD_TIMEOUT);
  const timeLeft = timeout - Date.now();
  if (timeLeft <= 0) return;

  // At hard timeout (60 min) — set status to 'warning'.
  // track.html then lets the contact Extend +30min (stays in phase 3) or Resolve/Stop.
  sessionTimers[`${sessionId}_timeout`] = setTimeout(async () => {
    const snapshot = await rtdb.ref(`/tracking/${sessionId}`).once('value');
    const session  = snapshot.val();
    if (session && session.status !== 'ended' && session.status !== 'resolved') {
      await rtdb.ref(`/tracking/${sessionId}`).update({ status: 'warning' });
      console.log(`Session ${sessionId} — hard timeout reached, status set to warning (awaiting action)`);
    }
  }, timeLeft);
};

const clearExistingTimers = (sessionId) => {
  ['_warning', '_timeout', '_offline'].forEach((suffix) => {
    const key = `${sessionId}${suffix}`;
    if (sessionTimers[key]) { clearTimeout(sessionTimers[key]); delete sessionTimers[key]; }
  });
};

const getSession = async (sessionId) => {
  const snapshot = await rtdb.ref(`/tracking/${sessionId}`).once('value');
  return snapshot.val();
};

module.exports = { createSession, updateLocation, markOffline, extendSession, endSession, getSession, getCurrentPhase, PHASES };
