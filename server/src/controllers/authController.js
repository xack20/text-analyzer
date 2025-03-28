const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const logger = require('../utils/logger');

module.exports = {
    // Handle Google OAuth callback
    googleCallback: (req, res) => {
        try {
            // Log authentication state
            logger.debug(`OAuth callback - User authenticated: ${req.isAuthenticated()}, User: ${JSON.stringify(req.user)}`);

            // Ensure user exists in the request
            if (!req.user) {
                logger.error('OAuth callback: No user in request');
                return res.redirect('http://localhost:3000/login?error=no_user');
            }

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
            res.redirect(`http://localhost:3000/dashboard?token=${token}`);
        } catch (error) {
            logger.error(`Auth callback error: ${error.message}`);
            res.redirect('http://localhost:3000/login?error=auth_failed');
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
        // Add debug logging
        console.log('Logout request received');
        console.log('Session exists:', !!req.session);
        console.log('User authenticated:', !!req.user);
        console.log('Logout function exists:', !!req.logout);
        console.log('Logout function type:', typeof req.logout);

        try {
            if (req.logout && typeof req.logout === 'function') {
                req.logout(function (err) {
                    if (err) {
                        console.error('Logout error:', err);
                        logger.error(`Logout error: ${err.message}`);
                        return res.status(500).json({
                            success: false,
                            message: 'Logout failed',
                            redirectUrl: 'http://localhost:3000/login'
                        });
                    }

                    // Successfully logged out
                    handleSuccessfulLogout();
                });
            } else {
                // If req.logout is not available, try to destroy the session directly
                logger.warn('req.logout function not available, destroying session manually');
                if (req.session) {
                    req.session.destroy(function (err) {
                        if (err) {
                            logger.error(`Session destruction error: ${err.message}`);
                            return res.status(500).json({
                                success: false,
                                message: 'Logout failed',
                                redirectUrl: 'http://localhost:3000/login'
                            });
                        }

                        handleSuccessfulLogout();
                    });
                } else {
                    // No session to destroy
                    handleSuccessfulLogout();
                }
            }
        } catch (error) {
            console.error('Logout exception:', error);
            logger.error(`Logout exception: ${error.message}`);
            res.status(500).json({
                success: false,
                message: 'Logout failed',
                redirectUrl: 'http://localhost:3000/login'
            });
        }

        function handleSuccessfulLogout() {
            logger.info('User logged out successfully');

            // For API clients, return JSON
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                res.status(200).json({
                    success: true,
                    message: 'Logout successful',
                    redirectUrl: 'http://localhost:3000/login'
                });
            } else {
                // For browser clients, redirect
                res.redirect('http://localhost:3000/login');
            }
        }
    },


    // Add development login endpoint for testing
    devLogin: (req, res) => {
        // Only available in development mode
        if (process.env.NODE_ENV === 'production') {
            return res.status(404).json({ message: 'Not found' });
        }

        try {
            // Create a test token
            const token = jwt.sign(
                {
                    id: 'dev-user-id',
                    email: 'dev@example.com',
                    name: 'Development User'
                },
                config.JWT_SECRET,
                { expiresIn: '1d' }
            );

            logger.info('Development user logged in');

            // Return token directly for development purposes
            res.json({ token });
        } catch (error) {
            logger.error(`Development login error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    }
};
