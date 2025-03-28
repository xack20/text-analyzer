const express = require('express');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');
const config = require('./config/config');
const logger = require('./utils/logger');

// Import Redis modules
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default; // Note the .default here

// Load passport config
require('./config/passport');

// Connect to database
connectDB();

// Initialize Redis client and connect
let redisClient;
let sessionStore;

try {
    // Initialize Redis client
    redisClient = createClient({
        url: config.REDIS_URL || 'redis://localhost:6379'
    });

    // Connect to Redis
    redisClient.connect().catch(err => {
        logger.error(`Redis connection error: ${err.message}`);
        console.error('Redis connection failed:', err);
    });

    redisClient.on('error', (err) => {
        logger.error(`Redis error: ${err.message}`);
        console.error('Redis error:', err);
    });

    redisClient.on('connect', () => {
        logger.info('Connected to Redis successfully');
        console.log('Connected to Redis');
    });

    // Create Redis store
    sessionStore = new RedisStore({
        client: redisClient,
        prefix: 'text-analyzer:sess:'
    });

    logger.info('Redis store created successfully');
} catch (error) {
    logger.error(`Redis setup error: ${error.message}`);
    console.error('Failed to setup Redis:', error);
    // Fall back to memory store
    sessionStore = undefined;
}

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000'], // Allow frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



// In app.js, modify your session setup:

// Session middleware with Redis store if available
app.use(session({
    store: sessionStore, // Will be undefined if Redis setup failed
    secret: config.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Add debug middleware to check session and user
app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session exists:', !!req.session);
    console.log('User authenticated:', !!req.user);
    next();
});



// Logging
app.use(morgan('dev', {
    stream: {
        write: (message) => logger.http(message.trim())
    }
}));

// Passport middleware - AFTER session middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Home route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });

// // Dashboard route
// app.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/dashboard.html'));
// });


// Error handling middleware
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    logger.error(`${statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(statusCode).json({
        message: error.message,
        status: statusCode,
        stack: config.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
    logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

module.exports = app; // Export for testing
