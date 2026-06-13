require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  ORS_API_KEY: process.env.ORS_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  TWILIO_SID: process.env.TWILIO_SID,
  TWILIO_TOKEN: process.env.TWILIO_TOKEN,
  TWILIO_PHONE: process.env.TWILIO_PHONE,
};