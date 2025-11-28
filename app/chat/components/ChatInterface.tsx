'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatInterfaceProps {
  initialMessage?: string;
  onNewChat?: () => void;
}

interface Message {
  id: number | string;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
  isLoading?: boolean;
  sources?: string[];
}

const ChatInterface = ({
  initialMessage = '',
  onNewChat,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const initialMessages: Message[] = [
      {
        id: 1,
        text: "Habari! I'm CIGMA, your civic assistant. I can help you understand government services, policies, and processes. What would you like to know?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ];
    if (initialMessage) {
      initialMessages.push(
        {
          id: 2,
          text: initialMessage,
          sender: 'user',
          timestamp: new Date(),
        },
        {
          id: 3,
          text: '',
          sender: 'bot',
          isLoading: true,
          timestamp: new Date(),
        }
      );
    }
    return initialMessages;
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessageId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        text: messageText,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);

    setInputValue('');
    setIsLoading(true);

    // Add loading message
    const loadingMessageId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        text: '',
        sender: 'bot',
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    try {
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Remove loading message and add response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
        return [
          ...filtered,
          {
            id: Date.now(),
            text: "Thank you for your question! I'm processing your request and will provide you with accurate, document-verified information. How else can I assist you today?",
            sender: 'bot',
            timestamp: new Date(),
            sources: ['Kenya Constitution', 'Government Services Guide'],
          },
        ];
      });
    } catch {
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
        return [
          ...filtered,
          {
            id: Date.now(),
            text: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
            sender: 'bot',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-xl flex flex-col min-h-[500px] h-full border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              CIGMA Assistant
            </h3>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online & Ready
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/80 transition-all text-sm font-medium text-gray-700 hover:text-gray-900 active:scale-95"
            title="Start a new chat"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      Thinking...
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap wrap-break-word">
                      {message.text}
                    </p>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          Sources:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              {message.timestamp && (
                <span
                  className={`text-xs text-gray-500 mt-1 px-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  {formatTime(message.timestamp)}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <button
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95 shrink-0"
            title="Attach file"
            aria-label="Attach file"
          >
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
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              placeholder="Ask about government services, policies, or civic processes..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
              className="w-full px-4 py-3 text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none min-h-[48px] max-h-32 overflow-y-auto"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center hover:shadow-lg transition-all active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            title="Send message"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          All answers are verified with source documents
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
