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
            headers: { accept: 'text/html' }, // Default to HTML
            logout: jest.fn(cb => cb())
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn()
        };
    });

    describe('getCurrentUser', () => {
        test('should return user data if found', async () => {
            // Create a mock user
            const mockUser = {
                id: '67e6a525b3c84e4772824730',
                email: 'zakariahossain20@gmail.com',
                displayName: 'Zakaria Hossain'
            };

            // Create a select method mock that returns the user
            const selectMock = jest.fn().mockReturnValue(mockUser);

            // Mock findById to return an object with select method
            User.findById = jest.fn().mockReturnValue({
                select: selectMock
            });

            // Call the controller
            await authController.getCurrentUser(req, res);

            // Assertions
            expect(User.findById).toHaveBeenCalledWith('user123');
            expect(selectMock).toHaveBeenCalledWith('-googleId');
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        test('should return 404 if user not found', async () => {
            // Mock User.findById to return an object with select that returns null
            User.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue(null)
            });

            // Call the controller
            await authController.getCurrentUser(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        test('should handle database errors', async () => {
            // Mock User.findById to throw an error
            User.findById = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });

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
