
import React, { useState, useEffect } from 'react';

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Extracting document text...",
    "Identifying energy consumption...",
    "Calculating carbon equivalence...",
    "Generating quick wins for your SME...",
    "Finalizing your sustainability report..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative w-32 h-32 mb-8">
        {/* Animated Rings */}
        <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        
        {/* Central Icon */}
        <div className="absolute inset-4 bg-emerald-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-emerald-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing your data</h2>
      <p className="text-slate-500 font-medium h-6">{messages[messageIndex]}</p>
      
      <div className="mt-12 max-w-sm">
        <div className="bg-slate-100 rounded-2xl p-6 text-left">
          <div className="flex gap-4">
             <div className="shrink-0">
               <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">i</div>
             </div>
             <div>
               <h4 className="font-bold text-slate-800 text-sm mb-1">Did you know?</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                 Small businesses account for up to 50% of commercial greenhouse gas emissions. You're taking a massive step towards a greener future.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
