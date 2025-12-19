import React, { useState, useEffect } from 'react';
import { getCurrentUser, signOut, onAuthStateChange } from '../../lib/supabase';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Get initial user
    getCurrentUser().then(setUser).finally(() => setLoading(false));

    // Listen to auth changes
    const { data: { subscription } } = onAuthStateChange((newUser: any) => {
      setUser(newUser);
    });

    // Listen for custom event to open auth modal
    const handleOpenAuthModal = (event: any) => {
      setAuthMode(event.detail.mode);
      setShowAuthModal(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setShowMenu(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
        >
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata?.name || 'User'} 
              className="w-8 h-8 rounded-full border-2 border-purple-500"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="hidden md:block text-sm font-medium text-white">
            {user.user_metadata?.name || user.email?.split('@')[0]}
          </span>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-56 bg-[#0D1117] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <p className="text-sm font-semibold text-white">{user.user_metadata?.name || 'Utilisateur'}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              <div className="p-2">
                <a 
                  href="/gallery" 
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-all"
                >
                  Mes avatars
                </a>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => openAuthModal('login')}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-white/10"
        >
          Connexion
        </button>
        <button 
          onClick={() => openAuthModal('signup')}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-900/20"
        >
          Inscription
        </button>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
}
