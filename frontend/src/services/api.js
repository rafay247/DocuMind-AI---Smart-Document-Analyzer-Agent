/**
 * API Service
 * Handles all API calls to backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

class ApiService {
    /**
     * Upload and analyze document
     * @param {File} file - Document file
     * @param {string} email - Email for notification
     * @param {boolean} notifyEmail - Whether to send email
     * @param {Function} onProgress - Progress callback
     */
    async analyzeDocument(file, email = '', notifyEmail = false, onProgress) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', email);
        formData.append('notifyEmail', notifyEmail.toString());

        const response = await api.post('/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            }
        });

        return response.data;
    }

    /**
     * Get analysis by ID
     * @param {string} analysisId - Analysis ID
     */
    async getAnalysis(analysisId) {
        const response = await api.get(`/analysis/${analysisId}`);
        return response.data;
    }

    /**
     * Get all analyses
     */
    async getAllAnalyses() {
        const response = await api.get('/analyses');
        return response.data;
    }

    /**
     * Ask question about document
     * @param {string} analysisId - Analysis ID
     * @param {string} question - User's question
     * @param {Array} conversationHistory - Previous Q&A
     */
    async askQuestion(analysisId, question, conversationHistory = []) {
        const response = await api.post('/question', {
            analysisId,
            question,
            conversationHistory
        });
        return response.data;
    }

    /**
     * Generate focused summary
     * @param {string} analysisId - Analysis ID
     * @param {string} focusArea - Area to focus on
     */
    async generateFocusedSummary(analysisId, focusArea) {
        const response = await api.post('/focused-summary', {
            analysisId,
            focusArea
        });
        return response.data;
    }

    /**
     * Resend analysis email
     * @param {string} analysisId - Analysis ID
     * @param {string} email - Email address
     */
    async resendEmail(analysisId, email) {
        const response = await api.post('/resend-email', {
            analysisId,
            email
        });
        return response.data;
    }

    /**
     * Health check
     */
    async healthCheck() {
        const response = await api.get('/health');
        return response.data;
    }
}

const apiService = new ApiService();
export default apiService;