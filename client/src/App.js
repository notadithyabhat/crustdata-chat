import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { useAuthStore } from './store/authStore';
import { AuthButton } from './components/AuthButton';

export default function App() {
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) {
    // Render a welcome screen prompting sign in/up when no user is logged in
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Chat App</h1>
        <p className="mb-8">Please sign in or sign up to continue</p>
        <AuthButton />
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

      <div className="flex flex-col flex-1">
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
