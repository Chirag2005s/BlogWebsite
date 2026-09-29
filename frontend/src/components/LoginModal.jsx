import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-card border border-line rounded-2xl shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-heading hover:bg-soft rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F6B4F] to-[#16805E] flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#0F6B4F]/20">
            <LogIn size={22} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-heading">Login Required</h2>
          <p className="text-sm text-muted">
            You need to be logged in to access this feature. Please sign in or create an account to continue.
          </p>
          
          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-heading bg-soft hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0F6B4F] hover:bg-[#0C5A42] transition-colors shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
