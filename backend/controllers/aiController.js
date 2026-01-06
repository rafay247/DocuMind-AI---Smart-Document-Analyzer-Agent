/**
 * AI Controller
 * Handles AI-specific operations separate from document processing
 */

const groqService = require('../services/groqService');
const fileService = require('../services/fileService');

class AIController {
    /**
     * Test AI connection
     * GET /api/ai/test
     */
    async testConnection(req, res) {
        try {
            const testPrompt = "Respond with 'OK' if you can read this.";

            const completion = await groqService.client.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'user', content: testPrompt }
                ],
                max_tokens: 50
            });

            const response = completion.choices[0].message.content;

            res.json({
                success: true,
                message: 'AI connection successful',
                response: response,
                model: 'llama-3.3-70b-versatile'
            });
        } catch (error) {
            logger.error('AI connection test failed', error);
            res.status(500).json({
                success: false,
                error: 'Failed to connect to AI service'
            });
        }
    }

    /**
     * Generate custom analysis
     * POST /api/ai/custom-analysis
     * Body: { text, prompt }
     */
    async customAnalysis(req, res) {
        try {
            const { text, prompt } = req.body;

            if (!text || !prompt) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: text and prompt'
                });
            }

            logger.info('Custom analysis requested', { promptLength: prompt.length });

            const completion = await groqService.client.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant for document analysis.'
                    },
                    {
                        role: 'user',
                        content: `${prompt}\n\nText to analyze:\n${text.substring(0, 10000)}`
                    }
                ],
                temperature: 0.5,
                max_tokens: 1000
            });

            const result = completion.choices[0].message.content;

            res.json({
                success: true,
                data: {
                    result,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            logger.error('Custom analysis failed', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate custom analysis'
            });
        }
    }

    /**
     * Compare two documents
     * POST /api/ai/compare
     * Body: { analysisId1, analysisId2 }
     */
    async compareDocuments(req, res) {
        try {
            const { analysisId1, analysisId2 } = req.body;

            if (!analysisId1 || !analysisId2) {
                return res.status(400).json({
                    success: false,
                    error: 'Both analysisId1 and analysisId2 are required'
                });
            }

            // Load both analyses
            const analysis1 = await fileService.loadAnalysis(analysisId1);
            const analysis2 = await fileService.loadAnalysis(analysisId2);

            if (!analysis1.success || !analysis2.success) {
                return res.status(404).json({
                    success: false,
                    error: 'One or both analyses not found'
                });
            }

            const doc1 = analysis1.data;
            const doc2 = analysis2.data;

            logger.info('Comparing documents', {
                doc1: doc1.fileName,
                doc2: doc2.fileName
            });

            // Generate comparison using AI
            const comparisonPrompt = `Compare these two documents and provide:
1. Main similarities
2. Key differences
3. Which document covers topics more comprehensively
4. Recommendations based on the comparison

Document 1 (${doc1.fileName}):
Summary: ${doc1.analysis.summary}
Key Points: ${doc1.analysis.keyPoints?.join(', ')}

Document 2 (${doc2.fileName}):
Summary: ${doc2.analysis.summary}
Key Points: ${doc2.analysis.keyPoints?.join(', ')}`;

            const completion = await groqService.client.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert at comparing and contrasting documents.'
                    },
                    {
                        role: 'user',
                        content: comparisonPrompt
                    }
                ],
                temperature: 0.4,
                max_tokens: 800
            });

            const comparison = completion.choices[0].message.content;

            res.json({
                success: true,
                data: {
                    document1: {
                        id: doc1.id,
                        fileName: doc1.fileName,
                        wordCount: doc1.metadata.wordCount
                    },
                    document2: {
                        id: doc2.id,
                        fileName: doc2.fileName,
                        wordCount: doc2.metadata.wordCount
                    },
                    comparison,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            logger.error('Document comparison failed', error);
            res.status(500).json({
                success: false,
                error: 'Failed to compare documents'
            });
        }
    }

    /**
     * Generate summary with specific length
     * POST /api/ai/summarize
     * Body: { analysisId, length: 'short' | 'medium' | 'long' }
     */
    async generateSummary(req, res) {
        try {
            const { analysisId, length = 'medium' } = req.body;

            if (!analysisId) {
                return res.status(400).json({
                    success: false,
                    error: 'analysisId is required'
                });
            }

            const analysisResult = await fileService.loadAnalysis(analysisId);

            if (!analysisResult.success) {
                return res.status(404).json({
                    success: false,
                    error: 'Analysis not found'
                });
            }

            const lengthMap = {
                short: '1-2 sentences',
                medium: '1 paragraph (4-5 sentences)',
                long: '2-3 paragraphs'
            };

            const targetLength = lengthMap[length] || lengthMap.medium;

            logger.info('Generating summary', { analysisId, length });

            const summary = await groqService.generateFocusedSummary(
                analysisResult.data.documentText,
                `Create a ${targetLength} summary of the main points`
            );

            res.json({
                success: true,
                data: {
                    summary,
                    length,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            logger.error('Summary generation failed', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate summary'
            });
        }
    }

    /**
     * Extract specific information
     * POST /api/ai/extract
     * Body: { analysisId, extractionType: 'dates' | 'names' | 'numbers' | 'emails' }
     */
    async extractInformation(req, res) {
        try {
            const { analysisId, extractionType } = req.body;

            if (!analysisId || !extractionType) {
                return res.status(400).json({
                    success: false,
                    error: 'Both analysisId and extractionType are required'
                });
            }

            const analysisResult = await fileService.loadAnalysis(analysisId);

            if (!analysisResult.success) {
                return res.status(404).json({
                    success: false,
                    error: 'Analysis not found'
                });
            }

            const extractionPrompts = {
                dates: 'Extract all dates, deadlines, and time-related information',
                names: 'Extract all person names and their roles/positions mentioned',
                numbers: 'Extract all important numbers, statistics, and figures with their context',
                emails: 'Extract all email addresses and contact information'
            };

            const prompt = extractionPrompts[extractionType];

            if (!prompt) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid extractionType'
                });
            }

            logger.info('Extracting information', { analysisId, extractionType });

            const result = await groqService.generateFocusedSummary(
                analysisResult.data.documentText,
                prompt
            );

            res.json({
                success: true,
                data: {
                    extractionType,
                    result,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            logger.error('Information extraction failed', error);
            res.status(500).json({
                success: false,
                error: 'Failed to extract information'
            });
        }
    }
}

module.exports = new AIController();