const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const SOSModel = require('../models/sosModel');
const { success, error } = require('../utils/responseHandler');

router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (err) {
    return error(res, err.message);
  }
});

router.get('/:id/sos-history', async (req, res) => {
  try {
    const history = await SOSModel.findByUser(req.params.id);
    return success(res, history);
  } catch (err) {
    return error(res, err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await UserModel.update(req.params.id, req.body);
    return success(res, updated, 'User updated');
  } catch (err) {
    return error(res, err.message);
  }
});

module.exports = router;