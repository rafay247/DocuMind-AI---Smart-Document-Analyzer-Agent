/**
 * File Upload Middleware
 * Configures multer for handling file uploads
 */

const multer = require('multer');
const path = require('path');
const config = require('../config/config');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Upload directory
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter - only allow specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = config.ALLOWED_FILE_TYPES;

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: PDF, TXT, DOCX`), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.MAX_FILE_SIZE // 10MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;