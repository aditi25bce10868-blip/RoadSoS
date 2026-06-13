const express = require('express');
const router  = express.Router();
const { triggerSOS,triggerBystanderSOS, savePushToken, callStatusWebhook } = require('../controllers/sosController');

router.post('/trigger',      triggerSOS);
router.post('/bystander',  triggerBystanderSOS); 
router.post('/push-token',   savePushToken);
router.post('/call-status',  callStatusWebhook);

module.exports = router;
