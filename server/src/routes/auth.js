const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken'); // Add this if missing
const config = require('../config/config'); // Add this if missing
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuth } = require('../middleware/auth');
const generateRandomId = require('../utils/others');


// @route   GET /auth/google
// @desc    Authenticate with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /auth/google/callback
// @desc    Google auth callback
// In your backend auth.js routes or authController.js
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    authController.googleCallback
);


// @route   GET /auth/current
// @desc    Get current user
router.get('/current', ensureAuth, authController.getCurrentUser);

// @route   GET /auth/logout
// @desc    Logout user
router.get('/logout', authController.logout);


// @route   GET /auth/test-token
// @desc    Get a test token (development only)
router.get('/test-token', (req, res) => {
    if (config.NODE_ENV === 'production') {
        return res.status(404).json({ message: 'Not found' });
    }

    // Create a test token
    const token = jwt.sign(
        {
            id: generateRandomId(),
            email: 'test@example.com',
            name: 'Test User'
        },
        config.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.json({ token });
});


router.get('/dev-login', authController.devLogin);

// In auth.js routes
router.get('/session-test', (req, res) => {
    res.json({
        sessionExists: !!req.session,
        isAuthenticated: req.isAuthenticated(),
        hasLogout: !!req.logout,
        logoutType: typeof req.logout,
        sessionID: req.sessionID,
        user: req.user ? {
            id: req.user.id,
            email: req.user.email,
            name: req.user.displayName
        } : null
    });
});


module.exports = router;
