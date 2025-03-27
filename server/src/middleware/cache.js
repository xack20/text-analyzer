const redis = require('redis');
const { promisify } = require('util');
const config = require('../config/config');
const logger = require('../utils/logger');

// Create Redis client
const client = redis.createClient(config.REDIS_URL);

client.on('error', (err) => {
    logger.error(`Redis Error: ${err}`);
});

client.on('connect', () => {
    logger.info('Redis connected successfully');
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

/**
 * Cache middleware for API responses
 * @param {number} duration - Cache duration in seconds
 * @returns {Function} Express middleware
 */
const cache = (duration = 60) => {
    return async (req, res, next) => {
        // Skip caching if Redis is not available
        if (!client.connected) {
            return next();
        }

        // Create a unique key based on the route and any query parameters
        const key = `__text_analyzer__${req.originalUrl || req.url}_${req.params.id || ''}_${req.user ? req.user.id : ''}`;

        try {
            // Try to get cached response
            const cachedResponse = await getAsync(key);

            if (cachedResponse) {
                logger.debug(`Cache hit for key: ${key}`);
                const parsedResponse = JSON.parse(cachedResponse);
                return res.status(200).json(parsedResponse);
            }

            // Store the original send function
            const originalSend = res.send;

            // Override res.send method to cache the response before sending
            res.send = function (body) {
                // Only cache successful responses
                if (res.statusCode === 200) {
                    setAsync(key, body, 'EX', duration)
                        .catch(err => logger.error(`Redis set error: ${err.message}`));
                }

                // Call the original send method
                originalSend.call(this, body);
            };

            logger.debug(`Cache miss for key: ${key}`);
            next();
        } catch (error) {
            logger.error(`Cache middleware error: ${error.message}`);
            next();
        }
    };
};

module.exports = { cache, client };
