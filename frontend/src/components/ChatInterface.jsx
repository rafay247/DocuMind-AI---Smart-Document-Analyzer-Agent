/**
 * Chat Interface Component
 * Interactive Q&A with the analyzed document
 */

import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

const ChatInterface = ({ analysisId, fileName }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Add welcome message
        setMessages([
            {
                role: 'assistant',
                content: `Hi! I've analyzed "${fileName}". Ask me anything about the document!`,
                timestamp: new Date().toISOString()
            }
        ]);
    }, [fileName]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message to chat
        const newUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // Prepare conversation history (last 5 exchanges)
            const conversationHistory = messages
                .slice(-10)
                .map(msg => ({
                    question: msg.role === 'user' ? msg.content : null,
                    answer: msg.role === 'assistant' ? msg.content : null
                }))
                .filter(item => item.question || item.answer);

            // Get answer from API
            const response = await ApiService.askQuestion(
                analysisId,
                userMessage,
                conversationHistory
            );

            // Add assistant response to chat
            const assistantMessage = {
                role: 'assistant',
                content: response.data.answer,
                timestamp: response.data.timestamp
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Question error:', error);
            toast.error('Failed to get answer');

            // Add error message
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date().toISOString(),
                    isError: true
                }
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const suggestedQuestions = [
        'What are the main topics discussed?',
        'Summarize the key findings',
        'What are the action items?',
        'Who are the key people mentioned?'
    ];

    const handleSuggestedQuestion = (question) => {
        setInputMessage(question);
        inputRef.current?.focus();
    };

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <FaRobot className="chat-icon" />
                <div>
                    <h3>Ask Questions About Your Document</h3>
                    <p className="chat-subtitle">Interactive Q&A powered by AI</p>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.role} ${message.isError ? 'error' : ''}`}
                    >
                        <div className="message-icon">
                            {message.role === 'user' ? <FaUser /> : <FaRobot />}
                        </div>
                        <div className="message-content">
                            <p className="message-text">{message.content}</p>
                            <span className="message-time">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message assistant loading">
                        <div className="message-icon">
                            <FaRobot />
                        </div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
                <div className="suggested-questions">
                    <p className="suggested-label">Suggested questions:</p>
                    <div className="suggestions-grid">
                        {suggestedQuestions.map((question, index) => (
                            <button
                                key={index}
                                className="suggestion-button"
                                onClick={() => handleSuggestedQuestion(question)}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="chat-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    placeholder="Ask a question about the document..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                />
                <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                >
                    {isLoading ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;