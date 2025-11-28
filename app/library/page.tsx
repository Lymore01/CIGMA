'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: string;
  service?: string;
  created_at?: string;
  status?: 'processing' | 'ready' | 'error';
}

const LibraryPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(
    new Map()
  );
  const [serviceName, setServiceName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/documents');
      if (response.ok) {
        const result = await response.json();
        const docs = (result.data || []).map(
          (doc: {
            id: string;
            file_name: string;
            file_path: string;
            file_type: string;
            file_size: string;
            service?: string;
            created_at?: string;
          }) => ({
            ...doc,
            status: 'ready' as const,
          })
        );
        setDocuments(docs);
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file selection (store files, don't upload yet)
  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate file types
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.text'];
    const invalidFiles = fileArray.filter((file) => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !allowedExtensions.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      setUploadError(
        `Some files are not supported. Please upload PDF, Word, or Text files only.`
      );
      return;
    }

    // Validate file sizes
    const largeFiles = fileArray.filter((file) => file.size > 10 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setUploadError(
        `Some files are too large. Maximum size is 10MB per file.`
      );
      return;
    }

    setSelectedFiles((prev) => [...prev, ...fileArray]);
    setUploadError(null);
  };

  // Handle file upload (triggered by submit button)
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select files to upload.');
      return;
    }

    // Validate service name is provided
    if (!serviceName || serviceName.trim() === '') {
      setUploadError('Please provide a service name before uploading files.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const tempId = `temp-${Date.now()}-${index}`;
        const tempDoc: Document = {
          id: tempId,
          file_name: file.name,
          file_path: '',
          file_type: file.type || fileExtension,
          file_size: file.size.toString(),
          status: 'processing',
        };

        setDocuments((prev) => [tempDoc, ...prev]);

        // Track upload progress
        const progressInterval = setInterval(() => {
          setUploadingFiles((prev) => {
            const newMap = new Map(prev);
            const current = newMap.get(tempId) || 0;
            if (current < 90) {
              newMap.set(tempId, current + 10);
            }
            return newMap;
          });
        }, 200);

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('service', serviceName.trim()); // Service is required

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          clearInterval(progressInterval);
          setUploadingFiles((prev) => {
            const newMap = new Map(prev);
            newMap.set(tempId, 100);
            return newMap;
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              // Replace temp doc with real doc from API
              setDocuments((prev) =>
                prev.map((doc) =>
                  doc.id === tempId
                    ? { ...result.data, status: 'ready' as const }
                    : doc
                )
              );
              // Refresh documents list
              setTimeout(() => fetchDocuments(), 500);
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage =
              errorData.error?.message ||
              errorData.error ||
              `Upload failed (${response.status})`;
            throw new Error(errorMessage);
          }
        } catch (error: unknown) {
          clearInterval(progressInterval);
          setUploadingFiles((prev) => {
            const newMap = new Map(prev);
            newMap.delete(tempId);
            return newMap;
          });
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === tempId ? { ...doc, status: 'error' as const } : doc
            )
          );
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to upload file';
          setUploadError(errorMessage);
        }
      });

      await Promise.all(uploadPromises);

      // Clear state after successful upload
      setSelectedFiles([]);
      setServiceName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadingFiles(new Map());
      setTimeout(() => setUploadError(null), 5000);
    }
  };

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileSelection(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Format file size
  const formatFileSize = (size: string | number): string => {
    const bytes = typeof size === 'string' ? parseInt(size) : size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  // Get file icon and color
  const getFileInfo = (type: string) => {
    if (type.includes('pdf') || type === '.pdf') {
      return {
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
          </svg>
        ),
        color: 'text-red-500 bg-red-50',
        label: 'PDF',
      };
    } else if (
      type.includes('word') ||
      type.includes('doc') ||
      type === '.doc' ||
      type === '.docx'
    ) {
      return {
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
          </svg>
        ),
        color: 'text-blue-500 bg-blue-50',
        label: 'Word',
      };
    } else if (type.includes('text') || type === '.txt' || type === '.text') {
      return {
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
        color: 'text-gray-500 bg-gray-50',
        label: 'Text',
      };
    }
    return {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'text-gray-400 bg-gray-50',
      label: 'File',
    };
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CIGMA
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
              >
                Home
              </Link>
              <Link
                href="/chat"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Chat
              </Link>
              <Link
                href="/chat"
                className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Document Library
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Upload and manage your documents. Supported formats: PDF, Word
            (.doc, .docx), and Text (.txt) files
          </p>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <svg
              className="w-5 h-5 text-red-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700 flex-1">{uploadError}</p>
            <button
              onClick={() => setUploadError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Upload Section with Service Name */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Documents
          </h2>

          {/* Service Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., KRA, NHIF, Passport Services, etc."
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Required: Categorize your documents by service type for better
              organization
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl transition-all ${
              !serviceName || serviceName.trim() === ''
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                : dragActive
                  ? 'border-blue-500 bg-blue-50 scale-[1.01] cursor-pointer'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 cursor-pointer'
            } ${isUploading ? 'pointer-events-none opacity-75' : ''}`}
            onDrop={
              !serviceName || serviceName.trim() === '' ? undefined : handleDrop
            }
            onDragOver={
              !serviceName || serviceName.trim() === ''
                ? undefined
                : handleDragOver
            }
            onDragLeave={
              !serviceName || serviceName.trim() === ''
                ? undefined
                : handleDragLeave
            }
            onClick={() => {
              if (!isUploading && serviceName && serviceName.trim() !== '') {
                fileInputRef.current?.click();
              } else if (!serviceName || serviceName.trim() === '') {
                setUploadError(
                  'Please provide a service name before uploading files.'
                );
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.text"
              onChange={(e) => handleFileSelection(e.target.files)}
              className="hidden"
              disabled={isUploading}
            />
            <div className="p-6 sm:p-8 text-center">
              <div
                className={`w-16 h-16 mx-auto mb-3 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center transition-transform ${
                  dragActive ? 'scale-110' : ''
                }`}
              >
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {!serviceName || serviceName.trim() === ''
                  ? 'Enter service name above to upload'
                  : dragActive
                    ? 'Drop files here'
                    : selectedFiles.length > 0
                      ? `${selectedFiles.length} file(s) selected`
                      : 'Drop files here or click to upload'}
              </h3>
              <p className="text-sm text-gray-600">
                {!serviceName || serviceName.trim() === ''
                  ? 'Service name is required to upload documents'
                  : 'Supports PDF, Word (.doc, .docx), and Text (.txt) files up to 10MB'}
              </p>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Selected Files ({selectedFiles.length}):
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <svg
                        className="w-4 h-4 text-gray-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 shrink-0">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      disabled={isUploading}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {selectedFiles.length > 0 &&
            serviceName &&
            serviceName.trim() !== '' && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Upload {selectedFiles.length} File(s)</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedFiles([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  disabled={isUploading}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            )}
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-500 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Your Documents ({filteredDocuments.length})
            </h2>
            {documents.length > 0 && (
              <button
                onClick={fetchDocuments}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-base mb-1">
                {documents.length === 0
                  ? 'No documents yet'
                  : 'No documents match your search'}
              </p>
              <p className="text-gray-500 text-sm">
                {documents.length === 0
                  ? 'Upload your first document to get started!'
                  : 'Try a different search term'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredDocuments.map((doc) => {
                const fileInfo = getFileInfo(doc.file_type);
                const progress = uploadingFiles.get(doc.id);
                const isProcessing =
                  doc.status === 'processing' || progress !== undefined;

                return (
                  <div
                    key={doc.id}
                    className="group border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`shrink-0  w-10 h-10 sm:w-12 sm:h-12 ${fileInfo.color} rounded-lg flex items-center justify-center`}
                      >
                        {fileInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                          {doc.file_name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                            {fileInfo.label}
                          </span>
                          {doc.service && (
                            <>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                                {doc.service}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.created_at)}</span>
                        </div>
                        {isProcessing && (
                          <div className="mb-2">
                            <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: `${progress || 50}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {isProcessing && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                              {progress
                                ? `Uploading ${progress}%`
                                : 'Processing...'}
                            </span>
                          )}
                          {doc.status === 'ready' && !isProcessing && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Ready
                            </span>
                          )}
                          {doc.status === 'error' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Error
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
