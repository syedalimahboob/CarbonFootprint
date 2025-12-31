
import React, { useState } from 'react';
import { AuditResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import BenchmarkGauge from './BenchmarkGauge';

interface ResultCardProps {
  result: AuditResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [solarActive, setSolarActive] = useState(false);
  const [copiedSupplier, setCopiedSupplier] = useState<string | null>(null);

  const barData = result.dataPoints.map(dp => ({
    name: dp.source.length > 15 ? dp.source.substring(0, 15) + '...' : dp.source,
    value: dp.value,
    scope: dp.scope
  }));

  const pieData = [
    { name: 'Scope 1', value: result.scopeBreakdown?.scope1 || 0, color: '#064e3b' },
    { name: 'Scope 2', value: result.scopeBreakdown?.scope2 || 0, color: '#10b981' },
    { name: 'Scope 3', value: result.scopeBreakdown?.scope3 || 0, color: '#34d399' },
  ].filter(d => d.value > 0);

  const handleCopyEmail = (draft: string, name: string) => {
    navigator.clipboard.writeText(draft);
    setCopiedSupplier(name);
    setTimeout(() => setCopiedSupplier(null), 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
            
            <header className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">GHG Strategic Audit</h3>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{result.businessName}</h2>
                <div className="flex gap-4 mt-4">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{result.industry}</span>
                  <span className="bg-emerald-950 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{result.certificationLevel} Rank</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Session ID</p>
                <p className="text-sm font-black text-slate-800">{result.id.toUpperCase()}</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 items-center">
              <BenchmarkGauge score={result.industryBenchmark} industry={result.industry} />
              
              <div className="h-64 relative">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Carbon Distribution</p>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-800">{Math.round(result.estimatedCarbonScore)}kg</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950 text-emerald-50 p-8 rounded-[2.5rem] relative z-10 border-l-8 border-emerald-400">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-emerald-400">Advisor Insights</h4>
               <p className="text-sm leading-relaxed font-medium">"{result.summary}"</p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Supply Chain Engagement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.suppliers.map((s, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-between group hover:border-emerald-300 transition-all">
                  <div className="mb-6">
                    <h4 className="text-lg font-black text-slate-800">{s.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Pending Strategic Data</p>
                  </div>
                  <button onClick={() => handleCopyEmail(s.emailDraft, s.name)} className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${copiedSupplier === s.name ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-emerald-950 shadow-lg'}`}>
                    {copiedSupplier === s.name ? 'Request Drafted' : 'Request Carbon Report'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className={`rounded-[3rem] p-10 transition-all border shadow-sm relative overflow-hidden ${solarActive ? 'bg-emerald-950 border-emerald-800 text-white shadow-emerald-900/40' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-2xl font-black tracking-tight ${solarActive ? 'text-white' : 'text-slate-800'}`}>Solar ROI</h3>
              <button onClick={() => setSolarActive(!solarActive)} className={`w-14 h-7 rounded-full flex items-center p-1 transition-colors ${solarActive ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${solarActive ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>
            {solarActive && result.solarROI ? (
              <div className="space-y-6 animate-in zoom-in fade-in duration-500 text-center">
                <div className="p-6 bg-emerald-900/50 border border-emerald-800 rounded-[2rem]">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Estimated Payback</p>
                  <p className="text-5xl font-black text-white">{result.solarROI.paybackMonths}m</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[8px] font-bold text-emerald-400 uppercase mb-1">Install Cost</p>
                    <p className="text-lg font-black text-white">${result.solarROI.estimatedCost.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[8px] font-bold text-emerald-400 uppercase mb-1">Monthly Save</p>
                    <p className="text-lg font-black text-white">${result.solarROI.monthlySaving}</p>
                  </div>
                </div>
              </div>
            ) : <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center py-10">Toggle for Solar Analysis</p>}
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Strategic Quick Wins</h3>
            <div className="space-y-6">
              {result.quickWins.map((win, i) => (
                <div key={i} className="group relative pl-6 border-l-2 border-slate-100 hover:border-emerald-500 transition-all">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white bg-slate-100 group-hover:bg-emerald-500 transition-colors"></div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest">Financial: {win.financialSave}</span>
                    {win.taxBenefit && <span className="text-[8px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-widest">Tax Credit: Available</span>}
                  </div>
                  <h4 className="text-base font-black text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">{win.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-2">{win.description}</p>
                  {win.taxBenefit && <p className="text-[10px] text-blue-600 bg-blue-50/30 p-2 rounded-xl border border-blue-100 italic">“{win.taxBenefit}”</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
