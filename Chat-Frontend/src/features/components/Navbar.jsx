import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="h-16 px-4 sm:px-6 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-50">
      {/* Logo & Brand */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 group-hover:bg-emerald-600 flex items-center justify-center transition-colors shadow-sm">
          <span className="text-lg">💬</span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          ChatApp
        </h1>
      </Link>

  

      {/* Right Side: User Profile & Logout */}
      <div className="flex items-center gap-3">
        {/* User Info Badge */}
        <div className="hidden sm:flex items-center gap-2.5 bg-gray-50 border border-gray-100 py-1.5 px-3 rounded-full">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center uppercase">
            {user?.user ? user.user.charAt(0) : 'U'}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.user || 'User'}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutUser}
          className="px-3.5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;