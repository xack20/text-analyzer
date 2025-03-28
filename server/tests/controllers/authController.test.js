// tests/controllers/authController.test.js
const authController = require('../../src/controllers/authController');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const config = require('../../src/config/config');
const { setupDB, teardownDB, clearDB } = require('../setup');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup request and response objects
        req = {
            user: {
                id: 'user123',
                email: 'test@example.com',
                displayName: 'Test User'
            },
            session: {},
            logout: jest.fn(cb => cb())
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn()
        };
    });

    describe('googleCallback', () => {
        test('should redirect with token on successful login', () => {
            // Mock JWT sign
            jwt.sign.mockReturnValue('fake-token');

            // Call the controller
            authController.googleCallback(req, res);

            // Assertions
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    id: 'user123',
                    email: 'test@example.com',
                    name: 'Test User'
                },
                config.JWT_SECRET,
                { expiresIn: '1d' }
            );

            expect(res.redirect).toHaveBeenCalledWith(
                'http://localhost:3000/dashboard?token=fake-token'
            );
        });

        test('should redirect to login page if no user in request', () => {
            // Remove user from request
            req.user = null;

            // Call the controller
            authController.googleCallback(req, res);

            // Assertions
            expect(jwt.sign).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith(
                'http://localhost:3000/login?error=no_user'
            );
        });

        test('should handle errors and redirect to login page', () => {
            // Make JWT sign throw an error
            jwt.sign.mockImplementation(() => {
                throw new Error('JWT error');
            });

            // Call the controller
            authController.googleCallback(req, res);

            // Assertions
            expect(res.redirect).toHaveBeenCalledWith(
                'http://localhost:3000/login?error=auth_failed'
            );
        });
    });

    describe('getCurrentUser', () => {
        test('should return user data if found', async () => {
            // Mock User.findById to return a user
            User.findById.mockResolvedValue({
                id: 'user123',
                email: 'test@example.com',
                displayName: 'Test User'
            });

            // Call the controller
            await authController.getCurrentUser(req, res);

            // Assertions
            expect(User.findById).toHaveBeenCalledWith('user123');
            expect(res.json).toHaveBeenCalledWith({
                id: 'user123',
                email: 'test@example.com',
                displayName: 'Test User'
            });
        });

        test('should return 404 if user not found', async () => {
            // Mock User.findById to return null
            User.findById.mockResolvedValue(null);

            // Call the controller
            await authController.getCurrentUser(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        test('should handle database errors', async () => {
            // Mock User.findById to throw an error
            User.findById.mockRejectedValue(new Error('Database error'));

            // Call the controller
            await authController.getCurrentUser(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('logout', () => {
        test('should call req.logout and redirect', () => {
            // Call the controller
            authController.logout(req, res);

            // Assertions
            expect(req.logout).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/login');
        });

        test('should handle JSON response for API clients', () => {
            // Set Accept header to request JSON response
            req.headers = { accept: 'application/json' };

            // Call the controller
            authController.logout(req, res);

            // Assertions
            expect(req.logout).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Logout successful',
                redirectUrl: 'http://localhost:3000/login'
            });
        });

        test('should handle logout errors', () => {
            // Make req.logout call the callback with an error
            req.logout = jest.fn(cb => cb(new Error('Logout error')));

            // Call the controller
            authController.logout(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Logout failed',
                redirectUrl: 'http://localhost:3000/login'
            });
        });
    });

    describe('devLogin', () => {
        const originalNodeEnv = process.env.NODE_ENV;

        afterEach(() => {
            // Restore original NODE_ENV
            process.env.NODE_ENV = originalNodeEnv;
        });

        test('should return token in development mode', () => {
            // Set NODE_ENV to development
            process.env.NODE_ENV = 'development';

            // Mock JWT sign
            jwt.sign.mockReturnValue('dev-token');

            // Call the controller
            authController.devLogin(req, res);

            // Assertions
            expect(jwt.sign).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ token: 'dev-token' });
        });

        test('should return 404 in production mode', () => {
            // Set NODE_ENV to production
            process.env.NODE_ENV = 'production';

            // Call the controller
            authController.devLogin(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
        });
    });
});
