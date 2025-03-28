// tests/integration/text.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Text = require('../../src/models/Text');
const jwt = require('jsonwebtoken');
const config = require('../../src/config/config');
const { setupDB, teardownDB, clearDB } = require('../setup');

describe('Text API Routes', () => {
    let token, userId;

    beforeAll(async () => {
        await setupDB();

        // Create a test user
        const user = await User.create({
            googleId: 'test-google-id',
            displayName: 'Test User',
            email: 'test@example.com'
        });

        userId = user._id.toString();

        // Create JWT token for auth
        token = jwt.sign(
            {
                id: userId,
                email: user.email,
                name: user.displayName
            },
            config.JWT_SECRET,
            { expiresIn: '1d' }
        );
    });

    afterAll(async () => {
        await teardownDB();
    });

    beforeEach(async () => {
        await Text.deleteMany({});
    });

    describe('POST /api/texts', () => {
        test('should create a new text document', async () => {
            const textData = {
                title: 'Integration Test Title',
                content: 'This is content for integration testing.'
            };

            const response = await request(app)
                .post('/api/texts')
                .set('Authorization', `Bearer ${token}`)
                .send(textData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.title).toBe(textData.title);
            expect(response.body.content).toBe(textData.content);
            expect(response.body.user).toBe(userId);
        });

        test('should return 400 if title is missing', async () => {
            const textData = {
                content: 'This is content without a title.'
            };

            const response = await request(app)
                .post('/api/texts')
                .set('Authorization', `Bearer ${token}`)
                .send(textData);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Title and content are required');
        });

        test('should return 401 if not authenticated', async () => {
            const textData = {
                title: 'Unauthorized Test',
                content: 'This should fail without auth.'
            };

            const response = await request(app)
                .post('/api/texts')
                .send(textData);

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/texts', () => {
        beforeEach(async () => {
            // Create some test texts
            await Text.create([
                {
                    title: 'Test Text 1',
                    content: 'Content 1',
                    user: userId
                },
                {
                    title: 'Test Text 2',
                    content: 'Content 2',
                    user: userId
                }
            ]);
        });

        test('should get all texts for the user', async () => {
            const response = await request(app)
                .get('/api/texts')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(2);
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('content');
        });

        test('should return 401 if not authenticated', async () => {
            const response = await request(app).get('/api/texts');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/texts/:id', () => {
        let textId;

        beforeEach(async () => {
            // Create a test text
            const text = await Text.create({
                title: 'Single Test Text',
                content: 'This is for testing single text retrieval.',
                user: userId
            });

            textId = text._id.toString();
        });

        test('should get a single text by ID', async () => {
            const response = await request(app)
                .get(`/api/texts/${textId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', textId);
            expect(response.body).toHaveProperty('title', 'Single Test Text');
        });

        test('should return 404 if text not found', async () => {
            const fakeId = '60a50c550e812a0015123456';

            const response = await request(app)
                .get(`/api/texts/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        test('should return 403 if text belongs to another user', async () => {
            // Create a text with a different user ID
            const anotherUserId = '60a50c550e812a0015abcdef';
            const anotherText = await Text.create({
                title: 'Another User Text',
                content: 'This belongs to another user.',
                user: anotherUserId
            });

            const response = await request(app)
                .get(`/api/texts/${anotherText._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /api/texts/:id', () => {
        let textId;

        beforeEach(async () => {
            // Create a test text
            const text = await Text.create({
                title: 'Original Title',
                content: 'Original content.',
                user: userId
            });

            textId = text._id.toString();
        });

        test('should update a text', async () => {
            const updatedData = {
                title: 'Updated Title',
                content: 'Updated content.'
            };

            const response = await request(app)
                .put(`/api/texts/${textId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('title', 'Updated Title');
            expect(response.body).toHaveProperty('content', 'Updated content.');
        });
    });

    describe('DELETE /api/texts/:id', () => {
        let textId;

        beforeEach(async () => {
            // Create a test text
            const text = await Text.create({
                title: 'Text to Delete',
                content: 'This text will be deleted.',
                user: userId
            });

            textId = text._id.toString();
        });

        test('should delete a text', async () => {
            const response = await request(app)
                .delete(`/api/texts/${textId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Text removed');

            // Verify text was deleted
            const textExists = await Text.findById(textId);
            expect(textExists).toBeNull();
        });
    });

    describe('GET /api/texts/:id/analysis', () => {
        let textId;

        beforeEach(async () => {
            // Create a test text
            const text = await Text.create({
                title: 'Analysis Test',
                content: 'This is a sample text. It has two sentences. And multiple words!',
                user: userId
            });

            textId = text._id.toString();
        });

        test('should return complete analysis for a text', async () => {
            const response = await request(app)
                .get(`/api/texts/${textId}/analysis`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('wordCount');
            expect(response.body).toHaveProperty('characterCount');
            expect(response.body).toHaveProperty('sentenceCount');
            expect(response.body).toHaveProperty('paragraphCount');
            expect(response.body).toHaveProperty('longestWords');

            // Verify analysis results
            expect(response.body.wordCount).toBe(14);
            expect(response.body.sentenceCount).toBe(3);
            expect(response.body.paragraphCount).toBe(1);
        });
    });
});
