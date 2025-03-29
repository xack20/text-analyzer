const { cache } = require('../../src/middleware/cache');
const redis = require('redis');

// Mock Redis client
jest.mock('redis', () => {
    const mockClient = {
        connected: true,
        get: jest.fn(),
        set: jest.fn(),
        on: jest.fn().mockReturnThis() // Add the missing 'on' method
    };

    return {
        createClient: jest.fn().mockReturnValue(mockClient)
    };
});


describe('Cache Middleware', () => {
    let req, res, next, redisClient;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Get reference to mock Redis client
        redisClient = redis.createClient();

        // Setup request, response, and next function
        req = {
            originalUrl: '/api/texts/123',
            params: { id: '123' },
            user: { id: 'user123' }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        next = jest.fn();
    });

    test('should return cached response if available', async () => {
        // Mock Redis get to return cached data
        const cachedData = JSON.stringify({ title: 'Cached Text', content: 'Cached content' });
        redisClient.get.mockImplementation((key, callback) => {
            callback(null, cachedData);
        });

        // Create cache middleware with 60s duration
        const cacheMiddleware = cache(60);

        // Call middleware
        await cacheMiddleware(req, res, next);

        // Assertions
        expect(redisClient.get).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(JSON.parse(cachedData));
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next if no cached response', async () => {
        // Mock Redis get to return null (no cached data)
        redisClient.get.mockImplementation((key, callback) => {
            callback(null, null);
        });

        // Create cache middleware with 60s duration
        const cacheMiddleware = cache(60);

        // Call middleware
        await cacheMiddleware(req, res, next);

        // Assertions
        expect(redisClient.get).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();

        // Check that res.send was overridden
        expect(res.send).not.toBe(jest.fn());
    });

    test('should cache successful responses', async () => {
        // Mock Redis get to return null (no cached data)
        redisClient.get.mockImplementation((key, callback) => {
            callback(null, null);
        });

        // Create cache middleware with 60s duration
        const cacheMiddleware = cache(60);

        // Call middleware
        await cacheMiddleware(req, res, next);

        // Simulate successful response
        const responseData = JSON.stringify({ title: 'New Text', content: 'New content' });
        res.statusCode = 200;
        res.send(responseData);

        // Assertions
        expect(redisClient.set).toHaveBeenCalledWith(
            expect.stringContaining('__text_analyzer__/api/texts/123_123_user123'),
            responseData,
            'EX',
            60,
            expect.any(Function)
        );
    });

    test('should not cache non-200 responses', async () => {
        // Mock Redis get to return null (no cached data)
        redisClient.get.mockImplementation((key, callback) => {
            callback(null, null);
        });

        // Create cache middleware with 60s duration
        const cacheMiddleware = cache(60);

        // Call middleware
        await cacheMiddleware(req, res, next);

        // Simulate error response
        res.statusCode = 404;
        res.send(JSON.stringify({ message: 'Not found' }));

        // Assertions
        expect(redisClient.set).not.toHaveBeenCalled();
    });

    test('should call next if Redis is not connected', async () => {
        // Set Redis as disconnected
        redisClient.connected = false;

        // Create cache middleware with 60s duration
        const cacheMiddleware = cache(60);

        // Call middleware
        await cacheMiddleware(req, res, next);

        // Assertions
        expect(redisClient.get).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    test('should call next if Redis get throws an error', async () => {
        // Mock Redis get to throw an error
        redisClient.get.mockImplementation((key, callback) => {
            callback(new Error('Redis error'), null);
        });

        // Create cache middleware with 60s duration
        const cacheMiddleware = cache(60);

        // Call middleware
        await cacheMiddleware(req, res, next);

        // Assertions
        expect(next).toHaveBeenCalled();
    });
});
