const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { setupDB, teardownDB, clearDB } = require('../setup');

// Valid JWT token for testing
const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTZhNTI1YjNjODRlNDc3MjgyNDczMCIsImVtYWlsIjoiemFrYXJpYWhvc3NhaW4yMEBnbWFpbC5jb20iLCJuYW1lIjoiWmFrYXJpYSBIb3NzYWluIiwiaWF0IjoxNzQzMTc1NjA0LCJleHAiOjE3NDMyNjIwMDR9.DC86j1kOeTKpAYffzWsSH_OZDDlX22GMqcjz0Tb2pqM';

describe('Auth Routes', () => {
    beforeAll(async () => {
        await setupDB();
    });

    afterAll(async () => {
        await teardownDB();
    });

    beforeEach(async () => {
        await clearDB();
    });

    describe('GET /auth/google', () => {
        test('should redirect to Google OAuth', async () => {
            const response = await request(app).get('/auth/google');
            expect(response.status).toBe(302); // Redirect status
            expect(response.header.location).toContain('accounts.google.com');
        });
    });

    describe('GET /auth/current', () => {
        test('should return 401 if not authenticated', async () => {
            const response = await request(app).get('/auth/current');
            expect(response.status).toBe(401);
        });

        test('should return user data if authenticated with valid token', async () => {
            // Create a test user with the ID from the token
            const user = await User.create({
                _id: '67e6a525b3c84e4772824730', // ID from the token
                googleId: 'test-google-id',
                displayName: 'Zakaria Hossain',
                email: 'zakariahossain20@gmail.com'
            });

            // Request current user with token
            const response = await request(app)
                .get('/auth/current')
                .set('Authorization', `Bearer ${VALID_TOKEN}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('email', 'zakariahossain20@gmail.com');
            expect(response.body).toHaveProperty('displayName', 'Zakaria Hossain');
        });
    });

    describe('GET /auth/logout', () => {
        test('should redirect to login page', async () => {
            const response = await request(app).get('/auth/logout');
            expect(response.status).toBe(302); // Redirect status
            expect(response.header.location).toBe('http://localhost:3000/login');
        });

        test('should return JSON if Accept header is application/json', async () => {
            const response = await request(app)
                .get('/auth/logout')
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Logout successful');
        });
    });
});