/**
 * Configuration file for DocuMind AI
 * Stores all API keys and application settings
 */

require('dotenv').config();

module.exports = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Groq AI Configuration
    GROQ_API_KEY: process.env.GROQ_API_KEY || 'your_groq_api_key_here',
    GROQ_MODEL: 'llama-3.3-70b-versatile', // Free model

    // Email Configuration (Gmail SMTP)
    EMAIL_SERVICE: 'gmail',
    EMAIL_USER: process.env.EMAIL_USER || 'your_email@gmail.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'your_app_password',

    // File Upload Limits
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],

    // Analysis Settings
    SUMMARY_MAX_LENGTH: 500, // words
    KEY_POINTS_COUNT: 5,

    // Frontend URL (for CORS)
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};