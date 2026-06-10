const express = require('express');
const router = express.Router();
const UserModel = require('../models/usermodel');
const { success, error } = require('../utils/responsehandler');
const { validatePhone } = require('../utils/validators');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

router.post('/signup', async (req, res) => {
  try {
    const { name, phone, email, blood_group, emergency_contacts } = req.body;
    if (!validatePhone(phone)) {
      return error(res, 'Invalid phone number', 400);
    }
    const existing = await UserModel.findByPhone(phone);
    if (existing) return error(res, 'User already exists', 400);
    const user = await UserModel.create({
      name, phone, email, blood_group, emergency_contacts
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return success(res, { user, token }, 'Signup successful', 201);
  } catch (err) {
    return error(res, err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await UserModel.findByPhone(phone);
    if (!user) return error(res, 'User not found', 404);
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return success(res, { user, token }, 'Login successful');
  } catch (err) {
    return error(res, err.message);
  }
});

module.exports = router;