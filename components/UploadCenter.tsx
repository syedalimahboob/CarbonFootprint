
import React, { useState, useRef, useEffect } from 'react';
import { runSustainabilityAudit } from '../services/geminiService';
import { AuditResult } from '../types';

interface UploadCenterProps {
  onAuditComplete: (result: AuditResult) => void;
}

const UploadCenter: React.FC<UploadCenterProps> = ({ onAuditComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastProcessed, setLastProcessed] = useState<AuditResult | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    "Consulting GHG Protocols",
    "Extracting Audit Metrics",
    "Industry Peer Benchmarking",
    "Calculating Solar Payback",
    "Drafting Strategic Wins"
  ];

  const ALLOWED_TYPES = [
    'application/pdf',
    'text/csv',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => console.warn("Location context unavailable for solar analysis.")
    );
  }, []);

  useEffect(() => {
    let interval: any;
    if (isUploading) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          const next = prev + Math.random() * 12;
          setActiveStep(Math.min(Math.floor((next / 100) * steps.length), steps.length - 1));
          return next;
        });
      }, 700);
    } else {
      setProgress(0);
      setActiveStep(0);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  const validateAndUpload = async (file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.csv')) {
      setError("Strategic Advisor: Please upload a PDF, CSV, or Image format.");
      return;
    }

    const userStr = localStorage.getItem('ecotrack_current_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result?.toString().split(',')[1];
        if (!base64Data) throw new Error("Failed to process data stream.");

        try {
          const result = await runSustainabilityAudit(base64Data, file.type, user.id, location);
          setProgress(100);
          setActiveStep(steps.length - 1);
          setTimeout(() => {
            setLastProcessed(result);
            onAuditComplete(result);
            setIsUploading(false);
          }, 600);
        } catch (err: any) {
          setError(err.message || "Strategic Analysis failed. Check document clarity.");
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to start strategic session.");
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700">
      {!isUploading ? (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative bg-white border-2 border-dashed rounded-[3rem] p-20 text-center transition-all cursor-pointer overflow-hidden shadow-sm ${
            error ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && validateAndUpload(e.target.files[0])}
            className="hidden" 
            accept=".pdf,.csv,image/*"
          />
          
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-emerald-100/50 group-hover:scale-110 group-hover:rotate-3 transition-all">
            <svg className={`w-12 h-12 transition-colors ${error ? 'text-rose-400' : 'text-emerald-400 group-hover:text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h3 className="text-3xl font-black text-slate-800 mb-2">
            Strategic Sustainability Audit
          </h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed font-medium">
            Upload your operational data to unlock peer benchmarking, solar ROI projections, and supplier management.
          </p>
          <button className={`${error ? 'bg-slate-800' : 'bg-emerald-900'} text-white px-12 py-5 rounded-2xl font-black transition-all hover:shadow-xl active:scale-95 text-lg shadow-lg shadow-emerald-950/20`}>
            Consult Advisor
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-200 p-16 shadow-xl text-center">
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <div className="text-left">
                <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-1">EcoTrack Consultant</p>
                <h4 className="text-2xl font-black text-slate-800">{steps[activeStep]}</h4>
              </div>
              <span className="text-4xl font-black text-emerald-950">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden p-1 border border-slate-200 shadow-inner">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <div key={i} className={`flex flex-col items-center gap-3 transition-opacity ${i <= activeStep ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i < activeStep ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : i === activeStep ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                  {i < activeStep ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  ) : i + 1}
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500 leading-tight">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-5 bg-white border border-rose-100 rounded-[2rem] flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0 font-black italic">!</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">Advisor Note</p>
            <p className="text-xs text-slate-500">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default UploadCenter;
