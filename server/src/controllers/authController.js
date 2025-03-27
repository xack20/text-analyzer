const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const logger = require('../utils/logger');

module.exports = {
    // Handle Google OAuth callback
    googleCallback: (req, res) => {
        try {
            // Create JWT token
            const token = jwt.sign(
                {
                    id: req.user.id,
                    email: req.user.email,
                    name: req.user.displayName
                },
                config.JWT_SECRET,
                { expiresIn: '1d' }
            );

            logger.info(`User logged in: ${req.user.email}`);

            // Redirect to frontend with token
            res.redirect(`/dashboard?token=${token}`);
        } catch (error) {
            logger.error(`Auth callback error: ${error.message}`);
            res.redirect('/auth/error');
        }
    },

    // Get current user info
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-googleId');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            logger.error(`Get current user error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Handle logout
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
};
