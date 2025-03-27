/**
 * Text analyzer service
 * Provides functions to analyze text for various metrics
 */
class TextAnalyzer {
    /**
     * Count the number of words in a text
     * @param {string} text - The text to analyze
     * @returns {number} The number of words
     */
    countWords(text) {
        if (!text || typeof text !== "string") {
            return 0;
        }

        return text
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
    }

    /**
     * Count the number of characters in a text (excluding whitespace)
     * @param {string} text - The text to analyze
     * @returns {number} The number of characters
     */
    countCharacters(text) {
        if (!text || typeof text !== "string") {
            return 0;
        }

        return text.replace(/\s+/g, "").length;
    }

    /**
     * Count the number of sentences in a text
     * @param {string} text - The text to analyze
     * @returns {number} The number of sentences
     */
    countSentences(text) {
        if (!text || typeof text !== "string") {
            return 0;
        }

        // Split by sentence endings (., !, ?) and filter out empty entries
        const sentences = text
            .split(/[.!?]+/)
            .filter((sentence) => sentence.trim().length > 0);
        return sentences.length;
    }

    /**
     * Count the number of paragraphs in a text
     * @param {string} text - The text to analyze
     * @returns {number} The number of paragraphs
     */
    countParagraphs(text) {
        if (!text || typeof text !== "string") {
            return 0;
        }

        // Split by double newlines and filter out empty entries
        const paragraphs = text
            .split(/\n\s*\n/)
            .filter((para) => para.trim().length > 0);
        return paragraphs.length || 1; // If no paragraph breaks, count as 1
    }

    /**
     * Find the longest word in each paragraph
     * @param {string} text - The text to analyze
     * @returns {Array} Array of longest words for each paragraph
     */
    findLongestWordsInParagraphs(text) {
        if (!text || typeof text !== "string") {
            return [];
        }

        // Split text into paragraphs
        const paragraphs = text
            .split(/\n\s*\n/)
            .filter((para) => para.trim().length > 0);

        // If no paragraphs found, treat the whole text as one paragraph
        if (paragraphs.length === 0 && text.trim().length > 0) {
            paragraphs.push(text);
        }

        // Find longest word in each paragraph
        return paragraphs.map((para) => {
            const words = para
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0);
            if (words.length === 0) return "";

            // Remove punctuation and convert to lowercase for comparison
            const cleanWords = words.map((word) =>
                word.replace(/[^\w]/g, "").toLowerCase()
            );

            let longestWordIndex = 0;
            let maxLength = cleanWords[0].length;

            for (let i = 1; i < cleanWords.length; i++) {
                if (cleanWords[i].length > maxLength) {
                    maxLength = cleanWords[i].length;
                    longestWordIndex = i;
                }
            }

            return words[longestWordIndex];
        });
    }

    /**
     * Get complete analysis of a text
     * @param {string} text - The text to analyze
     * @returns {Object} Complete analysis results
     */
    analyzeText(text) {
        return {
            wordCount: this.countWords(text),
            characterCount: this.countCharacters(text),
            sentenceCount: this.countSentences(text),
            paragraphCount: this.countParagraphs(text),
            longestWords: this.findLongestWordsInParagraphs(text),
        };
    }
}

module.exports = new TextAnalyzer();
