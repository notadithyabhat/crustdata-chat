// client/src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('/api/auth/login', credentials);
          // IMPORTANT: the backend returns {id, name, email} at top-level
          set({ user: response.data, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Login failed',
            loading: false,
          });
        }
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('/api/auth/signup', userData);
          // IMPORTANT: the backend returns {id, name, email} at top-level
          set({ user: response.data, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Signup failed',
            loading: false,
          });
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await axios.post('/api/auth/logout');
          set({ user: null, loading: false });
        } catch (err) {
          set({ error: 'Logout failed', loading: false });
        }
      },

      // New action: allow guest usage without login
      continueAsGuest: () =>
        set({
          user: { id: 'guest', name: 'Guest', email: '' },
        }),
    }),
    {
      name: 'auth-storage', // Key in LocalStorage
      partialize: (state) => ({ user: state.user }), // Only persist the 'user' field
    }
  )
);
