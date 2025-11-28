'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const chatHistory = [
    { id: 1, title: 'Lost my KRA PIN', time: '2 hours ago' },
    { id: 2, title: 'How to get my KRA PIN', time: 'Yesterday' },
    { id: 3, title: 'How to get my passport', time: '2 days ago' },
    { id: 4, title: 'NHIF card not working', time: '3 days ago' },
    { id: 5, title: 'Business registration process', time: '1 week ago' },
  ];

  const filteredHistory = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    router.push('/chat');
  };

  const navItems = [
    {
      icon: (
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      label: 'New Chat',
      href: '/chat',
      action: handleNewChat,
    },
    {
      icon: (
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      label: 'Library',
      href: '/library',
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`w-full lg:w-64 bg-white rounded-2xl shadow-xl h-full lg:h-full flex flex-col border border-gray-100 fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 block">CIGMA</span>
              <span className="text-xs text-gray-600">Civic Assistant</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
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
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 sm:p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Component = item.action ? 'button' : Link;
            const props = item.action
              ? { onClick: item.action }
              : { href: item.href };

            return (
              <Component
                key={item.label}
                {...props}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                } active:scale-95`}
              >
                <div
                  className={`${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 group-hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </Component>
            );
          })}
        </nav>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden flex flex-col px-4 sm:px-6 pb-4">
          <div className="mb-4">
            <span className="text-sm font-semibold text-gray-800">Recent Chats</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No chats found</p>
              </div>
            ) : (
              filteredHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full flex flex-col gap-1 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0"
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
                    <span className="text-xs text-gray-700 group-hover:text-gray-900 truncate flex-1 font-medium">
                      {chat.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 pl-6">{chat.time}</span>
                </button>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
