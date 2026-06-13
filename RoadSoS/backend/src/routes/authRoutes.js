const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMe, verifyToken } = require('../controllers/authController');

// Protected — get current user's profile
router.get('/me', authMiddleware, getMe);

// Public — verify a Firebase ID token server-side
router.post('/verify-token', verifyToken);

module.exports = router;
