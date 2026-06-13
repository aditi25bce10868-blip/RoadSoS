// backend/src/routes/trackingRoutes.js
const express = require('express');
const router  = express.Router();
const {
  startTracking, updateTracking, reportOffline,
  extendTracking, stopTracking, getTrackingSession,
} = require('../controllers/trackingController');

router.post('/',                      startTracking);
router.post('/:sessionId/update',     updateTracking);
router.post('/:sessionId/offline',    reportOffline);
router.post('/:sessionId/extend',     extendTracking);
router.post('/:sessionId/end',        stopTracking);
router.get( '/:sessionId',            getTrackingSession);



module.exports = router;
