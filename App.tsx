
import React, { useState, useEffect } from 'react';
import { AppView, AuditResult, User, WhiteLabelConfig } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadCenter from './components/UploadCenter';
import History from './components/History';
import ResultCard from './components/ResultCard';
import AuthScreen from './components/AuthScreen';
import SustainabilityMap from './components/SustainabilityMap';
import BrandingSettings from './components/BrandingSettings';

const DEFAULT_BRANDING: WhiteLabelConfig = {
  companyName: 'EcoTrack',
  primaryColor: '#059669', // emerald-600
  accentColor: '#064e3b', // emerald-950
  logoMode: 'default',
  consultantName: 'Strategic Partner'
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [history, setHistory] = useState<AuditResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AuditResult | null>(null);
  const [branding, setBranding] = useState<WhiteLabelConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecotrack_current_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedBranding = localStorage.getItem('ecotrack_branding');
    if (savedBranding) setBranding(JSON.parse(savedBranding));
  }, []);

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem('ecotrack_history');
      if (saved) {
        try {
          const allHistory = JSON.parse(saved);
          setHistory(allHistory.filter((h: AuditResult) => h.userId === currentUser.id));
        } catch (e) {
          console.error("Failed to load history", e);
        }
      }
    }
  }, [currentUser]);

  const updateBranding = (newBranding: WhiteLabelConfig) => {
    setBranding(newBranding);
    localStorage.setItem('ecotrack_branding', JSON.stringify(newBranding));
  };

  const handleAuditComplete = (result: AuditResult) => {
    const saved = localStorage.getItem('ecotrack_history');
    const allHistory = saved ? JSON.parse(saved) : [];
    const updatedHistory = [result, ...allHistory];
    localStorage.setItem('ecotrack_history', JSON.stringify(updatedHistory));
    setHistory(prev => [result, ...prev]);
  };

  const handleAuth = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ecotrack_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ecotrack_current_user');
    setCurrentView('dashboard');
  };

  const handleDeleteResult = (id: string) => {
    const saved = localStorage.getItem('ecotrack_history');
    if (saved) {
      const allHistory = JSON.parse(saved);
      const updatedHistory = allHistory.filter((h: AuditResult) => h.id !== id);
      localStorage.setItem('ecotrack_history', JSON.stringify(updatedHistory));
      setHistory(prev => prev.filter(r => r.id !== id));
      if (selectedResult?.id === id) setSelectedResult(null);
    }
  };

  if (!currentUser) return <AuthScreen onAuth={handleAuth} defaultBranding={branding} />;

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard history={history} branding={branding} />;
      case 'upload':
        return <UploadCenter onAuditComplete={handleAuditComplete} branding={branding} />;
      case 'history':
        return <History history={history} onView={(r) => { setSelectedResult(r); setCurrentView('audit-details'); }} onDelete={handleDeleteResult} branding={branding} />;
      case 'map':
        return <SustainabilityMap />;
      case 'branding':
        return <BrandingSettings config={branding} onSave={updateBranding} />;
      case 'audit-details':
        return selectedResult ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentView('history')}
                className="hover:opacity-70 font-bold flex items-center gap-2 transition-all"
                style={{ color: branding.primaryColor }}
              >
                ← Back to Archive
              </button>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Report: {selectedResult.id}</span>
            </div>
            <ResultCard result={selectedResult} branding={branding} />
          </div>
        ) : <Dashboard history={history} branding={branding} />;
      default:
        return <Dashboard history={history} branding={branding} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfdfc] text-slate-900 transition-colors duration-500">
      <Sidebar 
        activeView={currentView} 
        onViewChange={setCurrentView} 
        userName={currentUser.name}
        onLogout={handleLogout}
        branding={branding}
      />

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="animate-in slide-in-from-left-4 duration-500">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter" style={{ color: branding.accentColor }}>
              {currentView === 'dashboard' && 'Performance Hub'}
              {currentView === 'upload' && 'Strategic Audit'}
              {currentView === 'history' && 'Audit Archive'}
              {currentView === 'map' && 'Reduction Hub'}
              {currentView === 'branding' && 'Platform Settings'}
              {currentView === 'audit-details' && 'Impact Analysis'}
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              {currentView === 'dashboard' && `Monitoring ${branding.companyName}'s real-time milestones.`}
              {currentView === 'upload' && 'Intelligent operational analysis for strategic growth.'}
              {currentView === 'history' && 'Historical sustainability and financial performance review.'}
              {currentView === 'map' && 'Connect with verified regional mitigation partners.'}
              {currentView === 'branding' && 'Customize platform identity and visual standards.'}
              {currentView === 'audit-details' && `Strategic overview for ${selectedResult?.businessName}.`}
            </p>
          </div>
          <div className="hidden md:flex bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm items-center gap-3">
             <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: branding.primaryColor }}></div>
             <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{currentUser.name}</span>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
