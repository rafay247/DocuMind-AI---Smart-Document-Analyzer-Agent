/**
 * File Upload Component
 * Drag-and-drop file upload with progress tracking
 */

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaFilePdf, FaFileAlt, FaFileWord } from 'react-icons/fa';

const FileUpload = ({ onFileSelect, isProcessing }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
        maxSize: 10485760, // 10MB
        disabled: isProcessing
    });

    const getFileIcon = (fileName) => {
        if (!fileName) return <FaFileUpload />;

        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FaFilePdf className="file-icon pdf" />;
            case 'txt':
                return <FaFileAlt className="file-icon txt" />;
            case 'docx':
                return <FaFileWord className="file-icon docx" />;
            default:
                return <FaFileUpload />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="file-upload-container">
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''} ${isProcessing ? 'disabled' : ''}`}
            >
                <input {...getInputProps()} />

                {selectedFile ? (
                    <div className="file-selected">
                        {getFileIcon(selectedFile.name)}
                        <div className="file-info">
                            <p className="file-name">{selectedFile.name}</p>
                            <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                        </div>
                    </div>
                ) : (
                    <div className="dropzone-content">
                        <FaFileUpload className="upload-icon" />
                        <p className="dropzone-text">
                            {isDragActive ? (
                                'Drop the file here'
                            ) : (
                                <>
                                    Drag & drop a document here, or <span className="click-text">click to browse</span>
                                </>
                            )}
                        </p>
                        <p className="dropzone-hint">
                            Supported: PDF, TXT, DOCX (Max 10MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;