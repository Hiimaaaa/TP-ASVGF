import React, { useState } from 'react';

export default function AvatarGenerator() {
  const [loading, setLoading] = useState(false);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({
    gender: 'male',
    selectedColors: [] as string[]
  });

  
  const colorOptions = [
    { id: 1, name: 'Purple', color: '#A78BFA' },
    { id: 2, name: 'Pink', color: '#F472B6' },
    { id: 3, name: 'Cyan', color: '#67E8F9' },
    { id: 4, name: 'Yellow', color: '#FBBF24' },
    { id: 5, name: 'Orange', color: '#FB923C' },
    { id: 6, name: 'Green', color: '#4ADE80' },
    { id: 7, name: 'Blue', color: '#60A5FA' },
    { id: 8, name: 'Red', color: '#F87171' },
  ];

  const generateAvatar = async () => {
    setLoading(true);
    setSvg(null);
    setError(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          colors: config.selectedColors
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        console.error("Gemini Error:", data.error);
      } else if (data.avatar && data.avatar.svg) {
        setSvg(data.avatar.svg);
      }
    } catch (err: any) {
      console.error("Failed to generate:", err);
      setError(err.message || "Une erreur est survenue lors de la génération.");
    } finally {
      setLoading(false);
    }
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'avatar.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleColor = (color: string) => {
    if (config.selectedColors.includes(color)) {
      setConfig({
        ...config,
        selectedColors: config.selectedColors.filter(c => c !== color)
      });
    } else {
      setConfig({
        ...config,
        selectedColors: [...config.selectedColors, color]
      });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
       
        <div className="space-y-6">
          
        
          <div className="bg-[#0D1117]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Configuration</h3>
            </div>
            
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setConfig({...config, gender: 'male'})}
                className={`relative p-6 rounded-xl transition-all ${
                  config.gender === 'male' 
                    ? 'bg-white/10 border-2 border-white/20' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Homme</span>
                </div>
              </button>

              <button
                onClick={() => setConfig({...config, gender: 'female'})}
                className={`relative p-6 rounded-xl transition-all ${
                  config.gender === 'female' 
                    ? 'bg-white/10 border-2 border-white/20' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Femme</span>
                </div>
              </button>
            </div>
          </div>

        
          <div className="bg-[#0D1117]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Couleurs</h3>
            </div>
            
          
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.id}
                  onClick={() => toggleColor(colorOption.color)}
                  className={`relative h-16 rounded-lg transition-all overflow-hidden group ${
                    config.selectedColors.includes(colorOption.color)
                      ? 'ring-2 ring-white/60 scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption.color }}
                  title={colorOption.name}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {config.selectedColors.includes(colorOption.color) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

           
            {config.selectedColors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-2">Couleurs sélectionnées ({config.selectedColors.length})</p>
                <div className="flex gap-2 flex-wrap">
                  {config.selectedColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-lg border-2 border-white/20"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>

        
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-sm">Génération échouée</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

         
          <button 
            onClick={generateAvatar}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Génération...</span>
              </>
            ) : (
              <span>Générer l'Avatar</span>
            )}
          </button>
        </div>

       
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-[#0D1117]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-8 min-h-[700px] flex flex-col items-center justify-center relative overflow-hidden">
            
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
            
            {svg ? (
              <div className="relative z-10 w-full flex flex-col items-center">
                <div 
                  className="w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden bg-[#0B0F19] border border-white/10 p-8 mb-6"
                  dangerouslySetInnerHTML={{ __html: svg }} 
                />
                
                <div className="flex gap-3">
                  <button 
                    onClick={downloadSvg}
                    className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSvg(null);
                      setError(null);
                    }}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/10"
                  >
                    Nouveau
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Aperçu</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Votre avatar apparaîtra ici après la génération
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
