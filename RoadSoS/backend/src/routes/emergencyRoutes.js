const express = require('express');
const router = express.Router();
const EmergencyModel = require('../models/emergencyModel');
const { getNearestFromList, enrichWithETA } = require('../utils/emergencyhelpers');
const { success, error } = require('../utils/responsehandler');
const hospitals = require('../../data/hospitals.json');
const ambulances = require('../../data/ambulances.json');

router.get('/hospitals/all', async (req, res) => {
  try {
    const data = await EmergencyModel.getAllHospitals();
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
});

router.get('/hospitals/nearest', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const all = await EmergencyModel.getAllHospitals();
    const sorted = getNearestFromList(parseFloat(lat), parseFloat(lng), all);
    const enriched = await enrichWithETA(parseFloat(lat), parseFloat(lng), sorted);
    return success(res, enriched.slice(0, 3));
  } catch (err) {
    return error(res, err.message);
  }
});

router.get('/ambulances/nearest', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const available = await EmergencyModel.getAvailableAmbulances();
    const sorted = getNearestFromList(parseFloat(lat), parseFloat(lng), available);
    const enriched = await enrichWithETA(parseFloat(lat), parseFloat(lng), sorted, 1);
    return success(res, enriched[0]);
  } catch (err) {
    return error(res, err.message);
  }
});

router.post('/seed', async (req, res) => {
  try {
    await EmergencyModel.seedHospitals(hospitals);
    await EmergencyModel.seedAmbulances(ambulances);
    return success(res, null, 'Database seeded successfully');
  } catch (err) {
    return error(res, err.message);
  }
});

module.exports = router;