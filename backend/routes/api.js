/**
 * API Routes
 * Defines all API endpoints
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const documentController = require('../controllers/documentController');
const aiController = require('../controllers/aiController');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'DocuMind API is running',
        timestamp: new Date().toISOString()
    });
});

// ==================== DOCUMENT ROUTES ====================

// Document analysis endpoint
// POST /api/analyze
// Form data: file (required), email (optional), notifyEmail (optional)
router.post('/analyze', upload.single('file'), documentController.analyzeDocument);

// Get single analysis by ID
// GET /api/analysis/:id
router.get('/analysis/:id', documentController.getAnalysis);

// Get all analyses
// GET /api/analyses
router.get('/analyses', documentController.getAllAnalyses);

// Ask question about document
// POST /api/question
// Body: { analysisId, question, conversationHistory }
router.post('/question', documentController.askQuestion);

// Generate focused summary
// POST /api/focused-summary
// Body: { analysisId, focusArea }
router.post('/focused-summary', documentController.generateFocusedSummary);

// Resend analysis email
// POST /api/resend-email
// Body: { analysisId, email }
router.post('/resend-email', documentController.resendEmail);

// ==================== AI ROUTES ====================

// Test AI connection
// GET /api/ai/test
router.get('/ai/test', aiController.testConnection);

// Generate custom analysis with custom prompt
// POST /api/ai/custom-analysis
// Body: { text, prompt }
router.post('/ai/custom-analysis', aiController.customAnalysis);

// Compare two documents
// POST /api/ai/compare
// Body: { analysisId1, analysisId2 }
router.post('/ai/compare', aiController.compareDocuments);

// Generate summary with specific length
// POST /api/ai/summarize
// Body: { analysisId, length: 'short' | 'medium' | 'long' }
router.post('/ai/summarize', aiController.generateSummary);

// Extract specific information
// POST /api/ai/extract
// Body: { analysisId, extractionType: 'dates' | 'names' | 'numbers' | 'emails' }
router.post('/ai/extract', aiController.extractInformation);

module.exports = router;