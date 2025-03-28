// tests/middleware/auth.test.js
const { ensureAuth } = require('../../src/middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('../../src/config/config');

// Mock dependencies
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup request, response, and next function
        req = {
            headers: {},
            isAuthenticated: jest.fn().mockReturnValue(false),
            session: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });

    describe('ensureAuth', () => {
        test('should call next if user is authenticated via session', () => {
            // Setup authenticated session
            req.isAuthenticated.mockReturnValue(true);
            req.user = { id: 'user123' };

            // Call middleware
            ensureAuth(req, res, next);

            // Assertions
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should verify JWT token if session auth not available', () => {
            // Setup token in headers
            req.headers.authorization = 'Bearer valid-token';

            // Mock JWT verify
            jwt.verify.mockReturnValue({ id: 'user123', email: 'test@example.com' });

            // Call middleware
            ensureAuth(req, res, next);

            // Assertions
            expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.JWT_SECRET);
            expect(req.user).toEqual({ id: 'user123', email: 'test@example.com' });
            expect(next).toHaveBeenCalled();
        });

        test('should return 401 if no token provided', () => {
            // Call middleware
            ensureAuth(req, res, next);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - No token provided' });
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 401 if token is invalid', () => {
            // Setup token in headers
            req.headers.authorization = 'Bearer invalid-token';

            // Mock JWT verify to throw an error
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            // Call middleware
            ensureAuth(req, res, next);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - Invalid token' });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
