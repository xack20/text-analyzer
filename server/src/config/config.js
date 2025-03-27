require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: ***REMOVED***
    JWT_SECRET: ***REMOVED***
    SESSION_SECRET: ***REMOVED***
    GOOGLE_CLIENT_ID: ***REMOVED***
    GOOGLE_CLIENT_SECRET: ***REMOVED***
    CALLBACK_URL: process.env.CALLBACK_URL,
    REDIS_URL: process.env.REDIS_URL,
    NODE_ENV: process.env.NODE_ENV
};
