import React from 'react'
import { useEffect, useState } from 'react'
import { getAllUser } from '../services/user.services'
import { createConversation } from "../services/conversation.services"
import { getConversation } from '../services/conversation.services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({setSelectedConversation, conversations, setConversations }) => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
     
    console.log(users); 
    const [search, setSearch] = useState("");
    
    // filtering user based on name keyword 
    const filteredUsers = users.filter((user) =>
        (user.username || "").toLowerCase().includes(search.toLowerCase())
    );

  /**
   * @showingLastMessageTme  
   */

  const ChatTime = (dateString)=>{
    if(!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();

    if(date.toDateString()=== now.toDateString()){
      return date.toLocaleDateString([],{hour:'2-digit',minute:'2-digit'});
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if(date.toDateString()===yesterday.toDateString()){
      return 'Yesterday';
    }

    return date.toDateString([], { month:'short',day:'numeric'});
  };
    /**
     * @description fetch all loggedIn conversation user 
     */
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await getConversation();
                setConversations(response.conversations);
            } catch (err) {
                console.log("error fetching conversation in side bar ", err);
                throw err;
            }
        };

        fetchConversations();
    }, []);

    conversations.forEach((conversation) => {
        const otherUser = conversation.participants.find(
            (participant) => participant._id !== users.id
        );
        console.log("OTHER USER:", otherUser);
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUser();
                setUsers(response.users);
            } catch (err) {
                throw err;
            }
        };

        fetchUsers();
    }, []);
     
    // handle start chat 
    const handleStartChat = async (userId) => {
        try {
            const response = await createConversation(userId);
            console.log("conversation:", response.conversation);
            setSelectedConversation(response.conversation);
        } catch (err) {
            console.log("start chat error", err);
            throw err;
        }
    };

    // UI part of side bar 
    return (
        <main className="relative w-full h-full flex flex-col overflow-hidden bg-white border-r border-gray-200">
            {/* Sidebar Header */}
            <div className="relative z-10 px-4 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Chats
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Connect with your friends
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate("/add-user")}
                            className="px-3 h-8 rounded-lg bg-emerald-600 text-white font-medium text-xs flex items-center justify-center transition-colors hover:bg-emerald-700"
                        >
                            Add
                        </button>
                        <button 
                            onClick={() => navigate("/contacts")}
                            className="px-3 h-8 rounded-lg bg-gray-100 text-gray-700 font-medium text-xs flex items-center justify-center transition-colors hover:bg-gray-200"
                        >
                            Contacts
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        🔍
                    </span>
                    <input 
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search or start new chat"
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="relative z-10 flex-1 overflow-y-auto px-2 py-3 space-y-1">
                {conversations.filter((conversation) => {
                    const otherUser = conversation.participants.find(
                        (participant) => participant._id !== user.id
                    );
                    return otherUser?.username?.toLowerCase().includes(search.toLowerCase());
                }).map((conversation) => {
                    const otherUser = conversation.participants.find(
                        (participant) => participant._id !== user.id
                    );

                    if (!otherUser) return null;

                    return (
                        <div
                            key={conversation._id}
                            onClick={() => handleStartChat(otherUser._id)}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-semibold">
                                    👤
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            </div>

                            {/* User Information */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                                        {otherUser.username}
                                    </h3>
                                    <span className="text-[10px] text-gray-400 ml-2">
                                        {ChatTime(conversation.updatedAt || conversation.lastMessage?.createdAt)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">
                                    Click to start chat
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default Sidebar;