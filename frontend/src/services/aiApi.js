/**
 * AI API Service
 * Additional AI operations separate from document analysis
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

class AIApiService {
    /**
     * Test AI connection
     */
    async testConnection() {
        const response = await api.get('/ai/test');
        return response.data;
    }

    /**
     * Generate custom analysis with custom prompt
     * @param {string} text - Text to analyze
     * @param {string} prompt - Custom prompt
     */
    async customAnalysis(text, prompt) {
        const response = await api.post('/ai/custom-analysis', { text, prompt });
        return response.data;
    }

    /**
     * Compare two documents
     * @param {string} analysisId1 - First analysis ID
     * @param {string} analysisId2 - Second analysis ID
     */
    async compareDocuments(analysisId1, analysisId2) {
        const response = await api.post('/ai/compare', { analysisId1, analysisId2 });
        return response.data;
    }

    /**
     * Generate summary with specific length
     * @param {string} analysisId - Analysis ID
     * @param {string} length - 'short' | 'medium' | 'long'
     */
    async generateSummary(analysisId, length = 'medium') {
        const response = await api.post('/ai/summarize', { analysisId, length });
        return response.data;
    }

    /**
     * Extract specific information
     * @param {string} analysisId - Analysis ID
     * @param {string} extractionType - 'dates' | 'names' | 'numbers' | 'emails'
     */
    async extractInformation(analysisId, extractionType) {
        const response = await api.post('/ai/extract', { analysisId, extractionType });
        return response.data;
    }
}

const aiApiService = new AIApiService();
export default aiApiService;