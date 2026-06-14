const axios = require('axios');

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

// Get real ETA from OSRM for top results
async function enrichWithETA(userLat, userLng, sortedList, topN = 3) {
  const top = sortedList.slice(0, topN);

  const enriched = await Promise.all(
    top.map(async (item) => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${item.lng},${item.lat}?overview=false`;
        const res = await axios.get(url, { timeout: 5000 });
        const route = res.data.routes?.[0];
        if (route) {
          return {
            ...item,
            distance_km: parseFloat((route.distance / 1000).toFixed(2)),
            eta_min: Math.ceil(route.duration / 60),
          };
        }
      } catch {
        // fallback — keep haversine distance, estimate ETA at 40km/h
      }
      return {
        ...item,
        eta_min: Math.ceil((item.distance_km / 40) * 60),
      };
    })
  );

  // Append remaining items without ETA enrichment
  const rest = sortedList.slice(topN).map(item => ({
    ...item,
    eta_min: Math.ceil((item.distance_km / 40) * 60),
  }));

  return [...enriched, ...rest];
}

module.exports = { haversine, getNearestFromList, enrichWithETA };