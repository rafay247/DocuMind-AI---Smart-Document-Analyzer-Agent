/**
 * File Service
 * Handles file processing, text extraction, and storage
 */

const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const ANALYSIS_DIR = path.join(__dirname, '../data/analyses');

class FileService {
    constructor() {
        this.initializeStorage();
    }

    /**
     * Initialize storage directory
     */
    async initializeStorage() {
        try {
            await fs.mkdir(ANALYSIS_DIR, { recursive: true });
        } catch (error) {
            console.error('Failed to initialize storage:', error);
        }
    }

    /**
     * Extract text from uploaded file
     * @param {Object} file - Multer file object
     */
    async extractText(file) {
        try {
            const filePath = file.path;
            const fileExt = path.extname(file.originalname).toLowerCase();
            let text = '';
            let metadata = {
                fileSize: file.size,
                fileType: fileExt,
                pageCount: 0
            };

            if (fileExt === '.pdf') {
                const dataBuffer = await fs.readFile(filePath);
                const data = await pdf(dataBuffer);
                text = data.text;
                metadata.pageCount = data.numpages;
                metadata.info = data.info;
            } else if (fileExt === '.docx') {
                const result = await mammoth.extractRawText({ path: filePath });
                text = result.value;
                if (result.messages.length > 0) {
                    console.warn('Mammoth messages:', result.messages);
                }
            } else if (fileExt === '.txt') {
                text = await fs.readFile(filePath, 'utf8');
            } else {
                return {
                    success: false,
                    error: 'Unsupported file format'
                };
            }

            // word count
            metadata.wordCount = text.split(/\s+/).length;

            return {
                success: true,
                text,
                metadata
            };

        } catch (error) {
            console.error('Text extraction error:', error);
            return {
                success: false,
                error: `Failed to extract text: ${error.message}`
            };
        }
    }

    /**
     * Delete file from filesystem
     * @param {string} filePath 
     */
    async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.warn(`Failed to delete file ${filePath}:`, error.message);
        }
    }

    /**
     * Save analysis result to disk
     * @param {string} id 
     * @param {Object} data 
     */
    async saveAnalysis(id, data) {
        try {
            const filePath = path.join(ANALYSIS_DIR, `${id}.json`);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Save analysis error:', error);
            throw new Error('Failed to save analysis');
        }
    }

    /**
     * Load analysis from disk
     * @param {string} id 
     */
    async loadAnalysis(id) {
        try {
            const filePath = path.join(ANALYSIS_DIR, `${id}.json`);
            const data = await fs.readFile(filePath, 'utf8');
            return {
                success: true,
                data: JSON.parse(data)
            };
        } catch (error) {
            return {
                success: false,
                error: 'Analysis not found'
            };
        }
    }

    /**
     * Get all analyses
     */
    async getAllAnalyses() {
        try {
            const files = await fs.readdir(ANALYSIS_DIR);
            const analyses = [];

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const content = await fs.readFile(path.join(ANALYSIS_DIR, file), 'utf8');
                    try {
                        const data = JSON.parse(content);
                        // Exclude large text content for list view
                        const { documentText, ...summary } = data;
                        analyses.push(summary);
                    } catch (e) {
                        console.warn(`Skipping invalid analysis file: ${file}`);
                    }
                }
            }

            return {
                success: true,
                analyses
            };
        } catch (error) {
            console.error('Get all analyses error:', error);
            return {
                success: false,
                error: 'Failed to retrieve analyses'
            };
        }
    }
}

module.exports = new FileService();
