/**
 * History Panel Component
 * Shows list of previously analyzed documents
 */

import React, { useState, useEffect } from 'react';
import { FaHistory, FaFileAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

const HistoryPanel = ({ onSelectAnalysis, currentAnalysisId }) => {
    const [analyses, setAnalyses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalyses();
    }, []);

    const loadAnalyses = async () => {
        try {
            const response = await ApiService.getAllAnalyses();
            if (response.success) {
                setAnalyses(response.data);
            }
        } catch (error) {
            console.error('Failed to load analyses:', error);
            toast.error('Failed to load history');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    const truncateFileName = (name, maxLength = 30) => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength - 3) + '...';
    };

    if (isLoading) {
        return (
            <div className="history-panel">
                <div className="history-header">
                    <FaHistory className="history-icon" />
                    <h3>Analysis History</h3>
                </div>
                <div className="loading-state">
                    <p>Loading history...</p>
                </div>
            </div>
        );
    }

    if (analyses.length === 0) {
        return (
            <div className="history-panel">
                <div className="history-header">
                    <FaHistory className="history-icon" />
                    <h3>Analysis History</h3>
                </div>
                <div className="empty-state">
                    <FaFileAlt className="empty-icon" />
                    <p>No analyses yet</p>
                    <span className="empty-hint">Upload a document to get started</span>
                </div>
            </div>
        );
    }

    return (
        <div className="history-panel">
            <div className="history-header">
                <FaHistory className="history-icon" />
                <h3>Analysis History</h3>
                <span className="history-count">{analyses.length}</span>
            </div>

            <div className="history-list">
                {analyses.map((analysis) => (
                    <div
                        key={analysis.id}
                        className={`history-item ${analysis.id === currentAnalysisId ? 'active' : ''}`}
                        onClick={() => onSelectAnalysis(analysis)}
                    >
                        <div className="history-item-icon">
                            <FaFileAlt />
                        </div>
                        <div className="history-item-content">
                            <p className="history-item-name" title={analysis.fileName}>
                                {truncateFileName(analysis.fileName)}
                            </p>
                            <div className="history-item-meta">
                                <FaClock className="meta-icon" />
                                <span className="meta-text">{formatDate(analysis.uploadedAt)}</span>
                            </div>
                            <div className="history-item-stats">
                                <span className="stat">{analysis.metadata.wordCount} words</span>
                                <span className="stat-separator">•</span>
                                <span className="stat">{analysis.metadata.readingTime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPanel;