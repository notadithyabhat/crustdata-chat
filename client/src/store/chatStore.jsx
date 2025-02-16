// client/src/store/chatStore.jsx
import { create } from 'zustand';
import axios from 'axios';

const useChatStore = create((set, get) => ({
  chats: [],
  currentChatId: null,
  messages: [],

  // We'll store loading states in an object keyed by chatId
  loadingByChat: {},

  fetchChats: async () => {
    try {
      const res = await axios.get('/api/chatHistory/sessions');
      set({ chats: res.data });
    } catch (error) {
      console.error('Error fetching chats', error);
    }
  },

  fetchMessages: async (chatId) => {
    try {
      const res = await axios.get(`/api/chatHistory/sessions/${chatId}/messages`);
      set({ messages: res.data, currentChatId: chatId });
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  },

  loadChat: async (chatId) => {
    await get().fetchMessages(chatId);
  },

  newChat: async (title = 'New Chat') => {
    try {
      const res = await axios.post('/api/chatHistory/sessions', { title });
      const newChat = res.data;
      set((state) => ({
        chats: [newChat, ...state.chats],
        currentChatId: newChat.id,
        messages: []
      }));
      return newChat.id;
    } catch (error) {
      console.error('Error creating new chat session', error);
      return null;
    }
  },

  /**
   * Add a message to a specific chat session. If forcedChatId is provided,
   * we use that. Otherwise, we use currentChatId.
   */
  addMessage: async (message, forcedChatId) => {
    const { currentChatId, messages } = get();
    const chatId = forcedChatId || currentChatId;
    if (!chatId) {
      console.error('No active chat session');
      return;
    }
    try {
      const payload = {
        content: message.text ?? message.content,
        role: message.isBot ? 'assistant' : 'user'
      };
      const res = await axios.post(`/api/chatHistory/sessions/${chatId}/messages`, payload);

      // Only update state if the chat is still the active one
      if (chatId === get().currentChatId) {
        set({ messages: [...messages, res.data] });
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  },

  renameChat: async (chatId, newTitle) => {
    try {
      const res = await axios.put(`/api/chatHistory/sessions/${chatId}`, { title: newTitle });
      set((state) => ({
        chats: state.chats.map((c) => (c.id === chatId ? res.data : c))
      }));
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  },

  deleteChat: async (chatId) => {
    try {
      await axios.delete(`/api/chatHistory/sessions/${chatId}`);
      set((state) => {
        const updatedChats = state.chats.filter((c) => c.id !== chatId);
        if (state.currentChatId === chatId) {
          return { chats: updatedChats, currentChatId: null, messages: [] };
        }
        return { chats: updatedChats };
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  },

  /**
   * Set loading state for a specific chat
   */
  setChatLoading: (chatId, isLoading) => {
    set((state) => ({
      loadingByChat: {
        ...state.loadingByChat,
        [chatId]: isLoading
      }
    }));
  }
}));

export default useChatStore;
