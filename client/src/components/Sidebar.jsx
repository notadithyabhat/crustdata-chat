import { ChevronDoubleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import useChatStore from '../store/chatStore'
import { useAuthStore } from '../store/authStore' // import auth user
import { useState } from 'react'

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { chats, currentChatId, loadChat, newChat, deleteChat } = useChatStore()
  const { user } = useAuthStore() // get the authenticated user

  // Updated "New Chat" onClick to async
  const handleNewChat = async () => {
    const chatId = await newChat()
    if (chatId) {
      await loadChat(chatId)
    }
  }

  // Updated "Load Chat" onClick to async
  const handleLoadChat = async (chatId) => {
    await loadChat(chatId)
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Top bar with collapse/expand button */}
      <div className="border-b border-gray-700 flex items-center justify-between p-2">
        {!isCollapsed && (
          <div className="text-primary text-2xl font-bold font-sans">
            CrustData Bot
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-accent hover:bg-opacity-80 text-primary rounded-lg p-2"
        >
          {isCollapsed ? (
            <ChevronDoubleLeftIcon className="h-6 w-6 rotate-180" />
          ) : (
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Expanded content */}
      {!isCollapsed ? (
        <>
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={handleNewChat}
              className="w-full bg-accent hover:bg-opacity-80 text-primary
                         rounded-lg p-3 transition-all flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {chats.length === 0 && (
              <div className="text-gray-400 p-2 text-sm">
                No chats found. Start by clicking "New Chat" above.
              </div>
            )}

            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`
                  p-2 rounded-lg hover:bg-gray-700 group relative
                  ${chat.id === currentChatId ? 'bg-gray-600' : ''}
                `}
              >
                {/* Clicking here loads the chat */}
                <div
                  className="cursor-pointer pr-6"
                  onClick={() => handleLoadChat(chat.id)}
                >
                  {chat.title}
                  <div className="text-xs text-gray-400">
                    {/* If your backend returns created_at or updated_at: */}
                    {chat.created_at ? new Date(chat.created_at).toLocaleString() : ''}
                  </div>
                </div>

                {/* The "X" delete button, shown on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteChat(chat.id)
                  }}
                  className="absolute right-2 top-2 hidden group-hover:block 
                             text-sm text-gray-400 hover:text-white"
                  title="Delete this chat"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 p-4 relative">
            <div className="absolute bottom-10 w-full flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary"></div>
              <div className="text-gray-200 text-sm">
                {user && user.name ? user.name : 'Guest User'}
              </div>
            </div>
          </div>
        </>
      ) : (
        // Minimized: position the green circle in the center
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-primary"></div>
        </div>
      )}
    </div>
  )
}
