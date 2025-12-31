
import React from 'react';

interface BenchmarkGaugeProps {
  score: number; // 0 (Leader) to 100 (High Emitter)
  industry: string;
}

const BenchmarkGauge: React.FC<BenchmarkGaugeProps> = ({ score, industry }) => {
  // SVG constants
  const size = 200;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Semi-circle
  const rotation = -180; // Start from left
  
  // Progress is 0-100, we map it to the semi-circle
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
          {/* Background Track */}
          <path
            d={`M ${strokeWidth/2},${size/2} A ${radius},${radius} 0 0,1 ${size - strokeWidth/2},${size/2}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* Colored Gauge */}
          <path
            d={`M ${strokeWidth/2},${size/2} A ${radius},${radius} 0 0,1 ${size - strokeWidth/2},${size/2}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Needle */}
          <line
            x1={size / 2}
            y1={size / 2}
            x2={size / 2 + (radius - 5) * Math.cos((score / 100 * Math.PI) - Math.PI)}
            y2={size / 2 + (radius - 5) * Math.sin((score / 100 * Math.PI) - Math.PI)}
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle cx={size / 2} cy={size / 2} r="5" fill="#1e293b" />
        </svg>

        <div className="absolute bottom-0 left-0 w-full text-center">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{industry} Benchmark</p>
        </div>
      </div>
      
      <div className="flex justify-between w-full mt-4 px-2">
        <span className="text-[9px] font-bold text-emerald-600 uppercase">Leader</span>
        <span className="text-sm font-black text-slate-800">{100 - score}% Ranking</span>
        <span className="text-[9px] font-bold text-rose-600 uppercase">Emitter</span>
      </div>
    </div>
  );
};

export default BenchmarkGauge;
