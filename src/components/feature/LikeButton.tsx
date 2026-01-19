// Fichier: src/components/feature/LikeButton.tsx
import React, { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '../../lib/supabase'; // Vérifie que ce chemin est bon pour toi

export default function LikeButton({ avatarId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Assure-toi que getCurrentUser existe dans ton lib/supabase, sinon utilise supabase.auth.getUser()
    if (getCurrentUser) {
        getCurrentUser().then(setUser);
    } else {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }
  }, []);

  useEffect(() => {
    if (user) {
      checkIfLiked();
    }
  }, [user, avatarId]);

  const checkIfLiked = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('avatar_likes')
        .select('id')
        .eq('avatar_id', avatarId)
        .eq('user_id', user.id)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      // Gestion simplifiée si tu n'as pas l'event listener global
      alert("Veuillez vous connecter pour aimer un avatar."); 
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        await supabase
          .from('avatar_likes')
          .delete()
          .eq('avatar_id', avatarId)
          .eq('user_id', user.id);
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        await supabase
          .from('avatar_likes')
          .insert([{ avatar_id: avatarId, user_id: user.id }]);
        setLikes(likes + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('erreur like ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isLiked
          ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-300'
      } disabled:opacity-50`}
    >
      <svg 
        className={`w-4 h-4 transition-transform ${isLiked ? 'fill-current' : ''}`} 
        fill={isLiked ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likes}</span>
    </button>
  );
}
