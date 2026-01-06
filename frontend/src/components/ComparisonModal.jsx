/**
 * Comparison Modal Component
 * Modal for comparing two documents
 */

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ApiService from '../services/api';
import AIApiService from '../services/aiApi';

const ComparisonModal = ({ isOpen, onClose, currentAnalysisId }) => {
    const [analyses, setAnalyses] = useState([]);
    const [selectedAnalysisId, setSelectedAnalysisId] = useState('');
    const [comparisonResult, setComparisonResult] = useState(null);
    const [isComparing, setIsComparing] = useState(false);

    useEffect(() => {
        const loadAnalyses = async () => {
            try {
                const response = await ApiService.getAllAnalyses();
                if (response.success) {
                    // Filter out current analysis
                    const filtered = response.data.filter(a => a.id !== currentAnalysisId);
                    setAnalyses(filtered);
                }
            } catch (error) {
                toast.error('Failed to load analyses');
            }
        };

        if (isOpen) {
            loadAnalyses();
        }
    }, [isOpen, currentAnalysisId]);

    const handleCompare = async () => {
        if (!selectedAnalysisId) {
            toast.error('Please select a document to compare');
            return;
        }

        setIsComparing(true);
        try {
            const response = await AIApiService.compareDocuments(
                currentAnalysisId,
                selectedAnalysisId
            );
            setComparisonResult(response.data);
            toast.success('Comparison complete!');
        } catch (error) {
            toast.error('Failed to compare documents');
            console.error(error);
        } finally {
            setIsComparing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Compare Documents</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    {!comparisonResult ? (
                        <>
                            <p className="modal-description">
                                Select another document to compare with the current one:
                            </p>

                            <select
                                className="comparison-select"
                                value={selectedAnalysisId}
                                onChange={(e) => setSelectedAnalysisId(e.target.value)}
                            >
                                <option value="">-- Select a document --</option>
                                {analyses.map((analysis) => (
                                    <option key={analysis.id} value={analysis.id}>
                                        {analysis.fileName} ({analysis.metadata.wordCount} words)
                                    </option>
                                ))}
                            </select>

                            <button
                                className="btn-compare"
                                onClick={handleCompare}
                                disabled={isComparing || !selectedAnalysisId}
                            >
                                {isComparing ? (
                                    <>
                                        <FaSpinner className="spinner" /> Comparing...
                                    </>
                                ) : (
                                    'Compare Documents'
                                )}
                            </button>
                        </>
                    ) : (
                        <div className="comparison-result">
                            <div className="comparison-docs">
                                <div className="comparison-doc">
                                    <h4>Document 1</h4>
                                    <p>{comparisonResult.document1.fileName}</p>
                                    <span>{comparisonResult.document1.wordCount} words</span>
                                </div>
                                <div className="comparison-vs">vs</div>
                                <div className="comparison-doc">
                                    <h4>Document 2</h4>
                                    <p>{comparisonResult.document2.fileName}</p>
                                    <span>{comparisonResult.document2.wordCount} words</span>
                                </div>
                            </div>

                            <div className="comparison-analysis">
                                <h3>Comparison Analysis</h3>
                                <div className="comparison-text">
                                    {comparisonResult.comparison}
                                </div>
                            </div>

                            <button
                                className="btn-secondary"
                                onClick={() => setComparisonResult(null)}
                            >
                                Compare Another
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonModal;