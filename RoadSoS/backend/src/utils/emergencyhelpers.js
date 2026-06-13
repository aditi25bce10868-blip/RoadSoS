function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return parseFloat(
    (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2)
  );
}

function getNearestFromList(lat, lng, list) {
  return list
    .map(item => ({
      ...item,
      distance_km: haversine(lat, lng, item.lat, item.lng)
    }))
    .sort((a, b) => a.distance_km - b.distance_km);
}

module.exports = { haversine, getNearestFromList };
