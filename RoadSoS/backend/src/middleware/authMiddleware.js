const admin = require('../config/firebaseAdmin');

/**
 * Auth middleware — verifies Firebase ID tokens sent as Bearer tokens.
 *
 * Usage:
 *   router.get('/protected', authMiddleware, handler);
 *
 * The client should send:
 *   Authorization: Bearer <Firebase ID Token>
 *
 * On success, `req.user` contains the decoded token payload:
 *   { uid, email, name, ... }
 */
const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing. Please log in.',
      });
    }

    const idToken = header.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach the decoded user info to the request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null,
      emailVerified: decodedToken.email_verified || false,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = authMiddleware;
