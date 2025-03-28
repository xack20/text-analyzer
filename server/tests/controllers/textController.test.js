// tests/controllers/textController.test.js
const textController = require('../../src/controllers/textController');
const Text = require('../../src/models/Text');
const textAnalyzer = require('../../src/services/textAnalyzer');
const { setupDB, teardownDB, clearDB } = require('../setup');

// Mock dependencies
jest.mock('../../src/models/Text');
jest.mock('../../src/services/textAnalyzer');

describe('Text Controller', () => {
    let req, res;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup request and response objects
        req = {
            user: {
                id: 'user123'
            },
            body: {},
            params: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createText', () => {
        test('should create a new text document', async () => {
            // Setup request body
            req.body = {
                title: 'Test Title',
                content: 'Test content'
            };

            // Mock Text.create to return a new text
            const mockText = {
                _id: 'text123',
                title: 'Test Title',
                content: 'Test content',
                user: 'user123'
            };
            Text.create.mockResolvedValue(mockText);

            // Call the controller
            await textController.createText(req, res);

            // Assertions
            expect(Text.create).toHaveBeenCalledWith({
                title: 'Test Title',
                content: 'Test content',
                user: 'user123'
            });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockText);
        });

        test('should return 400 if title or content is missing', async () => {
            // Setup request with missing content
            req.body = {
                title: 'Test Title'
            };

            // Call the controller
            await textController.createText(req, res);

            // Assertions
            expect(Text.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Title and content are required' });
        });

        test('should handle database errors', async () => {
            // Setup request body
            req.body = {
                title: 'Test Title',
                content: 'Test content'
            };

            // Mock Text.create to throw an error
            Text.create.mockRejectedValue(new Error('Database error'));

            // Call the controller
            await textController.createText(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('getUserTexts', () => {
        test('should return all texts for a user', async () => {
            // Mock Text.find to return texts
            const mockTexts = [
                { _id: 'text1', title: 'Title 1', content: 'Content 1' },
                { _id: 'text2', title: 'Title 2', content: 'Content 2' }
            ];

            Text.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockTexts)
            });

            // Call the controller
            await textController.getUserTexts(req, res);

            // Assertions
            expect(Text.find).toHaveBeenCalledWith({ user: 'user123' });
            expect(res.json).toHaveBeenCalledWith(mockTexts);
        });

        test('should handle database errors', async () => {
            // Mock Text.find to throw an error
            Text.find.mockReturnValue({
                sort: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            // Call the controller
            await textController.getUserTexts(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('getText', () => {
        test('should return a text by ID', async () => {
            // Setup request params
            req.params.id = 'text123';

            // Mock Text.findById to return a text
            const mockText = {
                _id: 'text123',
                title: 'Test Title',
                content: 'Test content',
                user: 'user123'
            };
            Text.findById.mockResolvedValue(mockText);

            // Call the controller
            await textController.getText(req, res);

            // Assertions
            expect(Text.findById).toHaveBeenCalledWith('text123');
            expect(res.json).toHaveBeenCalledWith(mockText);
        });

        test('should return 404 if text not found', async () => {
            // Setup request params
            req.params.id = 'nonexistent';

            // Mock Text.findById to return null
            Text.findById.mockResolvedValue(null);

            // Call the controller
            await textController.getText(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Text not found' });
        });

        test('should return 403 if text belongs to another user', async () => {
            // Setup request params
            req.params.id = 'text123';

            // Mock Text.findById to return a text with different user
            const mockText = {
                _id: 'text123',
                title: 'Test Title',
                content: 'Test content',
                user: 'anotherUser' // Different user ID
            };
            Text.findById.mockResolvedValue(mockText);

            // Call the controller
            await textController.getText(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });
    });

    describe('updateText', () => {
        beforeEach(() => {
            // Setup request params and body
            req.params.id = 'text123';
            req.body = {
                title: 'Updated Title',
                content: 'Updated content'
            };
        });

        test('should update a text successfully', async () => {
            // Mock Text.findById to return a text
            const mockText = {
                _id: 'text123',
                title: 'Original Title',
                content: 'Original content',
                user: 'user123'
            };
            Text.findById.mockResolvedValue(mockText);

            // Mock Text.findByIdAndUpdate to return updated text
            const updatedText = {
                _id: 'text123',
                title: 'Updated Title',
                content: 'Updated content',
                user: 'user123'
            };
            Text.findByIdAndUpdate.mockResolvedValue(updatedText);

            // Call the controller
            await textController.updateText(req, res);

            // Assertions
            expect(Text.findByIdAndUpdate).toHaveBeenCalledWith(
                'text123',
                {
                    title: 'Updated Title',
                    content: 'Updated content',
                    updatedAt: expect.any(Number)
                },
                { new: true }
            );

            expect(res.json).toHaveBeenCalledWith(updatedText);
        });

        test('should return 400 if title or content is missing', async () => {
            // Remove title from request body
            req.body = {
                content: 'Updated content'
            };

            // Call the controller
            await textController.updateText(req, res);

            // Assertions
            expect(Text.findById).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Title and content are required' });
        });

        test('should return 404 if text not found', async () => {
            // Mock Text.findById to return null
            Text.findById.mockResolvedValue(null);

            // Call the controller
            await textController.updateText(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Text not found' });
        });

        test('should return 403 if text belongs to another user', async () => {
            // Mock Text.findById to return a text with different user
            const mockText = {
                _id: 'text123',
                title: 'Original Title',
                content: 'Original content',
                user: 'anotherUser' // Different user ID
            };
            Text.findById.mockResolvedValue(mockText);

            // Call the controller
            await textController.updateText(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });
    });

    describe('deleteText', () => {
        beforeEach(() => {
            // Setup request params
            req.params.id = 'text123';
        });

        test('should delete a text successfully', async () => {
            // Mock Text.findById to return a text
            const mockText = {
                _id: 'text123',
                title: 'Test Title',
                content: 'Test content',
                user: 'user123',
                deleteOne: jest.fn().mockResolvedValue({})
            };
            Text.findById.mockResolvedValue(mockText);

            // Call the controller
            await textController.deleteText(req, res);

            // Assertions
            expect(mockText.deleteOne).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: 'Text removed' });
        });

        test('should return 404 if text not found', async () => {
            // Mock Text.findById to return null
            Text.findById.mockResolvedValue(null);

            // Call the controller
            await textController.deleteText(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Text not found' });
        });

        test('should return 403 if text belongs to another user', async () => {
            // Mock Text.findById to return a text with different user
            const mockText = {
                _id: 'text123',
                title: 'Test Title',
                content: 'Test content',
                user: 'anotherUser' // Different user ID
            };
            Text.findById.mockResolvedValue(mockText);

            // Call the controller
            await textController.deleteText(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });
    });

    describe('getAnalysis', () => {
        beforeEach(() => {
            // Setup request params
            req.params.id = 'text123';
        });

        test('should return complete analysis for a text', async () => {
            // Mock Text.findById to return a text
            const mockText = {
                _id: 'text123',
                title: 'Test Title',
                content: 'Test content',
                user: 'user123'
            };
            Text.findById.mockResolvedValue(mockText);

            // Mock textAnalyzer.analyzeText to return analysis
            const mockAnalysis = {
                wordCount: 2,
                characterCount: 11,
                sentenceCount: 1,
                paragraphCount: 1,
                longestWords: ['content']
            };
            textAnalyzer.analyzeText.mockReturnValue(mockAnalysis);

            // Call the controller
            await textController.getAnalysis(req, res);

            // Assertions
            expect(textAnalyzer.analyzeText).toHaveBeenCalledWith('Test content');
            expect(res.json).toHaveBeenCalledWith(mockAnalysis);
        });

        test('should return 404 if text not found', async () => {
            // Mock Text.findById to return null
            Text.findById.mockResolvedValue(null);

            // Call the controller
            await textController.getAnalysis(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Text not found' });
        });

        test('should return 403 if text belongs to another user', async () => {
            // Mock Text.findById to return a text with different user
            const mockText = {
                _id: 'text123',
                title: 'Test Title',
                content: 'Test content',
                user: 'anotherUser' // Different user ID
            };
            Text.findById.mockResolvedValue(mockText);

            // Call the controller
            await textController.getAnalysis(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });
    });
});
