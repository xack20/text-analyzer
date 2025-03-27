require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: ***REMOVED*** || 'mongodb://localhost:27017/text-analyzer',
    JWT_SECRET: ***REMOVED*** || 'your-secret-key',
    SESSION_SECRET: ***REMOVED*** || 'session-secret-key', // Add this line
    GOOGLE_CLIENT_ID: ***REMOVED***
    GOOGLE_CLIENT_SECRET: ***REMOVED***
    CALLBACK_URL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    NODE_ENV: process.env.NODE_ENV || 'development'
};
