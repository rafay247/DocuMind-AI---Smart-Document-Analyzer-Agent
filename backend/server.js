/**
 * DocuMind AI - Backend Server
 * Express server with document analysis and AI capabilities
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const emailService = require('./services/emailService');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories if they don't exist
const directories = ['uploads', 'analyses'];
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✓ Created directory: ${dir}/`);
    }
});

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🤖 DocuMind AI - Smart Document Analyzer',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            analyze: 'POST /api/analyze',
            getAnalysis: 'GET /api/analysis/:id',
            getAllAnalyses: 'GET /api/analyses',
            askQuestion: 'POST /api/question',
            focusedSummary: 'POST /api/focused-summary',
            resendEmail: 'POST /api/resend-email'
        }
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
const PORT = config.PORT;

app.listen(PORT, async () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 DocuMind AI Backend Server');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${config.NODE_ENV}`);
    console.log(`🔗 Frontend URL: ${config.FRONTEND_URL}`);
    console.log('='.repeat(50));

    // Verify email service
    console.log('\n📧 Verifying email service...');
    const emailReady = await emailService.verifyConnection();

    if (emailReady) {
        console.log('✓ Email notifications enabled');
    } else {
        console.log('✗ Email notifications disabled (check config)');
    }

    console.log('\n✅ Server ready to accept requests\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received, shutting down gracefully...');
    process.exit(0);
});