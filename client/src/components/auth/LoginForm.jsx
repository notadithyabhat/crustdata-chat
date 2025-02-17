// client/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { InputField } from './InputField';

export const LoginForm = ({ switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-inherit">
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={switchToSignup}
          className="text-white hover:text-white text-sm"
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </form>
  );
};
