// client/src/components/AuthButton.jsx
import React, { useState } from 'react'; // <-- ADD THIS
import { useAuthStore } from '../store/authStore';
import { AuthModal } from './AuthModal';

export const AuthButton = () => {
  const { user, logout, loading } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  if (user) {
    return (
      <button
        onClick={logout}
        disabled={loading}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'Logging Out...' : 'Logout'}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        Login/Signup
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoginView={isLoginView}
        switchView={() => setIsLoginView((prev) => !prev)}
      />
    </>
  );
};
