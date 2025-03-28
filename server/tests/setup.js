const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const logger = require('../src/utils/logger');

// Disable logging during tests
logger.transports.forEach((t) => (t.silent = true));

let mongoServer;

// Connect to the in-memory database before tests
module.exports.setupDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

// Close database connection after tests
module.exports.teardownDB = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};

// Clear all collections between tests
module.exports.clearDB = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};