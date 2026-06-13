function validateLocation(lat, lng) {
  if (!lat || !lng) return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  return true;
}

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

module.exports = { validateLocation, validatePhone };
