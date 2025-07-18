// Updated HomePage.jsx with responsive mobile-friendly design
import React from 'react';
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../component/Sidebar';
import NoChatSelected from './NoChatSelected';
import ChatContainer from './ChatContainer';

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

 

  return (
    <div className="pt-16 h-screen w-screen bg-base-200 flex flex-col lg:flex-row overflow-hidden">
      <div className={`w-full lg:w-1/4 h-full border-r ${selectedUser ? 'hidden lg:block' : 'block'}`}>
        <Sidebar />
      </div>

      <div className={`w-full lg:w-3/4 h-full ${!selectedUser ? 'hidden lg:flex' : 'flex'} flex-col`}>
        {selectedUser ? (
          <>
            
            <ChatContainer />
          </>
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default HomePage;