/**
 * Loading Spinner Component
 * Shows loading state with progress
 */

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ message = 'Processing...', progress = null }) => {
    return (
        <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <p className="loading-message">{message}</p>
            {progress !== null && (
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="progress-text">{progress}%</span>
                </div>
            )}
        </div>
    );
};

export default LoadingSpinner;