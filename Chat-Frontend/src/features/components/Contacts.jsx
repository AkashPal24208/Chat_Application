import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts } from '../services/user.services';
import { createConversation } from '../services/conversation.services';
import Navbar from './Navbar';
import {deleteContactApi} from '../services/user.services'
const Contacts = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingChatId, setStartingChatId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const list = await getContacts();
        setUsers(list?.contacts || []);
      } catch (err) {
        console.error('Error in fetching contact list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  /**
   * Start conversation and redirect
   */
  const startConversation = async (contactId) => {
    try {
      setStartingChatId(contactId);
      const response = await createConversation(contactId);
      navigate('/');
    } catch (err) {
      console.error('Error starting conversation:', err);
    } finally {
      setStartingChatId(null);
    }
  };

  // Filter contacts by name or email
  const filteredUsers = users.filter((contact) => {
    const nameMatch = contact?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = contact?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch;
  });
 /**
  * 
  */

 const deleteContact = async (contactId) => {
    try {
        // Optional: Confirmation popup (user se poochne ke liye)
        const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
        if (!confirmDelete) return;

        // Backend API call
        await deleteContactApi(contactId);

        // UI state ko update karein taaki turant list se hat jaye (bina page refresh ke)
        setUsers((prevUsers) => prevUsers.filter((item) => item._id !== contactId));
        
        console.log("Contact deleted successfully");
    } catch (error) {
        console.error("Failed to delete contact:", error);
        alert("Something went wrong while deleting the contact.");
    }
};


return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 shadow-sm">
        <Navbar />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-sm text-gray-500">
              {users.length} {users.length === 1 ? 'person' : 'people'} saved
            </p>
          </div>

          <button
            onClick={() => navigate('/add-user')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-5">
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
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
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400"
          />
        </div>

        {/* Contact List */}
        <div className="space-y-2.5">
          {loading ? (
            // Skeleton Loader
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-3.5 bg-white rounded-xl border border-gray-100 flex items-center gap-3 animate-pulse"
              >
                <div className="w-11 h-11 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((item) => {
              const targetUserId = item?.user?._id || item?._id;
              const isStarting = startingChatId === targetUserId;

              return (
                <div
                  key={item._id}
                  className="group p-3.5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-3 hover:border-emerald-200 hover:shadow-sm transition-all"
                >
                  {/* Clickable Area for Chat */}
                  <div
                    onClick={() => startConversation(targetUserId)}
                    className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                  >
                    {/* Dynamic Avatar with Initial */}
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-base flex items-center justify-center shrink-0 uppercase">
                      {item.name ? item.name.charAt(0) : 'U'}
                    </div>

                    {/* Info */}
                    <div className="truncate">
                      <h3 className="text-gray-900 font-semibold text-sm truncate">
                        {item.name}
                      </h3>
                      {item?.user?.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {item.user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions (Message Button & Delete Button) */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Chat Button */}
                    <button
                      onClick={() => startConversation(targetUserId)}
                      title="Start Chat"
                      className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-emerald-50 text-gray-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors"
                    >
                      {isStarting ? (
                        <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                    </button>

                    {/* Delete Contact Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Chat trigger hone se rokne ke liye
                        deleteContact(item._id); // Apka delete function yahan call hoga
                      }}
                      title="Delete Contact"
                      className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State */
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-semibold text-base mb-1">
                {searchTerm ? 'No matching contacts' : 'No contacts found'}
              </h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto mb-4">
                {searchTerm
                  ? 'Try searching with a different name or email address.'
                  : 'Add contacts by searching their email addresses.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/add-user')}
                  className="px-4 py-2 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Add Your First Contact
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Contacts;