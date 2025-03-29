const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../utils/logger");
const User = require("../models/User");

module.exports = {
    ensureAuth: async (req, res, next) => {
        // Log authentication state for debugging
        logger.debug(`Auth check - Session exists: ${!!req.session}, IsAuthenticated: ${req.isAuthenticated()}, Has user: ${!!req.user}`);

        // First check if user is authenticated via session
        if (req.isAuthenticated() && req.user) {
            logger.debug(`User authenticated via session: ${req.user.id}`);
            return next();
        }

        // If not, check for JWT token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn("No authentication token provided");
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const token = authHeader.split(" ")[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, config.JWT_SECRET);
            logger.debug(`JWT verified for user: ${decoded.id}`);

            req.user = decoded;
            next();
        } catch (error) {
            logger.error(`Token verification error: ${error.message}`);
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
    },

    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect("/dashboard");
        }
        next();
    },
};
