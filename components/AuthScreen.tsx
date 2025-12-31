
import React, { useState } from 'react';
import { User, WhiteLabelConfig } from '../types';

interface AuthScreenProps {
  onAuth: (user: User) => void;
  defaultBranding: WhiteLabelConfig;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth, defaultBranding }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const storedUsers = JSON.parse(localStorage.getItem('ecotrack_users') || '[]');
    if (isLogin) {
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);
      if (user) onAuth({ id: user.id, email: user.email, name: user.name });
      else setError('Invalid credentials.');
    } else {
      if (storedUsers.some((u: any) => u.email === email)) {
        setError('User already exists.');
        return;
      }
      const newUser = { id: Math.random().toString(36).substr(2, 9), email, password, name };
      storedUsers.push(newUser);
      localStorage.setItem('ecotrack_users', JSON.stringify(storedUsers));
      onAuth({ id: newUser.id, email: newUser.email, name: newUser.name });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-1000" style={{ backgroundColor: defaultBranding.accentColor }}>
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl animate-in zoom-in fade-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 float-animation shadow-xl" style={{ backgroundColor: defaultBranding.primaryColor }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{defaultBranding.companyName}</h1>
          <p className="text-slate-500 mt-2 font-medium">{defaultBranding.consultantName}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Corporate Identity</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 outline-none transition-all" style={{ focusRingColor: defaultBranding.primaryColor }} placeholder="Business Entity Name" />
            </div>
          )}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Secure Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 outline-none transition-all" style={{ focusRingColor: defaultBranding.primaryColor }} placeholder="admin@domain.com" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Strategic Key</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 outline-none transition-all" style={{ focusRingColor: defaultBranding.primaryColor }} placeholder="••••••••" />
          </div>
          {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}
          <button 
            className="w-full text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:opacity-90 transition-all mt-4 active:scale-95"
            style={{ backgroundColor: defaultBranding.primaryColor }}
          >
            {isLogin ? 'Enter Workspace' : 'Initialize Platform'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">
          {isLogin ? "Join the Strategic Network" : "Return to Access"}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
