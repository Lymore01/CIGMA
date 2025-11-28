"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: "processing" | "ready" | "error";
}

const LibraryPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter documents based on search query
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        const allowedExtensions = [".pdf", ".doc", ".docx", ".txt", ".text"];
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          setUploadError(`File "${file.name}" is not supported. Please upload PDF, Word, or Text files.`);
          continue;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          setUploadError(`File "${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Create a temporary document entry
        const tempDoc: Document = {
          id: `temp-${Date.now()}-${i}`,
          name: file.name,
          type: file.type || fileExtension,
          size: file.size,
          uploadDate: new Date(),
          status: "processing",
        };

        setDocuments((prev) => [tempDoc, ...prev]);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          clearInterval(progressInterval);
          setUploadProgress(100);

          if (response.ok) {
            const result = await response.json();
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === tempDoc.id
                  ? { ...doc, id: result.id || doc.id, status: "ready" as const }
                  : doc
              )
            );
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Upload failed");
          }
        } catch (error: any) {
          clearInterval(progressInterval);
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === tempDoc.id ? { ...doc, status: "error" as const } : doc
            )
          );
          setUploadError(error?.message || "Failed to upload file");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setTimeout(() => setUploadError(null), 5000);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
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
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Get file icon and color
  const getFileInfo = (type: string) => {
    if (type.includes("pdf") || type === ".pdf") {
      return {
        icon: (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
          </svg>
        ),
        color: "text-red-500 bg-red-50",
        label: "PDF",
      };
    } else if (type.includes("word") || type.includes("doc") || type === ".doc" || type === ".docx") {
      return {
        icon: (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
          </svg>
        ),
        color: "text-blue-500 bg-blue-50",
        label: "Word",
      };
    } else if (type.includes("text") || type === ".txt" || type === ".text") {
      return {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: "text-gray-500 bg-gray-50",
        label: "Text",
      };
    }
    return {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-gray-400 bg-gray-50",
      label: "File",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Document Library
          </h1>
          <p className="text-lg text-gray-600">
            Upload and manage your documents. Supported formats: PDF, Word (.doc, .docx), and Text (.txt) files
          </p>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 flex-1">{uploadError}</p>
            <button
              onClick={() => setUploadError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
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
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`mb-8 bg-white rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            dragActive
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          } ${isUploading ? "pointer-events-none opacity-75" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.text"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            disabled={isUploading}
          />
          <div className="p-8 sm:p-12 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center transition-transform ${dragActive ? "scale-110" : ""}`}>
              <svg
                className="w-10 h-10 text-blue-500"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {dragActive ? "Drop files here" : "Drop files here or click to upload"}
            </h3>
            <p className="text-gray-600 mb-4">
              Supports PDF, Word (.doc, .docx), and Text (.txt) files up to 10MB
            </p>
            {isUploading && (
              <div className="w-full max-w-xs mx-auto mt-4">
                <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Your Documents ({filteredDocuments.length})
            </h2>
            {documents.length > 0 && (
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            )}
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
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
              <p className="text-gray-600 text-lg mb-2">
                {documents.length === 0
                  ? "No documents yet"
                  : "No documents match your search"}
              </p>
              <p className="text-gray-500 text-sm">
                {documents.length === 0
                  ? "Upload your first document to get started!"
                  : "Try a different search term"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => {
                const fileInfo = getFileInfo(doc.type);
                return (
                  <div
                    key={doc.id}
                    className="group border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-12 h-12 ${fileInfo.color} rounded-lg flex items-center justify-center`}>
                        {fileInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                            {fileInfo.label}
                          </span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{doc.uploadDate.toLocaleDateString("en-KE")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === "processing" && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                              Processing...
                            </span>
                          )}
                          {doc.status === "ready" && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Ready
                            </span>
                          )}
                          {doc.status === "error" && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
