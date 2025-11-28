"use client";

import React, { useState } from "react";
import ChatInterface from "./ChatInterface";

const MainChatArea = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  const suggestedActions = [
    { icon: "💰", label: "Finance & Budget" },
    { icon: "💳", label: "Payment" },
    { icon: "📊", label: "Track your expense" },
    { icon: "👤", label: "Account" },
  ];

  const handleActionClick = (label: string) => {
    setInitialMessage(label);
    setIsChatOpen(true);
  };

  if (isChatOpen) {
    return (
      <ChatInterface
        key={crypto.randomUUID()}
        initialMessage={initialMessage}
        onNewChat={() => {
          setIsChatOpen(false);
          setInitialMessage("");
        }}
      />
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 relative overflow-hidden min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-lg font-bold text-gray-800">CIGMA</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Share</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 min-h-[300px] sm:min-h-[400px]">
        <div className="relative mb-8">
          <div className="w-32 h-32 relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-purple-500 rounded-full"></div>
            <div className="absolute inset-2 bg-linear-to-br from-blue-300 to-purple-400 rounded-full"></div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
            <div className="absolute top-6 right-6 w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-blue-200 rounded-full"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-purple-300 rounded-full"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full"></div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-8 sm:mb-12 text-center px-4">
          How can I help you today?
        </h2>

        <div className="w-full max-w-2xl mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Chat here.."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 text-gray-800 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
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
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-2xl px-4">
          {suggestedActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action.label)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainChatArea;
