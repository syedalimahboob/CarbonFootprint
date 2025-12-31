
import React, { useState, useRef, useEffect } from 'react';
import { runSustainabilityAudit } from '../services/geminiService';
import { AuditResult, WhiteLabelConfig } from '../types';

interface UploadCenterProps {
  onAuditComplete: (result: AuditResult) => void;
  branding: WhiteLabelConfig;
}

const UploadCenter: React.FC<UploadCenterProps> = ({ onAuditComplete, branding }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    "Consulting GHG Protocols",
    "Processing Data Stream",
    "Tabular Data Extraction",
    "Calculating Projections",
    "Finalizing Strategic Wins"
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
      () => console.warn("Location context unavailable.")
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
      setError(`Consultant Note: Please upload PDF, CSV, or visual evidence.`);
      return;
    }

    const userStr = localStorage.getItem('ecotrack_current_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        let filePayload: string = '';
        const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv';

        if (isCSV) {
          filePayload = e.target?.result?.toString() || '';
        } else {
          filePayload = e.target?.result?.toString().split(',')[1] || '';
        }

        if (!filePayload) throw new Error("Data capture failed.");

        try {
          const result = await runSustainabilityAudit(
            filePayload, 
            isCSV ? 'text/csv' : file.type, 
            user.id, 
            location
          );
          
          setProgress(100);
          setActiveStep(steps.length - 1);
          setTimeout(() => {
            onAuditComplete(result);
            setIsUploading(false);
          }, 800);
        } catch (err: any) {
          setError(err.message || "Strategic Analysis failed. Check file clarity.");
          setIsUploading(false);
        }
      };

      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setError("Failed to initiate strategic session.");
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
            error ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200 hover:bg-slate-50'
          }`}
          style={!error ? { borderColor: `${branding.primaryColor}33` } : {}}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && validateAndUpload(e.target.files[0])}
            className="hidden" 
            accept=".pdf,.csv,image/*"
          />
          
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all shadow-inner">
            <svg className="w-12 h-12" style={{ color: error ? '#ef4444' : branding.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <h3 className="text-3xl font-black text-slate-900 mb-2">
            Professional Sustainability Audit
          </h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed font-medium">
            Upload CSV logs, utility PDFs, or bill photos to initiate your Net Zero roadmap.
          </p>
          <button 
            className="text-white px-12 py-5 rounded-2xl font-black transition-all hover:shadow-2xl active:scale-95 text-lg shadow-xl"
            style={{ backgroundColor: branding.primaryColor }}
          >
            Select Evidence
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-200 p-16 shadow-xl text-center">
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <div className="text-left">
                <p className="font-black text-xs uppercase tracking-widest mb-1" style={{ color: branding.primaryColor }}>{branding.companyName} Analysis</p>
                <h4 className="text-2xl font-black text-slate-800">{steps[activeStep]}</h4>
              </div>
              <span className="text-4xl font-black text-slate-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden p-1 border border-slate-200 shadow-inner">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: branding.primaryColor, boxShadow: `0 0 15px ${branding.primaryColor}66` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <div key={i} className={`flex flex-col items-center gap-3 transition-opacity ${i <= activeStep ? 'opacity-100' : 'opacity-30'}`}>
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i < activeStep ? 'text-white shadow-lg' : i === activeStep ? 'animate-pulse' : 'bg-slate-100 text-slate-400'}`}
                  style={i <= activeStep ? { backgroundColor: i < activeStep ? branding.primaryColor : `${branding.primaryColor}22`, color: i < activeStep ? '#fff' : branding.primaryColor } : {}}
                >
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
            <p className="text-sm font-bold text-slate-800">Strategic Alert</p>
            <p className="text-xs text-slate-500">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default UploadCenter;
