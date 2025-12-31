
import React from 'react';

interface BenchmarkGaugeProps {
  score: number; // 0 (Leader) to 100 (High Emitter)
  industry: string;
}

const BenchmarkGauge: React.FC<BenchmarkGaugeProps> = ({ score, industry }) => {
  const size = 220;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
        <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
          <path
            d={`M ${strokeWidth/2},${size/2} A ${radius},${radius} 0 0,1 ${size - strokeWidth/2},${size/2}`}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="benchmarkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path
            d={`M ${strokeWidth/2},${size/2} A ${radius},${radius} 0 0,1 ${size - strokeWidth/2},${size/2}`}
            fill="none"
            stroke="url(#benchmarkGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          
          <line
            x1={size / 2}
            y1={size / 2}
            x2={size / 2 + (radius - 10) * Math.cos((score / 100 * Math.PI) - Math.PI)}
            y2={size / 2 + (radius - 10) * Math.sin((score / 100 * Math.PI) - Math.PI)}
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle cx={size / 2} cy={size / 2} r="8" fill="#0f172a" />
        </svg>

        <div className="absolute bottom-4 left-0 w-full text-center">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{industry}</p>
          <p className="text-xl font-black text-slate-800">{100 - score}% Ranking</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 w-full mt-4">
        <span className="text-[9px] font-black text-emerald-600 uppercase text-left">Leader</span>
        <span className="text-[9px] font-black text-slate-300 uppercase text-center">Avg</span>
        <span className="text-[9px] font-black text-rose-600 uppercase text-right">Emitter</span>
      </div>
    </div>
  );
};

export default BenchmarkGauge;
