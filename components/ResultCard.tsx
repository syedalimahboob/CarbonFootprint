
import React, { useState } from 'react';
import { AuditResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import BenchmarkGauge from './BenchmarkGauge';

interface ResultCardProps {
  result: AuditResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [solarEnabled, setSolarEnabled] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const barData = result.dataPoints.map(dp => ({
    name: dp.source.length > 15 ? dp.source.substring(0, 15) + '...' : dp.source,
    value: dp.value,
    fullSource: dp.source,
    scope: dp.scope
  }));

  const pieData = [
    { name: 'Scope 1 (Direct)', value: result.scopeBreakdown?.scope1 || 0, color: '#064e3b' },
    { name: 'Scope 2 (Energy)', value: result.scopeBreakdown?.scope2 || 0, color: '#10b981' },
    { name: 'Scope 3 (Supply)', value: result.scopeBreakdown?.scope3 || 0, color: '#34d399' },
  ].filter(d => d.value > 0);

  const SCOPE_COLORS: Record<string, string> = {
    'Scope 1': '#064e3b',
    'Scope 2': '#10b981',
    'Scope 3': '#34d399'
  };

  const copyEmail = (draft: string, supplierName: string) => {
    navigator.clipboard.writeText(draft);
    setCopiedEmail(supplierName);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analytics Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Strategic Audit Breakdown</h3>
                <h2 className="text-3xl font-black text-emerald-950 leading-tight">{result.businessName}</h2>
                <p className="text-emerald-600 text-xs font-bold uppercase mt-1">{result.industry}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest">
                  Strategic Advisor Analysis
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-bold">{new Date(result.auditDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 mb-8 italic text-slate-600 leading-relaxed border-l-4 border-emerald-500">
              "{result.summary}"
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-center">
              <div className="bg-slate-50/30 p-6 rounded-[2rem] border border-slate-100 flex justify-center">
                <BenchmarkGauge score={result.industryBenchmark} industry={result.industry} />
              </div>

              <div className="h-64 flex flex-col items-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 w-full">Scope Distribution</p>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.dataPoints.map((dp, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                      dp.scope === 'Scope 1' ? 'bg-emerald-800 text-white' : 
                      dp.scope === 'Scope 2' ? 'bg-emerald-500 text-white' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {dp.scope}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{dp.unit}</span>
                  </div>
                  <div className="text-sm font-black text-slate-800 truncate">{dp.source}</div>
                  <div className="text-lg font-black text-emerald-600 mt-1">{dp.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Supply Chain Emailer */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Supply Chain Emailer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.suppliers.length > 0 ? result.suppliers.map((s, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-emerald-200 transition-all">
                  <div>
                    <h4 className="font-black text-slate-800">{s.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Pending Carbon Data</p>
                  </div>
                  <button 
                    onClick={() => copyEmail(s.emailDraft, s.name)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      copiedEmail === s.name ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-emerald-900'
                    }`}
                  >
                    {copiedEmail === s.name ? 'Copied!' : 'Request Data'}
                  </button>
                </div>
              )) : (
                <p className="text-sm text-slate-400 italic col-span-2">No specific suppliers detected in this document.</p>
              )}
            </div>
          </div>
        </div>

        {/* Strategic Roadmap Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-emerald-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.25em] mb-4 relative z-10">Footprint Analysis</h3>
            <div className="flex items-baseline gap-2 mb-2 relative z-10">
              <span className="text-5xl font-black">{result.estimatedCarbonScore.toLocaleString()}</span>
              <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest">kg CO₂e</span>
            </div>
            <p className="text-xs text-emerald-200/60 leading-relaxed relative z-10 font-medium">
              You are performing better than {100 - result.industryBenchmark}% of peers in the {result.industry} sector.
            </p>
          </div>

          {/* Solar ROI Calculator */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Solar ROI</h3>
              <button 
                onClick={() => setSolarEnabled(!solarEnabled)}
                className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${solarEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${solarEnabled ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>

            {solarEnabled && result.solarROI ? (
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Estimated Payback</p>
                  <p className="text-4xl font-black text-emerald-950">{result.solarROI.paybackMonths} <span className="text-sm">Months</span></p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Monthly Saving</p>
                    <p className="text-sm font-black text-slate-800">${result.solarROI.monthlySaving}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">System Cost</p>
                    <p className="text-sm font-black text-slate-800">${result.solarROI.estimatedCost.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic text-center">Calculated based on local utility rates and sun density grounding.</p>
              </div>
            ) : (
              <div className="text-center py-8 opacity-50">
                <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Toggle Solar Analysis</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">Strategic Quick Wins</h3>
            <div className="space-y-6">
              {result.quickWins.map((win, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-slate-100 hover:border-emerald-500 transition-all group">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white bg-slate-200 group-hover:bg-emerald-500 transition-colors"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 uppercase tracking-widest">
                      SAVE: {win.financialSave}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-800 mb-1">{win.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-1">{win.description}</p>
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
