const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../utils/logger");

module.exports = {
    ensureAuth: (req, res, next) => {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn("Unauthorized access attempt - No token provided");
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        }

        const token = authHeader.split(" ")[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            logger.warn(
                `Unauthorized access attempt - Invalid token: ${error.message}`
            );
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
