const Text = require('../models/Text');
const textAnalyzer = require('../services/textAnalyzer');
const logger = require('../utils/logger');

module.exports = {
    // Create a new text document
    createText: async (req, res) => {
        try {
            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ message: 'Title and content are required' });
            }

            const newText = await Text.create({
                title,
                content,
                user: req.user.id
            });

            logger.info(`Text created: ${newText._id} by user ${req.user.id}`);

            res.status(201).json(newText);
        } catch (error) {
            logger.error(`Create text error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get all texts for a user
    getUserTexts: async (req, res) => {
        try {
            const texts = await Text.find({ user: req.user.id }).sort({ createdAt: -1 });
            res.json(texts);
        } catch (error) {
            logger.error(`Get user texts error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get a single text by ID
    getText: async (req, res) => {
        try {
            const text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized access attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            res.json(text);
        } catch (error) {
            logger.error(`Get text error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Update a text
    updateText: async (req, res) => {
        try {
            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ message: 'Title and content are required' });
            }

            let text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized update attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            text = await Text.findByIdAndUpdate(
                req.params.id,
                {
                    title,
                    content,
                    updatedAt: Date.now()
                },
                { new: true }
            );

            logger.info(`Text updated: ${text._id} by user ${req.user.id}`);

            res.json(text);
        } catch (error) {
            logger.error(`Update text error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Delete a text
    deleteText: async (req, res) => {
        try {
            const text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized delete attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            await text.deleteOne();

            logger.info(`Text deleted: ${req.params.id} by user ${req.user.id}`);

            res.json({ message: 'Text removed' });
        } catch (error) {
            logger.error(`Delete text error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get word count
    getWordCount: async (req, res) => {
        try {
            const text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized access attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const wordCount = textAnalyzer.countWords(text.content);

            res.json({ wordCount });
        } catch (error) {
            logger.error(`Get word count error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get character count
    getCharacterCount: async (req, res) => {
        try {
            const text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized access attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const characterCount = textAnalyzer.countCharacters(text.content);

            res.json({ characterCount });
        } catch (error) {
            logger.error(`Get character count error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get sentence count
    getSentenceCount: async (req, res) => {
        try {
            const text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized access attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const sentenceCount = textAnalyzer.countSentences(text.content);

            res.json({ sentenceCount });
        } catch (error) {
            logger.error(`Get sentence count error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get paragraph count
    getParagraphCount: async (req, res) => {
        try {
            const text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized access attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const paragraphCount = textAnalyzer.countParagraphs(text.content);

            res.json({ paragraphCount });
        } catch (error) {
            logger.error(`Get paragraph count error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get longest words in paragraphs
    getLongestWords: async (req, res) => {
        try {
            const text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized access attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const longestWords = textAnalyzer.findLongestWordsInParagraphs(text.content);

            res.json({ longestWords });
        } catch (error) {
            logger.error(`Get longest words error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get complete analysis
    getAnalysis: async (req, res) => {
        try {
            const text = await Text.findById(req.params.id);

            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }

            // Check if the text belongs to the user
            if (text.user.toString() !== req.user.id) {
                logger.warn(`Unauthorized access attempt to text ${req.params.id} by user ${req.user.id}`);
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const analysis = textAnalyzer.analyzeText(text.content);

            res.json(analysis);
        } catch (error) {
            logger.error(`Get analysis error: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    }
};
