// client/src/components/AuthModal.jsx
import { Dialog } from '@headlessui/react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthModal = ({ isOpen, onClose, isLoginView, switchView }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-8">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold">
              {isLoginView ? 'Sign In' : 'Create Account'}
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {isLoginView ? (
            <LoginForm switchToSignup={switchView} />
          ) : (
            <SignupForm switchToLogin={switchView} />
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
