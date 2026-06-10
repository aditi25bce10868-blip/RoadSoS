// Twilio not configured yet
const sendSMS = async (phone, message) => {
  console.log(`SMS to ${phone}: ${message}`);
};

module.exports = { sendSMS };