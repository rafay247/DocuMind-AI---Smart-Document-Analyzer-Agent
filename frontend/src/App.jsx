/**
* Main App Component
* Orchestrates all components and application state
*/

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import Header from './components/Header';
import FileUpload from './components/FileUpload';
import LoadingSpinner from './components/LoadingSpinner';
import AnalysisDisplay from './components/AnalysisDisplay';
import ChatInterface from './components/ChatInterface';
import HistoryPanel from './components/HistoryPanel';
import ApiService from './services/api';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentAnalysis, setCurrentAnalysis] = useState(null);
    const [processingStage, setProcessingStage] = useState('');
    const [emailNotification, setEmailNotification] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setCurrentAnalysis(null);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        // Validate email if notification is enabled
        if (emailNotification && (!emailAddress || !emailAddress.includes('@'))) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsProcessing(true);
        setUploadProgress(0);
        setProcessingStage('Uploading document...');

        try {
            // Analyze document
            const response = await ApiService.analyzeDocument(
                selectedFile,
                emailAddress,
                emailNotification,
                (progress) => {
                    setUploadProgress(progress);
                    if (progress === 100) {
                        setProcessingStage('Analyzing with AI...');
                    }
                }
            );

            if (response.success) {
                setProcessingStage('Analysis complete!');
                setCurrentAnalysis(response.data);
                toast.success('Document analyzed successfully!');

                if (emailNotification) {
                    toast.info('Analysis sent to your email!');
                }

                // Clear form
                setSelectedFile(null);
                setEmailAddress('');
                setEmailNotification(false);
            } else {
                toast.error(response.error || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error(error.response?.data?.error || 'Failed to analyze document');
        } finally {
            setIsProcessing(false);
            setUploadProgress(0);
            setProcessingStage('');
        }
    };

    const handleSelectFromHistory = (analysis) => {
        setCurrentAnalysis(analysis);
        setShowHistory(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNewAnalysis = () => {
        setCurrentAnalysis(null);
        setSelectedFile(null);
    };

    return (
        <div className="app-container">
            <Header />

            <main className="main-content">
                {!currentAnalysis ? (
                    // Upload Section
                    <div className="upload-section glass-card">
                        <div className="section-title">
                            <h2>Upload Document for Analysis</h2>
                            <p className="section-subtitle">
                                Get AI-powered insights, summaries, and answers from your documents with our intelligent analyzer.
                            </p>
                        </div>

                        <FileUpload
                            onFileSelect={handleFileSelect}
                            isProcessing={isProcessing}
                        />

                        {selectedFile && !isProcessing && (
                            <div className="options-container">
                                {/* Email Notification Option */}
                                <div className="email-option">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={emailNotification}
                                            onChange={(e) => setEmailNotification(e.target.checked)}
                                        />
                                        <span>Send analysis to my email</span>
                                    </label>

                                    {emailNotification && (
                                        <input
                                            type="email"
                                            className="email-input-inline animate-fade-in"
                                            placeholder="Enter your email address"
                                            value={emailAddress}
                                            onChange={(e) => setEmailAddress(e.target.value)}
                                        />
                                    )}
                                </div>

                                {/* Analyze Button */}
                                <button
                                    className="btn-analyze animate-pulse"
                                    onClick={handleAnalyze}
                                    disabled={isProcessing}
                                >
                                    Analyze Document
                                </button>
                            </div>
                        )}

                        {isProcessing && (
                            <LoadingSpinner
                                message={processingStage}
                                progress={uploadProgress}
                            />
                        )}
                    </div>
                ) : (
                    // Results Section
                    <div className="results-section">
                        <div className="results-header animate-fade-in">
                            <button
                                className="btn-secondary"
                                onClick={handleNewAnalysis}
                            >
                                ← New Analysis
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowHistory(!showHistory)}
                            >
                                {showHistory ? 'Hide History' : 'Show History'}
                            </button>
                        </div>

                        <div className={`results-layout ${!showHistory ? 'no-sidebar' : ''}`}>
                            {showHistory && (
                                <aside className="history-sidebar glass-card animate-fade-in">
                                    <HistoryPanel
                                        onSelectAnalysis={handleSelectFromHistory}
                                        currentAnalysisId={currentAnalysis.id}
                                    />
                                </aside>
                            )}

                            <div className="results-main">
                                <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
                                    <AnalysisDisplay analysis={currentAnalysis} />
                                </div>

                                <div className="chat-section glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                    <ChatInterface
                                        analysisId={currentAnalysis.id}
                                        fileName={currentAnalysis.fileName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Section (shown when no analysis) */}
                {!currentAnalysis && !isProcessing && (
                    <div className="features-section">
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">📊</div>
                                <h4>Smart Analysis</h4>
                                <p>Extract key insights, summaries, and action items automatically from any document.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">💬</div>
                                <h4>Interactive Q&A</h4>
                                <p>Ask questions and get instant, context-aware answers about your document's content.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">📧</div>
                                <h4>Email Reports</h4>
                                <p>Receive beautifully formatted analysis reports directly to your email inbox.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">🎯</div>
                                <h4>Entity Recognition</h4>
                                <p>Automatically identify and extract important names, dates, locations, and organizations.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">😊</div>
                                <h4>Sentiment Analysis</h4>
                                <p>Understand the overall tone and emotional sentiment of the document text.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">📝</div>
                                <h4>Multiple Formats</h4>
                                <p>Support for PDF, DOCX, and TXT files up to 10MB with fast processing.</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="app-footer">
                <p>
                    Powered by <strong>Groq AI</strong> with Llama 3.3 •
                    Built with React & Node.js
                </p>
            </footer>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default App;