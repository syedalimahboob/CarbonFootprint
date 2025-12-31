
import React, { useState } from 'react';
import { WhiteLabelConfig } from '../types';

interface BrandingSettingsProps {
  config: WhiteLabelConfig;
  onSave: (newConfig: WhiteLabelConfig) => void;
}

const BrandingSettings: React.FC<BrandingSettingsProps> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<WhiteLabelConfig>(config);
  const [isSaved, setIsSaved] = useState(false);

  const colors = [
    { name: 'Forest', primary: '#059669', accent: '#064e3b' },
    { name: 'Midnight', primary: '#3b82f6', accent: '#0f172a' },
    { name: 'Volcano', primary: '#f43f5e', accent: '#4c0519' },
    { name: 'Earth', primary: '#d97706', accent: '#451a03' },
    { name: 'Ocean', primary: '#0ea5e9', accent: '#0c4a6e' },
  ];

  const handleSave = () => {
    onSave(localConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-8">Platform Identity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
              <input 
                type="text" 
                value={localConfig.companyName}
                onChange={(e) => setLocalConfig({...localConfig, companyName: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 outline-none transition-all"
                style={{ focusRingColor: localConfig.primaryColor }}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subtitle / Role</label>
              <input 
                type="text" 
                value={localConfig.consultantName}
                onChange={(e) => setLocalConfig({...localConfig, consultantName: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 outline-none transition-all"
                style={{ focusRingColor: localConfig.primaryColor }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Preset Themes</label>
              <div className="flex flex-wrap gap-4">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setLocalConfig({...localConfig, primaryColor: c.primary, accentColor: c.accent})}
                    className={`group relative p-2 rounded-2xl border-2 transition-all ${localConfig.primaryColor === c.primary ? 'border-slate-900' : 'border-transparent bg-slate-50'}`}
                  >
                    <div className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                      <div className="w-1/2 h-full" style={{ backgroundColor: c.accent }}></div>
                      <div className="w-1/2 h-full" style={{ backgroundColor: c.primary }}></div>
                    </div>
                    <span className="text-[9px] font-black uppercase mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Logo Style</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setLocalConfig({...localConfig, logoMode: 'default'})}
                  className={`px-4 py-3 rounded-xl font-bold text-xs border transition-all ${localConfig.logoMode === 'default' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'}`}
                >
                  Strategic Icon
                </button>
                <button 
                  onClick={() => setLocalConfig({...localConfig, logoMode: 'text-only'})}
                  className={`px-4 py-3 rounded-xl font-bold text-xs border transition-all ${localConfig.logoMode === 'text-only' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'}`}
                >
                  Text Only
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
          <p className="text-xs text-slate-400 font-medium italic">Changes are persisted to local secure storage.</p>
          <button 
            onClick={handleSave}
            className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95 text-white`}
            style={{ backgroundColor: localConfig.primaryColor }}
          >
            {isSaved ? 'Identity Updated' : 'Apply Branding'}
          </button>
        </div>
      </div>

      <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full -mr-32 -mt-32" style={{ backgroundColor: localConfig.primaryColor }}></div>
        <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-white/40">Visual Standards Preview</h4>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: localConfig.primaryColor }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-black">{localConfig.companyName}</h2>
            <p className="text-sm opacity-50 font-bold uppercase tracking-widest">{localConfig.consultantName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
