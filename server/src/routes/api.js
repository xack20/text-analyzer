const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');
const { ensureAuth } = require('../middleware/auth');
const apiLimiter = require('../middleware/rateLimiter');
const { cache } = require('../middleware/cache');

// Apply rate limiting to all routes
router.use(apiLimiter);

// @route   POST /api/texts
// @desc    Create a new text
router.post('/texts', ensureAuth, textController.createText);

// @route   GET /api/texts
// @desc    Get all texts for a user
router.get('/texts', ensureAuth, cache(300), textController.getUserTexts);

// @route   GET /api/texts/:id
// @desc    Get a text by id
router.get('/texts/:id', ensureAuth, cache(300), textController.getText);

// @route   PUT /api/texts/:id
// @desc    Update a text
router.put('/texts/:id', ensureAuth, textController.updateText);

// @route   DELETE /api/texts/:id
// @desc    Delete a text
router.delete('/texts/:id', ensureAuth, textController.deleteText);

// @route   GET /api/texts/:id/words
// @desc    Get word count
router.get('/texts/:id/words', ensureAuth, cache(300), textController.getWordCount);

// @route   GET /api/texts/:id/characters
// @desc    Get character count
router.get('/texts/:id/characters', ensureAuth, cache(300), textController.getCharacterCount);

// @route   GET /api/texts/:id/sentences
// @desc    Get sentence count
router.get('/texts/:id/sentences', ensureAuth, cache(300), textController.getSentenceCount);

// @route   GET /api/texts/:id/paragraphs
// @desc    Get paragraph count
router.get('/texts/:id/paragraphs', ensureAuth, cache(300), textController.getParagraphCount);

// @route   GET /api/texts/:id/longest-words
// @desc    Get longest words in paragraphs
router.get('/texts/:id/longest-words', ensureAuth, cache(300), textController.getLongestWords);

// @route   GET /api/texts/:id/analysis
// @desc    Get complete analysis
router.get('/texts/:id/analysis', ensureAuth, cache(300), textController.getAnalysis);

module.exports = router;
