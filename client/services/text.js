import axios from '../utils/axios';

export const createText = async (textData) => {
    const response = await axios.post('/api/texts', textData);
    return response.data;
};

export const getUserTexts = async () => {
    const response = await axios.get('/api/texts');
    return response.data;
};

export const getTextById = async (id) => {
    const response = await axios.get(`/api/texts/${id}`);
    return response.data;
};

export const updateText = async (id, textData) => {
    const response = await axios.put(`/api/texts/${id}`, textData);
    return response.data;
};

export const deleteText = async (id) => {
    const response = await axios.delete(`/api/texts/${id}`);
    return response.data;
};

export const getTextAnalysis = async (id) => {
    const response = await axios.get(`/api/texts/${id}/analysis`);
    return response.data;
};

export const getWordCount = async (id) => {
    const response = await axios.get(`/api/texts/${id}/words`);
    return response.data;
};

export const getCharacterCount = async (id) => {
    const response = await axios.get(`/api/texts/${id}/characters`);
    return response.data;
};

export const getSentenceCount = async (id) => {
    const response = await axios.get(`/api/texts/${id}/sentences`);
    return response.data;
};

export const getParagraphCount = async (id) => {
    const response = await axios.get(`/api/texts/${id}/paragraphs`);
    return response.data;
};

export const getLongestWords = async (id) => {
    const response = await axios.get(`/api/texts/${id}/longest-words`);
    return response.data;
};
