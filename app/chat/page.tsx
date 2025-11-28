import React from "react";
import Sidebar from "./components/Sidebar";
import MainChatArea from "./components/MainChatArea";

const ChatPage = () => {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 h-screen flex flex-col lg:flex-row gap-4 lg:gap-6">
      <Sidebar />
      <MainChatArea />
    </div>
  );
};

export default ChatPage;
