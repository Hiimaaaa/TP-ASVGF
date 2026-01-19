import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { signInWithGoogle } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error with Google auth:', error);
      alert('Erreur lors de l\'authentification. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with strong blur */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container to fix scrolling issue */}
      <div className="relative w-full max-w-lg overflow-hidden flex flex-col items-center justify-center">
        {/* Modal */}
        <div className="relative w-full bg-white dark:bg-[#0D1117]/95 backdrop-blur-sm border border-slate-200 dark:border-white/20 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
          {/* Gradient top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white z-10 border border-slate-200 dark:border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                {mode === 'signup' ? 'Inscription' : 'Connexion'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                {mode === 'signup' 
                  ? 'Créez un compte pour sauvegarder vos avatars' 
                  : 'Connectez-vous pour accéder à vos avatars'}
              </p>
            </div>

            {/* Google Auth Button */}
            <button 
              onClick={handleGoogleAuth}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-lg ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                  : 'bg-white hover:bg-slate-50 border border-slate-200 dark:border-transparent text-gray-900'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill={mode === 'signup' ? 'currentColor' : '#4285F4'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill={mode === 'signup' ? 'currentColor' : '#34A853'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill={mode === 'signup' ? 'currentColor' : '#FBBC05'} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill={mode === 'signup' ? 'currentColor' : '#EA4335'} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>
                    {mode === 'signup' ? 'S\'inscrire avec Google' : 'Continuer avec Google'}
                  </span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#0D1117] text-slate-500">ou</span>
              </div>
            </div>

            {/* Switch mode link */}
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {mode === 'signup' ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?'}
                <button 
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      const event = new CustomEvent('openAuthModal', { 
                        detail: { mode: mode === 'signup' ? 'login' : 'signup' } 
                      });
                      window.dispatchEvent(event);
                    }, 100);
                  }}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-semibold ml-1"
                >
                  {mode === 'signup' ? 'Se connecter' : 'S\'inscrire'}
                </button>
              </p>
            </div>

            {/* Terms for signup */}
            {mode === 'signup' && (
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                  En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
