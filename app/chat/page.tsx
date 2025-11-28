import React from 'react';
import Sidebar from './components/Sidebar';
import MainChatArea from './components/MainChatArea';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 lg:py-6 h-screen flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-6">
        <Sidebar />
        <MainChatArea />
      </div>
    </div>
  );
};

export default ChatPage;
