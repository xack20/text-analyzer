// tests/integration/redis.test.js
const redis = require('redis-mock');
const { promisify } = require('util');
const { cache, client } = require('../../src/middleware/cache');
const { setupDB, teardownDB } = require('../setup');

// Mock Redis client
jest.mock('redis', () => require('redis-mock'));

describe('Redis Integration', () => {
    let redisClient, getAsync, setAsync;

    beforeAll(async () => {
        await setupDB();

        // Setup Redis mock client
        redisClient = redis.createClient();
        getAsync = promisify(redisClient.get).bind(redisClient);
        setAsync = promisify(redisClient.set).bind(redisClient);
    });

    afterAll(async () => {
        await teardownDB();
        redisClient.quit();
    });

    test('should store and retrieve values from Redis', async () => {
        // Store value in Redis
        await setAsync('test-key', 'test-value');

        // Retrieve value from Redis
        const value = await getAsync('test-key');

        expect(value).toBe('test-value');
    });

    test('should expire keys after specified duration', async () => {
        // Store value with 1 second expiration
        await setAsync('expire-key', 'expire-value', 'EX', 1);

        // Verify value exists initially
        let value = await getAsync('expire-key');
        expect(value).toBe('expire-value');

        // Wait for key to expire
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Verify value is gone after expiration
        value = await getAsync('expire-key');
        expect(value).toBeNull();
    });

    test('should handle storing and retrieving JSON data', async () => {
        const data = {
            id: 123,
            name: 'Test Object',
            nested: {
                property: 'value'
            }
        };

        // Store JSON data
        await setAsync('json-key', JSON.stringify(data));

        // Retrieve and parse JSON data
        const retrievedData = JSON.parse(await getAsync('json-key'));

        expect(retrievedData).toEqual(data);
    });
});
