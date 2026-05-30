const axios = require('axios');
const { ORS_API_KEY } = require('../config/env');

async function getRoute(startLng, startLat, endLng, endLat) {
  try {
    const response = await axios.get(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        params: {
          api_key: ORS_API_KEY,
          start: `${startLng},${startLat}`,
          end: `${endLng},${endLat}`
        }
      }
    );
    const segment = response.data.features[0].properties.segments[0];
    return {
      duration_mins: Math.round(segment.duration / 60),
      distance_km: (segment.distance / 1000).toFixed(2),
      geometry: response.data.features[0].geometry
    };
  } catch (err) {
    return null;
  }
}

module.exports = { getRoute };