export const API_BASE_URL = 'https://roadsos-49xo.onrender.com';

export const API_ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────
  LOGIN:   `${API_BASE_URL}/api/auth/login`,
  SIGNUP:  `${API_BASE_URL}/api/auth/signup`,

  // ── SOS ───────────────────────────────────────────────
  SOS_TRIGGER:  `${API_BASE_URL}/api/sos/trigger`,   // existing — working, SMS via Twilio
  SOS_BYSTANDER: `${API_BASE_URL}/api/sos/bystander`,
  SOS:          `${API_BASE_URL}/api/sos`,            // friend's generic SOS endpoint

  // ── User ──────────────────────────────────────────────
  PROFILE:      `${API_BASE_URL}/api/user/profile`,
  USER_BY_ID:   (id: string) => `${API_BASE_URL}/api/user/${id}`,
  SOS_HISTORY:  (id: string) => `${API_BASE_URL}/api/user/${id}/sos-history`,

  // ── Emergency services ─────────────────────────────────
  NEARBY:    `${API_BASE_URL}/api/emergency/nearby`, // existing
  HOSPITALS_NEAREST: (lat: number, lng: number) =>
    `${API_BASE_URL}/api/emergency/hospitals/nearest?lat=${lat}&lng=${lng}`,
  AMBULANCES_NEAREST: (lat: number, lng: number) =>
    `${API_BASE_URL}/api/emergency/ambulances/nearest?lat=${lat}&lng=${lng}`,
};

export const API_TIMEOUT = 10000;
