// tests/services/textAnalyzer.test.js
const textAnalyzer = require('../../src/services/textAnalyzer');

describe('Text Analyzer Service', () => {
    describe('countWords', () => {
        test('should count words correctly', () => {
            expect(textAnalyzer.countWords('Hello world')).toBe(2);
            expect(textAnalyzer.countWords('This is a test sentence')).toBe(5);
            expect(textAnalyzer.countWords('One-word')).toBe(1);
        });

        test('should handle empty or invalid inputs', () => {
            expect(textAnalyzer.countWords('')).toBe(0);
            expect(textAnalyzer.countWords(null)).toBe(0);
            expect(textAnalyzer.countWords(undefined)).toBe(0);
            expect(textAnalyzer.countWords(123)).toBe(0);
        });

        test('should handle text with extra whitespace', () => {
            expect(textAnalyzer.countWords('  Hello   world  ')).toBe(2);
            expect(textAnalyzer.countWords('\n\nTest\t\twords\n')).toBe(2);
        });
    });

    describe('countCharacters', () => {
        test('should count characters correctly (excluding whitespace)', () => {
            expect(textAnalyzer.countCharacters('Hello world')).toBe(10);
            expect(textAnalyzer.countCharacters('This is a test')).toBe(11);
        });

        test('should handle empty or invalid inputs', () => {
            expect(textAnalyzer.countCharacters('')).toBe(0);
            expect(textAnalyzer.countCharacters(null)).toBe(0);
            expect(textAnalyzer.countCharacters(undefined)).toBe(0);
        });
    });

    describe('countSentences', () => {
        test('should count sentences correctly', () => {
            expect(textAnalyzer.countSentences('This is one sentence.')).toBe(1);
            expect(textAnalyzer.countSentences('Hello. How are you? I am fine!')).toBe(3);
        });

        test('should handle text without sentence endings', () => {
            expect(textAnalyzer.countSentences('This has no ending')).toBe(1);
        });

        test('should handle empty or invalid inputs', () => {
            expect(textAnalyzer.countSentences('')).toBe(0);
            expect(textAnalyzer.countSentences(null)).toBe(0);
        });
    });

    describe('countParagraphs', () => {
        test('should count paragraphs correctly', () => {
            const twoParagraphs = 'First paragraph.\n\nSecond paragraph.';
            expect(textAnalyzer.countParagraphs(twoParagraphs)).toBe(2);

            const threeParagraphs = 'One.\n\nTwo.\n\nThree.';
            expect(textAnalyzer.countParagraphs(threeParagraphs)).toBe(3);
        });

        test('should count single paragraph correctly', () => {
            expect(textAnalyzer.countParagraphs('Just one paragraph.')).toBe(1);
        });

        test('should handle empty or invalid inputs', () => {
            expect(textAnalyzer.countParagraphs('')).toBe(0);
            expect(textAnalyzer.countParagraphs(null)).toBe(0);
        });
    });

    describe('findLongestWordsInParagraphs', () => {
        test('should find longest word in each paragraph', () => {
            const text = 'First paragraph with longword.\n\nSecond extraordinary paragraph.';
            const result = textAnalyzer.findLongestWordsInParagraphs(text);

            expect(result).toHaveLength(2);
            expect(result[0]).toBe('paragraph');
            expect(result[1]).toBe('extraordinary');
        });

        test('should handle single paragraph', () => {
            const result = textAnalyzer.findLongestWordsInParagraphs('Single magnificent paragraph.');
            expect(result).toHaveLength(1);
            expect(result[0]).toBe('magnificent');
        });

        test('should handle empty or invalid inputs', () => {
            expect(textAnalyzer.findLongestWordsInParagraphs('')).toHaveLength(0);
            expect(textAnalyzer.findLongestWordsInParagraphs(null)).toHaveLength(0);
        });
    });

    describe('analyzeText', () => {
        test('should return complete analysis of text', () => {
            const text = 'First paragraph with some words.\n\nSecond paragraph with more words!';
            const analysis = textAnalyzer.analyzeText(text);

            expect(analysis).toHaveProperty('wordCount');
            expect(analysis).toHaveProperty('characterCount');
            expect(analysis).toHaveProperty('sentenceCount');
            expect(analysis).toHaveProperty('paragraphCount');
            expect(analysis).toHaveProperty('longestWords');

            expect(analysis.wordCount).toBe(10);
            expect(analysis.paragraphCount).toBe(2);
            expect(analysis.longestWords).toHaveLength(2);
        });

        test('should handle empty text', () => {
            const analysis = textAnalyzer.analyzeText('');

            expect(analysis.wordCount).toBe(0);
            expect(analysis.characterCount).toBe(0);
            expect(analysis.sentenceCount).toBe(0);
            expect(analysis.paragraphCount).toBe(0);
            expect(analysis.longestWords).toHaveLength(0);
        });
    });
});
