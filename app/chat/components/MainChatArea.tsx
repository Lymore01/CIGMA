'use client';

import React, { useState } from 'react';
import ChatInterface from './ChatInterface';

const MainChatArea = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  const suggestedActions = [
    {
      icon: '🏛️',
      label: 'Government Services',
      description: 'KRA, NHIF, NSSF, Passport',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '📋',
      label: 'Legal Documents',
      description: 'Laws, regulations, policies',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: '🏥',
      label: 'Health Services',
      description: 'NHIF, hospitals, health info',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '💼',
      label: 'Business & Taxes',
      description: 'Business registration, KRA',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '🎓',
      label: 'Education',
      description: 'Schools, scholarships, exams',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: '🏠',
      label: 'Housing & Land',
      description: 'Land registration, housing',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const handleActionClick = (label: string) => {
    setInitialMessage(`Tell me about ${label.toLowerCase()}`);
    setIsChatOpen(true);
  };

  if (isChatOpen) {
    return (
      <ChatInterface
        key={crypto.randomUUID()}
        initialMessage={initialMessage}
        onNewChat={() => {
          setIsChatOpen(false);
          setInitialMessage('');
        }}
      />
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-xl p-3 sm:p-4 relative overflow-hidden min-h-[500px] flex flex-col border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">CIGMA</span>
            <p className="text-[10px] text-gray-600">Civic Assistant</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 overflow-hidden">
        {/* Welcome Message */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 text-center px-4">
          How can I help you today?
        </h2>

        {/* Search Input */}
        <div className="w-full max-w-2xl mb-3 sm:mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask about KRA, NHIF, passports, or any government service..."
              className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setInitialMessage(e.currentTarget.value);
                  setIsChatOpen(true);
                }
              }}
              onChange={(e) => {
                if (e.target.value.trim()) {
                  setInitialMessage(e.target.value);
                }
              }}
            />
            <button
              onClick={() => setIsChatOpen(true)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
              aria-label="Start chat"
            >
              <svg
                className="w-4 h-4 text-white"
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
            </button>
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="w-full max-w-4xl flex-1 flex flex-col min-h-0">
          <p className="text-xs font-semibold text-gray-700 mb-2 text-center">
            Popular Topics:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-2 px-2 sm:px-4 flex-1">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action.label)}
                className="group flex flex-col items-center justify-center gap-1 p-2 sm:p-2.5 bg-white rounded-lg hover:shadow-sm transition-all border border-gray-200 hover:border-blue-300 active:scale-95"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br ${action.color} rounded-lg flex items-center justify-center text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform`}
                >
                  {action.icon}
                </div>
                <div className="text-center w-full">
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-900 block truncate leading-tight">
                    {action.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChatArea;
