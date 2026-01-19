import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function GalleryGrid() {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchAvatars() {
      try {
        const { data, error } = await supabase
          .from('avatars')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setAvatars(data || []);
      } catch (e) {
        console.error("Fetch Error:", e);
        setErrorMsg(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAvatars();
  }, []);

  if (loading) return (
    <div className="text-center py-20 text-slate-400 animate-pulse">
      Chargement de la galerie...
    </div>
  );

  if (errorMsg) return (
    <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-8 border border-red-100">
      <strong>Erreur :</strong> {errorMsg}
    </div>
  );

  if (avatars.length === 0) return (
    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
      <div className="text-6xl mb-4">🖼️</div>
      <h3 className="text-xl font-semibold text-slate-800">La galerie est vide</h3>
      <a href="/" className="inline-flex mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
        Créer un Avatar
      </a>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {avatars.map((av) => (
        <div key={av.id} className="group bg-[#131825] rounded-2xl p-4 border border-white/5 hover:border-indigo-500/30 hover:bg-[#1A1F2E] transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-black/20">
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#0B0F19] relative items-center justify-center flex p-4 border border-white/5">
            {/* Attention : En React on utilise dangerouslySetInnerHTML pour le SVG brut */}
            <div 
              dangerouslySetInnerHTML={{ __html: av.svg_content }} 
              className="w-full h-full drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="mt-4 px-1">
            <div className="flex justify-between items-start mb-2 h-10">
               <p className="text-sm font-semibold text-slate-200 line-clamp-2 leading-snug" title={av.prompt}>
                 {av.style_tags?.features || 'Avatar'}
               </p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-white/5">
                {av.color_palette || 'SVG'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {new Date(av.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
