const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const logger = require('../src/utils/logger');

// Disable logging during tests
logger.transports.forEach((t) => (t.silent = true));

let mongoServer;

// Connect to the in-memory database before tests
module.exports.setupDB = async () => {
    // First check if mongoose is already connected and disconnect if needed
    if (mongoose.connection.readyState !== 0) {
        console.log('Mongoose already connected, disconnecting first...');
        await mongoose.disconnect();
    }

    // Create a new MongoDB memory server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    console.log(`Connecting to in-memory MongoDB at ${mongoUri}`);
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to in-memory MongoDB');
};

// Close database connection after tests
module.exports.teardownDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    if (mongoServer) {
        await mongoServer.stop();
    }
};

// Clear all collections between tests
module.exports.clearDB = async () => {
    if (mongoose.connection.readyState === 0) {
        console.warn('Cannot clear DB: Mongoose not connected');
        return;
    }

    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};
