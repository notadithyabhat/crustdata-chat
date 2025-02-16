import { create } from 'zustand'
import { nanoid } from 'nanoid'

// Safely parse chatSessions & currentChatId from localStorage
function loadInitialData() {
  let chats = []
  let savedChatId = null

  try {
    const savedChats = localStorage.getItem('chatSessions')
    if (savedChats) {
      chats = JSON.parse(savedChats)
    }
    savedChatId = localStorage.getItem('currentChatId') || null
  } catch (err) {
    console.warn('Error parsing data from localStorage:', err)
    chats = []
    savedChatId = null
  }

  return { chats, savedChatId }
}

const { chats: initialChats, savedChatId } = loadInitialData()

const useChatStore = create((set, get) => ({
  chats: initialChats,         // all chat sessions
  currentChatId: savedChatId,  // which chat is active
  messages: [],                // messages of the active chat

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }))
    get().persistToLocalStorage()
  },

  updateMessage: (messageId, updates) => {
    set((state) => {
      const updated = state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
      return { messages: updated }
    })
    get().persistToLocalStorage()
  },

  clearMessages: () => {
    set({ messages: [] })
    get().persistToLocalStorage()
  },

  newChat: () => {
    const newChat = {
      id: nanoid(),
      title: 'New Chat',
      timestamp: new Date().toISOString(),
      messages: []
    }

    set((state) => ({
      chats: [newChat, ...state.chats],
      currentChatId: newChat.id,
      messages: []
    }))

    get().persistToLocalStorage()
    return newChat.id
  },

  // Rename an existing chat's title
  renameChat: (chatId, newTitle) => {
    set((state) => {
      const updatedChats = state.chats.map((c) =>
        c.id === chatId ? { ...c, title: newTitle } : c
      )
      return { chats: updatedChats }
    })
    get().persistToLocalStorage()
  },

  // Load an existing chat into messages
  loadChat: (chatId) => {
    const chat = get().chats.find((c) => c.id === chatId)
    if (chat) {
      set({
        currentChatId: chatId,
        messages: chat.messages
      })
      get().persistToLocalStorage()
    }
  },

  // Delete a chat by ID
  deleteChat: (chatId) => {
    set((state) => {
      const updatedChats = state.chats.filter((c) => c.id !== chatId)
      let newCurrentChatId = state.currentChatId
      let newMessages = state.messages

      // If we're deleting the active chat, pick a new one or clear
      if (chatId === state.currentChatId) {
        if (updatedChats.length > 0) {
          newCurrentChatId = updatedChats[0].id
          newMessages = updatedChats[0].messages
        } else {
          newCurrentChatId = null
          newMessages = []
        }
      }

      return {
        chats: updatedChats,
        currentChatId: newCurrentChatId,
        messages: newMessages
      }
    })
    get().persistToLocalStorage()
  },

  // Persist entire chat list + current chat ID to localStorage
  persistToLocalStorage: () => {
    const { chats, currentChatId, messages } = get()

    // Keep messages updated in whichever chat is active
    const updatedChats = chats.map((chat) =>
      chat.id === currentChatId
        ? { ...chat, messages, timestamp: new Date().toISOString() }
        : chat
    )
    localStorage.setItem('chatSessions', JSON.stringify(updatedChats))
    // Also store the currentChatId
    if (currentChatId) {
      localStorage.setItem('currentChatId', currentChatId)
    }

    set({ chats: updatedChats })
  }
}))

export default useChatStore
