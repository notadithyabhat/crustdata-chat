import { Dialog } from '@headlessui/react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthModal = ({ isOpen, onClose, isLoginView, switchView }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-gray-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold text-white">
              {isLoginView ? 'Sign In' : 'Create Account'}
            </Dialog.Title>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors"
              title="Close"
            >
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
