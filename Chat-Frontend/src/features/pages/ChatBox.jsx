import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { getConversationById } from '../services/conversation.services';
import { forwardMessage, getMessages, sendMessage} from '../services/message.services';
import { deleteMessage } from '../services/message.services';
import { uploadChatFile } from '../services/message.services';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';

const ChatBox = ({conversation, allConversations, onBack}) => {
  const fileInputRef = useRef(null);

  const conversationId = conversation?._id;
  
  const {user} = useAuth();

  const [forwardOpen,setforwardMenuOpen] = useState(false);
  const [forwardId,setforwardId] = useState(null)
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [info, setInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
 
  const [errorMessage,setErrorMessage] = useState("");

  const otherUser = conversation?.participants?.find(
    (participant) => participant._id !== user?.id
  );
 console.log("another user",otherUser?.username);  
            
const [openMenu,setOpenMenu] = useState(null);
console.log("conversation:", conversation);
console.log("participants:", conversation?.participants);
console.log("otherUser:", otherUser);

/**
 * @description function to upload file 
 */

const uploadFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    // 1. File Cloudinary par upload karo
    const response = await uploadChatFile(formData);
    const fileData = response.file;

    // 2. Message database mein save karo
    const messageData = {
      conversationId: conversationId,
      text: "",
      attachments: [
        {
          fileUrl: fileData.fileUrl,
          fileType: fileData.fileType
        }
      ]
    };

    const sentResponse = await sendMessage(messageData);
    const newMessage = sentResponse.data;

    // 3. UI update karo
    setMessages(prev => [...prev, newMessage]);

    // 4. Doosre user ko real-time message bhejo
    socket.emit("sendMessage", newMessage);

  } catch (err) {
    console.error(
      "File upload error:",
      err.response?.data || err.message
    );
  } finally {
    // Same file dobara select karne ke liye
    e.target.value = "";
  }
};

/**
 * @whenchatOpen 
 */
  
useEffect(()=>{
   if(!conversationId || !user) return;

   socket.emit("markAsSeen", { conversationId, userId: user.id });

  // Listen for seen updates from other user
  const handleMessagesSeen = ({ conversationId: updatedConvId }) => {
    if (updatedConvId === conversationId) {
      setMessages(prev => 
        prev.map(msg => ({ ...msg, status: "seen" }))
      );
    }
  };

  socket.on("messagesSeen", handleMessagesSeen);

  return () => {
    socket.off("messagesSeen", handleMessagesSeen);
  };

},[conversationId, user])

/**
 * @description fetching conversation by id , [ ] box ke inside poora conversation ayega 
 */
useEffect(() => {
   if(!conversationId) return ;
    getConversationById(conversationId).then((response) => {
           setInfo(response.conversation);
      }).catch(err => {
           console.log("Error fetching conversation:", err);
      });
}, [conversationId]);

/**
 * @description this is used to fetch old messages 
 */

useEffect(() => {

  if (!conversationId) return;

  getMessages(conversationId)
    .then((response) => {

      console.log("FULL RESPONSE:", response);
      console.log("CURRENT USER:", user);
      console.log("CURRENT USER ID:", user?.id);

      const fetchedMessages = response.data || [];

      console.log("FETCHED MESSAGES:", fetchedMessages);

      if (fetchedMessages.length > 0) {
        console.log("FIRST MESSAGE:", fetchedMessages[0]);
        console.log("FIRST MESSAGE SENDER:", fetchedMessages[0].sender);
        console.log(
          "SENDER TYPE:",
          typeof fetchedMessages[0].sender
        );
      }

      setMessages(fetchedMessages);

    })
    .catch(err => {
      console.log("Error fetching messages:", err);
    });

}, [conversationId, user]);

/**
 * @description socket effect will initialise from here 
 */

useEffect(() => {
  console.log("USER OBJECT:", user);

  if (!user) {
    console.log("USER NOT AVAILABLE");
    return;
  }

  console.log("Emitting userOnline:", user.id);

  socket.emit("userOnline", user.id);

  const handleOnlineUsers = (users) => {
    console.log("ONLINE USERS:", users);
    setOnlineUsers(users);
  };

  socket.on("onlineUsers", handleOnlineUsers);

  return () => {
    socket.off("onlineUsers", handleOnlineUsers);
  };
}, [user]);

/**
 * @description conersation room join + listen for messages 
 */
  useEffect(() => {

    if (!conversationId) return;

    // Join room
    socket.emit(
      "joinConversation",
      conversationId
    );

    console.log(
      "Joined conversation:",
      conversationId
    );


    // Receive new message
    const handleNewMessage = (message) => {

      console.log(
        "New message received:",
        message
      );

      setMessages(prev => [
        ...prev,
        message
      ]);
    };


    socket.on(
      "newMessage",
      handleNewMessage
    );


    // Cleanup
    return () => {

      socket.off(
        "newMessage",
        handleNewMessage
      );

    };

  }, [conversationId]);

/**
 * @description this function is used to send message in backend 
 */
  const handleSendMessage = async (e) => {

    e.preventDefault();

    if (!text.trim()) return;

    try {

      const response = await sendMessage({conversationId,text});

      console.log("Sent message:",response);


      // Add sender's message immediately
      setMessages(prev => [
        ...prev,
        response.data
      ]);


      // Send message through socket
      socket.emit(
        "sendMessage",
        response.data
      );
      setText("");
    } 
    catch (err) {
      console.log("Error sending message:",err);
    }
  };

  /**
   * @delete messages  APIs 
   */
const handleDeleteMessage = async (messageId) => {
  try {
    setErrorMessage("");
    await deleteMessage(messageId);
    
    setMessages((prevMessages) =>                               
      prevMessages.filter(
        (message) => message._id !== messageId
      )
    );

  } catch (error) {
    console.log("Error deleting message:", error);
    setErrorMessage(err.response?.data?.message || "Failed to delete message")
  }
};
 
/**
 * @socketComponent other user states ko clean karne ke liye after deleting message 
 */
  
useEffect(()=>{
   const handleMessageDeleted = async ({messageId})=>{
       setMessages((prevMessages)=>
             prevMessages.filter(
              (message)=>message._id !== messageId
             ))
   }

   socket.on("messageDeleted",handleMessageDeleted);

   return ()=>{
     socket.off("messageDeleted",handleMessageDeleted);
   }
},[socket]);

/**
 * @handleDeleteMessage Forward Message API 
 */

const handleForwardMessage = async (messageId,selectedIds)=>{
   try{
     
    const forwardData = {
      originalMessageId:messageId,
      targetConversationIds:selectedIds
    };

    const result = await forwardMessage(forwardData);
    console.log("Forwarded Successfully:",result);

   }catch(err){
      console.log("failed to forward message:",err.response?.data?.message || err.message);
   }
}

/**
 * @handleCheckBoxChange
 */

const handleCheckBox = async (conversationId)=>{
   if(selectedChatIds.includes(conversationId)){
      setSelectedChatIds(selectedChatIds.filter(id=> id !== conversationId));
      setErrorMessage("");
   }
   else {
      if(selectedChatIds.length < 5){
         setSelectedChatIds([...selectedChatIds,conversationId]);
         setErrorMessage("");
      }
      else{
         setErrorMessage("You can select atmost 5 chats")
      }
   }
}
  /**
   * @description now all the things will appear on UI inside return 
   */
return (
  <main className="w-full h-full bg-white">

    {/* Chat Window */}
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#efeae2]">

      {/* ================= HEADER ================= */}
     <div className="h-[64px] px-3 sm:px-5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
  {info ? (
    <div className="flex items-center gap-3 min-w-0">
      <button onClick={onBack} className="md:hidden px-2 py-1 text-gray-700 font-bold">
        ←
      </button>

      {/* User Info with Status Subtext */}
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-gray-900 truncate">
          {otherUser?.username || ""}
        </h2>
        {/* showing whether user is online or offline */}
       {onlineUsers.includes(otherUser?._id) ? (
  /* Agar user online hai */
  <div className="flex items-center gap-1.5">
    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
    <span className="text-xs text-emerald-600 font-medium">Active now</span>
  </div>
) : (
  /* Agar user offline hai toh Last Seen dikhayein */
  <span className="text-xs text-gray-400 font-medium">
    {otherUser?.lastSeen ? `Last seen ${ChatTime(otherUser.lastSeen)}` : 'Offline'}
  </span>
)}
      </div>
    </div>
  ) : (
    <p className="text-sm text-black">Select a conversation</p>
  )}

  {/* Right Side Quick Actions */}
  {info && (
    <div className="flex items-center gap-1">
      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
        🔍
      </button>
    </div>
  )}
</div>


      {/*  MESSAGES ** when there is no message between conversation */  }
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4">

        {messages.length === 0 ? ( 

          
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-3">
              💬
            </div>
            <h3 className="text-base font-medium text-gray-700">
              No messages yet
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Start the conversation 👋
            </p>

          </div>

        ) : (

          <div className="space-y-1">

            {messages.map((message) => {

              const isMyMessage = (typeof message.sender === "object" ? message.sender?._id: message.sender) === (user?._id || user?.id);

              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isMyMessage
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[82%] sm:max-w-[65%] px-3.5 py-2 ${
                      isMyMessage
                        ? "bg-[#d9fdd3] text-gray-800 rounded-lg rounded-br-sm"
                        : "bg-white text-gray-800 rounded-lg rounded-bl-sm"
                    }`}
                  >
                    {
                      errorMessage && (
                        <p className='text-sm text-red-500 mt-2'>{errorMessage}</p>
                      )
                    }

                    {/* Three Dot */}

                    {isMyMessage && (
                      <div className="absolute right-1 top-1">

                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === message._id
                                ? null
                                : message._id
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center text-gray-500 text-sm"
                        >
                          ⋮
                        </button>

                        {openMenu === message._id && (
                          <div className="absolute right-0 top-6 w-24 bg-white rounded-md shadow-md border border-gray-200 p-1 z-20">

                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteMessage(message._id);
                                setOpenMenu(null);
                              }}
                              className="w-full px-2.5 py-1.5 text-left text-xs text-red-500 rounded"
                            >
                              Delete
                            </button>

                            {/* forward button */}
                            <button 
                            type='button' 
                            onClick={() => {
                            setforwardId(message._id);     // <-- Kis message ko forward karna hai
                            setforwardMenuOpen(true);     // <-- Modal open karo
                            setOpenMenu(null);            // <-- Dropdown band karo
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors rounded-md"
                            > 
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                             forward
                            </button>

                          </div>
                        )}

                      </div>
                    )}
           
                 {/* setting up forward model menu  */}
{/* Forward Modal */}
{forwardOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg w-80 sm:w-96 max-h-[80vh] overflow-y-auto shadow-xl">
      <h3 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">Forward Message</h3>

      {/* Conversations List (Parent se aayi hui allConversations map ho rahi hain) */}
      <div className="space-y-1 mb-3">
        {Array.isArray(allConversations) && allConversations.map((chat) => {
          // Current user ke alawa doosre participant ka naam/avatar nikalne ke liye
          const otherUser = chat.participants?.find((p) => p._id !== user?.id);

          return (
            <div 
              key={chat._id} 
              onClick={() => handleCheckBox(chat._id)}
              className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-semibold">
                  👤
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  {otherUser?.username || "Chat"}
                </span>
              </div>
              
              <input 
                type="checkbox" 
                checked={selectedChatIds.includes(chat._id)}
                onChange={() => {}} 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      {/* Inline Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-xs mb-3 font-medium">
          ⚠️ {errorMessage}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button 
          type="button"
          onClick={() => {
            setforwardMenuOpen(false);
            setSelectedChatIds([]);
            setErrorMessage("");
          }}
          className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded"
        >
          Cancel
        </button>
        
        <button 
          type="button"
          onClick={async () => {
            try {
              const forwardData = {
                OriginalMessageId: forwardId,
                targetConversationIds: selectedChatIds
              };
              
              await forwardMessage(forwardData); // Aapki API function jo banayi thi
              
              setforwardMenuOpen(false);
              setSelectedChatIds([]);
              setErrorMessage("");
              setforwardId(null);
            } catch (err) {
              console.error("Failed to forward message", err);
              setErrorMessage("Failed to forward message. Try again.");
            }
          }}
          disabled={selectedChatIds.length === 0}
          className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          Send ({selectedChatIds.length})
        </button>
      </div>
    </div>
  </div>
)}

             {/* Attachments */}
       {message.attachments?.map((file, index) => {

    if (file.fileType.startsWith("image/")) {
        return (
            <img
                key={index}
                src={file.fileUrl}
                alt="attachment"
                className="max-w-[250px] rounded-lg mb-2"
            />
        );
    }

    return (
        <a
            key={index}
            href={file.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-blue-500 underline mb-2"
        >
            📎 Open File
        </a>
    );
})}

                    {/* Text */}
                    <p className="text-[14px] leading-5 break-words pr-4">
                      {message.text}
                    </p>
                   <div className="flex items-center justify-end gap-1 mt-1">
  <span className="text-[10px] text-gray-500">
    {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </span>

  {/* Status Ticks */}
  {isMyMessage && (
    <span className="text-[11px] font-bold">
      {message.status === "sent" && <span className="text-gray-400">✓</span>}
      {message.status === "delivered" && <span className="text-gray-400">✓✓</span>}
      {message.status === "seen" && <span className="text-sky-500">✓✓</span>}
    </span>
  )}
</div>
                    {/* Sender */}
                    <div
                      className={`text-[9px] mt-1 ${
                        isMyMessage
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      {isMyMessage ? "You" : "Other User"}
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

      
      {/* ================= MESSAGE INPUT ================= */}
      <form
        onSubmit={handleSendMessage}
        className="px-3 py-2.5 sm:px-4 bg-white border-t border-gray-200 shrink-0"
      >

        <div className="flex items-center gap-2">

          {/* Attachment */}
          <input 
          ref={fileInputRef}
          type="file" 
          className='hidden'
          onChange={uploadFile}
          />
        <button
         onClick={()=>fileInputRef.current.click()}
         type="button"
         className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-black text-xl shrink-0"
         >
         +
        </button>


          {/* Input */}
          <div className="flex-1">

            <input
              type="text"
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-full outline-none text-sm text-gray-800 placeholder-gray-400"
            />

          </div>


          {/* Send */}
          <button type="submit" disabled={!text.trim()}
                  className="w-10 h-10 flex-shrink-0 rounded-full bg-green-500 text-white flex items-center justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
            ➤
          </button>

        </div>

      </form>

    </div>

  </main>
);
};

export default ChatBox;