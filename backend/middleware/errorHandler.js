/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Multer errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File size exceeds 10MB limit'
            });
        }
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }

    // Custom errors
    if (err.message) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }

    // Default error
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
};

module.exports = errorHandler;