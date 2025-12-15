import React, { useState } from 'react';

export default function AvatarGenerator() {
  const [loading, setLoading] = useState(false);
  const [svg, setSvg] = useState<string | null>(null);
  const [config, setConfig] = useState({
    features: '',
    color: 'Bleu Électrique'
  });

  const generateAvatar = async () => {
    setLoading(true);
    setSvg(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (data.error) {
        alert("Error: " + data.error);
      } else if (data.avatar && data.avatar.svg) {
        setSvg(data.avatar.svg);
      }
    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Something went wrong. Check console.");
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

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#131825] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      

      <div className="lg:col-span-5 p-8 border-r border-white/5 flex flex-col justify-center">
        <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
           Configuration
        </h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accessoires</label>
            <input 
              type="text" 
              value={config.features} 
              onChange={(e) => setConfig({...config, features: e.target.value})}
              className="w-full bg-[#0B0F19] text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              placeholder="ex: Casquette, Lunettes laser..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ambiance</label>
               <span className="text-xs text-indigo-400 font-medium">{config.color}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Bleu Électrique', color: 'bg-blue-500' },
                { name: 'Rose Cyberpunk', color: 'bg-pink-500' },
                { name: 'Jaune Banane', color: 'bg-yellow-400' },
                { name: 'Vert Jungle', color: 'bg-green-500' },
                { name: 'Noir & Blanc Classy', color: 'bg-slate-700' },
                { name: 'Rouge Mars', color: 'bg-red-500' },
              ].map((option) => (
                <button 
                  key={option.name}
                  onClick={() => setConfig({...config, color: option.name})}
                  className={`
                    relative h-12 rounded-lg transition-all overflow-hidden group
                    ${config.color === option.name 
                      ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#131825]' 
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }
                  `}
                  title={option.name}
                >
                  <div className={`absolute inset-0 ${option.color}`}></div>
                  

                  {config.color === option.name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-black/20 rounded-full p-1">
                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                       </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={generateAvatar}
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-lg shadow-lg shadow-indigo-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white/50" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Génération...</span>
              </>
            ) : (
              <>
                <span>Générer le concept</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </>
            )}
          </button>
        </div>
      </div>


      <div className="lg:col-span-7 bg-[#0f121d] flex flex-col items-center justify-center p-8 min-h-[500px] relative">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {svg ? (
            <div className="relative z-10 w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div 
                className="w-full max-w-[320px] aspect-square rounded-xl overflow-hidden shadow-2xl bg-[#0B0F19] border border-white/5 p-4"
                dangerouslySetInnerHTML={{ __html: svg }} 
              />
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={downloadSvg}
                  className="px-6 py-2 bg-white text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Télécharger (SVG)
                </button>
              </div>
            </div>
          ) : (
            <div className={`relative z-10 text-center space-y-4 ${loading ? 'opacity-50 scale-95' : 'opacity-100'} transition-all duration-500`}>
              <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/5">
                <span className="text-4xl opacity-50">🐵</span>
              </div>
              <h3 className="text-lg font-medium text-white">Zone de Rendu</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                La prévisualisation de votre avatar apparaîtra ici.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
