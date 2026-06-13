const admin = require('../config/firebaseAdmin');

/**
 * GET /api/auth/me
 * Returns the profile of the currently authenticated user.
 * Requires authMiddleware.
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const { uid } = req.user;

    // Fetch full user record from Firebase Auth
    const userRecord = await admin.auth().getUser(uid);

    res.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        phoneNumber: userRecord.phoneNumber || null,
        photoURL: userRecord.photoURL || null,
        emailVerified: userRecord.emailVerified,
        createdAt: userRecord.metadata.creationTime,
        lastSignIn: userRecord.metadata.lastSignInTime,
      },
    });
  } catch (error) {
    console.error('getMe error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.',
    });
  }
};

/**
 * POST /api/auth/verify-token
 * Verifies a Firebase ID token and returns the decoded payload.
 * Useful for server-side validation without the full middleware flow.
 */
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required.',
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        name: decodedToken.name || null,
        emailVerified: decodedToken.email_verified || false,
      },
    });
  } catch (error) {
    console.error('verifyToken error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

module.exports = { getMe, verifyToken };
