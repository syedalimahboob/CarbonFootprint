
import React, { useState, useEffect } from 'react';
import { AppView, AuditResult, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadCenter from './components/UploadCenter';
import History from './components/History';
import ResultCard from './components/ResultCard';
import AuthScreen from './components/AuthScreen';
import SustainabilityMap from './components/SustainabilityMap';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [history, setHistory] = useState<AuditResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecotrack_current_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
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

  if (!currentUser) return <AuthScreen onAuth={handleAuth} />;

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard history={history} />;
      case 'upload':
        return <UploadCenter onAuditComplete={handleAuditComplete} />;
      case 'history':
        return <History history={history} onView={(r) => { setSelectedResult(r); setCurrentView('audit-details'); }} onDelete={handleDeleteResult} />;
      case 'map':
        return <SustainabilityMap />;
      case 'audit-details':
        return selectedResult ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentView('history')}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-2"
              >
                ← Back to History
              </button>
              <span className="text-slate-400 text-xs font-bold uppercase">Report Reference: {selectedResult.id}</span>
            </div>
            <ResultCard result={selectedResult} />
          </div>
        ) : <Dashboard history={history} />;
      default:
        return <Dashboard history={history} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfdfc] text-slate-900">
      <Sidebar 
        activeView={currentView} 
        onViewChange={setCurrentView} 
        userName={currentUser.name}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="animate-in slide-in-from-left-4 duration-500">
            <h1 className="text-4xl font-black text-emerald-950 tracking-tighter">
              {currentView === 'dashboard' && 'Environmental Dashboard'}
              {currentView === 'upload' && 'Upload Center'}
              {currentView === 'history' && 'Audit Archive'}
              {currentView === 'map' && 'Carbon Reduction Hub'}
              {currentView === 'audit-details' && 'Detailed Impact Report'}
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              {currentView === 'dashboard' && 'Monitoring your real-time carbon reduction milestones.'}
              {currentView === 'upload' && 'Intelligent document analysis for SME sustainability.'}
              {currentView === 'history' && 'Reviewing your historical sustainability performance.'}
              {currentView === 'map' && 'Connect with verified agencies to move from Critical to Safe zones.'}
              {currentView === 'audit-details' && `In-depth analysis for ${selectedResult?.businessName}.`}
            </p>
          </div>
          <div className="hidden md:flex bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm items-center gap-3 animate-in slide-in-from-right-4 duration-500">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{currentUser.name}</span>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
