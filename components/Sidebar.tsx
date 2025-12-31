
import React, { useState } from 'react';
import { AppView, WhiteLabelConfig } from '../types';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  userName: string;
  onLogout: () => void;
  branding: WhiteLabelConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, userName, onLogout, branding }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'upload' as AppView, label: 'Strategic Audit', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
    { id: 'history' as AppView, label: 'Audit Archive', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'map' as AppView, label: 'Reduction Hub', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'branding' as AppView, label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const EnhancedLogo = () => (
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 hover:rotate-6" 
      style={{ backgroundColor: branding.primaryColor }}
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
      </svg>
    </div>
  );

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-50 md:hidden p-2 text-white rounded-lg shadow-lg"
        style={{ backgroundColor: branding.accentColor }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 text-white transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col border-r border-white/5`}
        style={{ backgroundColor: branding.accentColor }}
      >
        <div className="p-8 flex items-center gap-3">
          {branding.logoMode === 'default' && <EnhancedLogo />}
          <div className="overflow-hidden">
            <h2 className="text-xl font-black tracking-tight truncate">{branding.companyName}</h2>
            <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest truncate">{branding.consultantName}</p>
          </div>
        </div>

        <nav className="mt-8 flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id || (activeView === 'audit-details' && item.id === 'history');
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
                  isActive 
                    ? 'bg-white/10 text-white border-white/20 shadow-xl' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white border-transparent'
                }`}
                style={isActive ? { borderLeft: `4px solid ${branding.primaryColor}` } : {}}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner" style={{ backgroundColor: branding.primaryColor }}>
                {userName.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{userName}</p>
                <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Active SME</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-black text-white/40 hover:text-white transition-colors border border-white/10 rounded-xl hover:bg-white/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
