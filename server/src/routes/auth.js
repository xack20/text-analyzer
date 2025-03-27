const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuth } = require('../middleware/auth');

// @route   GET /auth/google
// @desc    Authenticate with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /auth/google/callback
// @desc    Google auth callback
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

module.exports = router;
