import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { getConversation } from '../services/conversation.services';
import ChatBox from './ChatBox';

const Home = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]); // <-- Saari chats ka state yahan lift up kar diya
  const navigate = useNavigate();

  // Home component par hi saari conversations fetch kar li taaki Sidebar aur ChatBox dono use kar sakein
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await getConversation();
        setConversations(response.conversations);
      } catch (err) {
        console.log("error fetching conversation in Home", err);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-full md:w-80 border-r border-gray-200
          ${selectedConversation ? "hidden md:block" : "block"}`}
        >
          <Sidebar
            setSelectedConversation={setSelectedConversation}
            conversations={conversations}         // <-- Prop pass kiya
            setConversations={setConversations}   // <-- Prop pass kiya
          />
        </div>

        {/* ChatBox */}
        <div
          className={`flex-1
          ${selectedConversation ? "flex" : "hidden md:flex"}`}
        >
          <ChatBox 
            conversation={selectedConversation} 
            allConversations={conversations}      // <-- Yahan mil gayi forward modal ke liye saari chats!
            onBack={() => setSelectedConversation(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;