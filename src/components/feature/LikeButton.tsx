import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface LikeButtonProps {
  avatarId: string;
  initialLikes: number;
}

export default function LikeButton({ avatarId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUserAndLikeStatus();
  }, [avatarId]);

  const checkUserAndLikeStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data } = await supabase
        .from('avatar_likes')
        .select('*')
        .eq('avatar_id', avatarId)
        .eq('user_id', user.id)
        .single();
      
      setIsLiked(!!data);
    }
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Trigger auth modal opening via custom event if not logged in
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'login' } }));
      return;
    }
    
    if (loading) return;
    setLoading(true);

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('avatar_likes')
          .delete()
          .eq('avatar_id', avatarId)
          .eq('user_id', user.id);
        
        if (!error) {
          setLikes(prev => prev - 1);
          setIsLiked(false);
        }
      } else {
        const { error } = await supabase
          .from('avatar_likes')
          .insert({
            avatar_id: avatarId,
            user_id: user.id
          });
        
        if (!error) {
          setLikes(prev => prev + 1);
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        isLiked
          ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-pink-50 dark:hover:bg-white/10 hover:text-pink-500 dark:hover:text-pink-400'
      }`}
    >
      <svg 
        className={`w-3.5 h-3.5 transition-transform ${isLiked ? 'fill-current scale-110' : 'fill-none scale-100'}`} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>{likes}</span>
    </button>
  );
}