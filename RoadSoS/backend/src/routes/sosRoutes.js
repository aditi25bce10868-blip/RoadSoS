const express = require('express');
const router = express.Router();
const SOSModel = require('../models/sosModel');
const EmergencyModel = require('../models/emergencyModel');
const { getNearestFromList } = require('../utils/emergencyHelpers');
const { getRoute } = require('../services/routingService');
const { success, error } = require('../utils/responsehandler');
const { validateLocation } = require('../utils/validators');

router.post('/', async (req, res) => {
  try {
    const { lat, lng, user_id } = req.body;

    if (!validateLocation(lat, lng)) {
      return error(res, 'Valid location required', 400);
    }

    const available = await EmergencyModel.getAvailableAmbulances();
    const sortedAmb = getNearestFromList(lat, lng, available);
    const nearestAmbulance = sortedAmb[0];

    const allHospitals = await EmergencyModel.getAllHospitals();
    const sortedHosp = getNearestFromList(lat, lng, allHospitals);
    const nearestHospital = sortedHosp[0];

    const route = await getRoute(
      lng, lat,
      nearestHospital.lng, nearestHospital.lat
    );

    const sos = await SOSModel.create({
      user_id: user_id || 'anonymous',
      lat, lng,
      ambulance_id: nearestAmbulance.id,
      hospital_id: nearestHospital.id
    });

    await EmergencyModel.updateAmbulanceStatus(nearestAmbulance.id, 'busy');

    const io = req.app.get('io');
    io.emit('sos:new', {
      sos_id: sos.id,
      ambulance_id: nearestAmbulance.id,
      user_location: { lat, lng },
      hospital: nearestHospital
    });

    return success(res, {
      sos_id: sos.id,
      ambulance: nearestAmbulance,
      hospital: nearestHospital,
      nearby_hospitals: sortedHosp.slice(0, 3),
      route: route || null
    }, 'SOS triggered successfully');

  } catch (err) {
    return error(res, err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sos = await SOSModel.findById(req.params.id);
    if (!sos) return error(res, 'SOS not found', 404);
    return success(res, sos);
  } catch (err) {
    return error(res, err.message);
  }
});

module.exports = router;