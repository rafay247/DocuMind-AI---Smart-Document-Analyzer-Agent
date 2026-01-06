/**
 * Document Controller
 * Handles document upload, analysis, and management
 */

const { v4: uuidv4 } = require('uuid');
const fileService = require('../services/fileService');
const groqService = require('../services/groqService');
const emailService = require('../services/emailService');

class DocumentController {
    /**
     * Upload and analyze document
     * POST /api/analyze
     */
    async analyzeDocument(req, res) {
        try {
            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded'
                });
            }

            const { email, notifyEmail } = req.body;
            const file = req.file;

            console.log(`📄 Processing document: ${file.originalname}`);

            // Step 1: Extract text from document
            const extractionResult = await fileService.extractText(file);

            if (!extractionResult.success) {
                // Clean up uploaded file
                await fileService.deleteFile(file.path);
                return res.status(400).json({
                    success: false,
                    error: extractionResult.error
                });
            }

            const { text, metadata } = extractionResult;

            // Validate extracted text
            if (!text || text.trim().length < 50) {
                await fileService.deleteFile(file.path);
                return res.status(400).json({
                    success: false,
                    error: 'Document contains insufficient text for analysis'
                });
            }

            console.log(`✓ Text extracted: ${metadata.wordCount} words`);

            // Step 2: Analyze with AI
            console.log('🤖 Running AI analysis...');
            const analysisResult = await groqService.analyzeDocument(text);

            if (!analysisResult.success) {
                await fileService.deleteFile(file.path);
                return res.status(500).json({
                    success: false,
                    error: analysisResult.error
                });
            }

            console.log('✓ AI analysis complete');

            // Step 3: Prepare response data
            const analysisId = uuidv4();
            const analysisData = {
                id: analysisId,
                fileName: file.originalname,
                uploadedAt: new Date().toISOString(),
                metadata: metadata,
                analysis: analysisResult.analysis,
                documentText: text.substring(0, 5000) // Store first 5000 chars for Q&A
            };

            // Step 4: Save analysis to file system
            await fileService.saveAnalysis(analysisId, analysisData);
            console.log(`✓ Analysis saved: ${analysisId}`);

            // Step 5: Send email notification if requested
            if (notifyEmail === 'true' && email) {
                console.log(`📧 Sending email to: ${email}`);
                const emailResult = await emailService.sendAnalysis(
                    email,
                    file.originalname,
                    analysisResult.analysis
                );

                if (emailResult.success) {
                    console.log('✓ Email sent successfully');
                } else {
                    console.log('✗ Email sending failed:', emailResult.error);
                }
            }

            // Step 6: Clean up uploaded file
            await fileService.deleteFile(file.path);

            // Return success response
            res.json({
                success: true,
                data: {
                    analysisId,
                    fileName: file.originalname,
                    metadata,
                    analysis: analysisResult.analysis
                }
            });

        } catch (error) {
            console.error('Document analysis error:', error);

            // Clean up file if it exists
            if (req.file) {
                await fileService.deleteFile(req.file.path);
            }

            res.status(500).json({
                success: false,
                error: 'Failed to analyze document'
            });
        }
    }

    /**
     * Get analysis by ID
     * GET /api/analysis/:id
     */
    async getAnalysis(req, res) {
        try {
            const { id } = req.params;
            const result = await fileService.loadAnalysis(id);

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    error: 'Analysis not found'
                });
            }

            res.json({
                success: true,
                data: result.data
            });
        } catch (error) {
            console.error('Get analysis error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve analysis'
            });
        }
    }

    /**
     * Get all analyses
     * GET /api/analyses
     */
    async getAllAnalyses(req, res) {
        try {
            const result = await fileService.getAllAnalyses();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            // Sort by date (newest first)
            const sortedAnalyses = result.analyses.sort((a, b) =>
                new Date(b.uploadedAt) - new Date(a.uploadedAt)
            );

            res.json({
                success: true,
                data: sortedAnalyses
            });
        } catch (error) {
            console.error('Get all analyses error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve analyses'
            });
        }
    }

    /**
     * Ask question about analyzed document
     * POST /api/question
     */
    async askQuestion(req, res) {
        try {
            const { analysisId, question, conversationHistory } = req.body;

            if (!analysisId || !question) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            // Load the analysis to get document text
            const analysisResult = await fileService.loadAnalysis(analysisId);

            if (!analysisResult.success) {
                return res.status(404).json({
                    success: false,
                    error: 'Analysis not found'
                });
            }

            const documentText = analysisResult.data.documentText;

            // Get answer from AI
            const answer = await groqService.answerQuestion(
                documentText,
                question,
                conversationHistory || []
            );

            res.json({
                success: true,
                data: {
                    question,
                    answer,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Question answering error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to answer question'
            });
        }
    }

    /**
     * Generate focused summary
     * POST /api/focused-summary
     */
    async generateFocusedSummary(req, res) {
        try {
            const { analysisId, focusArea } = req.body;

            if (!analysisId || !focusArea) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            // Load analysis
            const analysisResult = await fileService.loadAnalysis(analysisId);

            if (!analysisResult.success) {
                return res.status(404).json({
                    success: false,
                    error: 'Analysis not found'
                });
            }

            const documentText = analysisResult.data.documentText;

            // Generate focused summary
            const summary = await groqService.generateFocusedSummary(
                documentText,
                focusArea
            );

            res.json({
                success: true,
                data: {
                    focusArea,
                    summary,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Focused summary error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate focused summary'
            });
        }
    }

    /**
     * Resend analysis email
     * POST /api/resend-email
     */
    async resendEmail(req, res) {
        try {
            const { analysisId, email } = req.body;

            if (!analysisId || !email) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            // Load analysis
            const analysisResult = await fileService.loadAnalysis(analysisId);

            if (!analysisResult.success) {
                return res.status(404).json({
                    success: false,
                    error: 'Analysis not found'
                });
            }

            const { fileName, analysis } = analysisResult.data;

            // Send email
            const emailResult = await emailService.sendAnalysis(
                email,
                fileName,
                analysis
            );

            if (!emailResult.success) {
                return res.status(500).json({
                    success: false,
                    error: emailResult.error
                });
            }

            res.json({
                success: true,
                message: 'Email sent successfully'
            });
        } catch (error) {
            console.error('Resend email error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to send email'
            });
        }
    }
}

module.exports = new DocumentController();