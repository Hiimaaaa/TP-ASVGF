import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/supabase';

interface VoteButtonProps {
  avatarId: string;
  initialScore?: number;
}

type VoteType = 'like' | 'dislike' | null;

export default function VoteButton({ avatarId, initialScore = 0 }: VoteButtonProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    if (user) {
      checkUserVote();
    }
  }, [user, avatarId]);

  const checkUserVote = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('avatar_votes')
        .select('vote_type')
        .eq('avatar_id', avatarId)
        .eq('user_id', user.id)
        .single();

      setUserVote(data?.vote_type || null);
    } catch (error) {
      setUserVote(null);
    }
  };

  const handleVote = async (voteType: VoteType) => {
    if (!user) {
      window.dispatchEvent(
        new CustomEvent('openAuthModal', { detail: { mode: 'login' } })
      );
      return;
    }

    setLoading(true);
    try {
      const oldVote = userVote;
      let scoreChange = 0;

      if (oldVote === voteType) {
        scoreChange = oldVote === 'like' ? -1 : 1;
        await supabase
          .from('avatar_votes')
          .delete()
          .eq('avatar_id', avatarId)
          .eq('user_id', user.id);
        setUserVote(null);
      } else if (oldVote === null) {
        scoreChange = voteType === 'like' ? 1 : -1;
        await supabase
          .from('avatar_votes')
          .insert([{ avatar_id: avatarId, user_id: user.id, vote_type: voteType }]);
        setUserVote(voteType);
      } else {
        scoreChange = voteType === 'like' ? 2 : -2;
        await supabase
          .from('avatar_votes')
          .update({ vote_type: voteType })
          .eq('avatar_id', avatarId)
          .eq('user_id', user.id);
        setUserVote(voteType);
      }

      setScore(score + scoreChange);
    } catch (error) {
      console.error('erreur vote ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1.5">
      <button
        onClick={() => handleVote('like')}
        disabled={loading}
        className={`p-1 rounded transition-all duration-200 ${
          userVote === 'like'
            ? 'bg-green-500/30 text-green-400'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
        } disabled:opacity-50`}
        title="like"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 0l-7 7m7-7l7 7" />
        </svg>
      </button>
      
      <span className="text-sm font-semibold text-slate-300 w-8 text-center">
        {score}
      </span>
      
      <button
        onClick={() => handleVote('dislike')}
        disabled={loading}
        className={`p-1 rounded transition-all duration-200 ${
          userVote === 'dislike'
            ? 'bg-red-500/30 text-red-400'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
        } disabled:opacity-50`}
        title="dislike"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m0 0l-7-7m7 7l7-7" />
        </svg>
      </button>
    </div>
  );
}
