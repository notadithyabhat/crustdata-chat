import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { useAuthStore } from './store/authStore';
import { AuthButton } from './components/AuthButton';

export default function App() {
  const { user, continueAsGuest } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) {
    // Render a welcome screen prompting sign in/up when no user is logged in
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary to-accent overflow-hidden">
        <h1 className="text-3xl font-bold mb-4 font-serif text-white">CrustData Bot</h1>
        <p className="mb-8 text-white">Please sign in or sign up to continue</p>
        <div className="flex items-center space-x-4">
          <AuthButton />
          {/* <span className="text-white">or</span>
          <button
            onClick={continueAsGuest}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Continue as Guest
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          ${isCollapsed ? 'w-16' : 'w-64'} 
          bg-gray-900 text-white flex-shrink-0 
          transition-all duration-300
        `}
      >
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      </aside>

      <div className="flex flex-col flex-1 bg-gray-100">
        {/* Header with AuthButton for logout */}
        <header className="p-4 bg-gray-800 flex justify-end">
          <AuthButton />
        </header>
        {/* Main Chat area */}
        <Chat />
      </div>
    </div>
  );
}
