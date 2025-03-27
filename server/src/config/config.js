require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/text-analyzer',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    SESSION_SECRET: process.env.SESSION_SECRET || 'session-secret-key', // Add this line
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    NODE_ENV: process.env.NODE_ENV || 'development'
};
