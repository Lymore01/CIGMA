"use client";

import React from "react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-50 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CIGMA
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/chat"
              className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-white/50"
            >
              Chat
            </Link>
            <Link
              href="/library"
              className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-white/50"
            >
              Library
            </Link>
            <Link
              href="/chat"
              className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-block mb-6 animate-scale-in">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm">
              Civic Intelligence & Governance Model Assistant
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            Making Government Information
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Accessible to Every Kenyan
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Get accurate, document-verified answers about public services, policies, and civic processes.
            Powered by AI and real Kenyan datasets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link
              href="/chat"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-base sm:text-lg"
            >
              Start Chatting
            </Link>
            <Link
              href="/library"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:shadow-lg transition-all border-2 border-gray-200 hover:border-blue-300 active:scale-95 text-base sm:text-lg"
            >
              Browse Library
            </Link>
          </div>
        </div>

        {/* Animated Orb Mascot */}
        <div className="flex justify-center mt-16 mb-12 animate-scale-in">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse shadow-2xl"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full"></div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <div className="absolute top-12 right-12 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
            </div>
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-blue-200 rounded-full"></div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-indigo-300 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CIGMA?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform designed to bridge the gap between citizens and government information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in cursor-pointer active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Chat</h3>
            <p className="text-gray-600">
              Get instant, accurate answers to your civic questions with our intelligent chat assistant
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in cursor-pointer active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">RAG Verification</h3>
            <p className="text-gray-600">
              Every answer is backed by source citations from verified government documents and datasets
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in cursor-pointer active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-white"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Document Library</h3>
            <p className="text-gray-600">
              Upload and manage PDFs, Word documents, and text files. Build your own knowledge base
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in cursor-pointer active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-white"
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
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Vector Search</h3>
            <p className="text-gray-600">
              Advanced semantic search across all documents for precise, context-aware results
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in cursor-pointer active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kenyan Datasets</h3>
            <p className="text-gray-600">
              Access real Kenyan laws, service guides, county documents, and official resources
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in cursor-pointer active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">
              Get instant responses with a clean, intuitive interface designed for speed and clarity
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of Kenyans who are making civic knowledge accessible and understandable
          </p>
          <Link
            href="/chat"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-lg"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CIGMA
            </span>
          </div>
          <p className="text-sm text-gray-600">
            © 2024 CIGMA. Making civic knowledge accessible to every Kenyan.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
