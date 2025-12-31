
import React from 'react';
import { AuditResult, MonthlyEmissions } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import BenchmarkGauge from './BenchmarkGauge';

interface DashboardProps {
  history: AuditResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  
  const chartData: MonthlyEmissions[] = Array.from({ length: 6 }, (_, i) => {
    const idx = (currentMonthIdx - (5 - i) + 12) % 12;
    const monthAudits = history.filter(h => new Date(h.auditDate).getMonth() === idx);
    const value = monthAudits.reduce((acc, curr) => acc + curr.estimatedCarbonScore, 0);
    return {
      month: months[idx],
      value: value || (history.length === 0 ? Math.random() * 300 + 100 : 0)
    };
  });

  const totalCarbon = history.reduce((acc, curr) => acc + curr.estimatedCarbonScore, 0);
  const latestAudit = history[0];

  const certificationColors = {
    'Bronze': 'text-amber-700 bg-amber-50 border-amber-200',
    'Silver': 'text-slate-500 bg-slate-50 border-slate-200',
    'Gold': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Platinum': 'text-indigo-600 bg-indigo-50 border-indigo-200'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Historical Footprint</p>
          <div className="flex items-baseline gap-1.5 relative z-10">
            <h3 className="text-3xl font-black text-slate-800">{totalCarbon.toLocaleString()}</h3>
            <span className="text-slate-400 font-bold text-[10px]">kg CO₂e</span>
          </div>
        </div>

        <div className="bg-emerald-950 rounded-[2rem] p-8 shadow-xl shadow-emerald-200 lg:col-span-2 flex flex-col justify-center overflow-hidden">
           <div className="flex items-center justify-between">
             <div className="relative z-10">
               <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Industry Benchmark</p>
               <h3 className="text-2xl font-black text-white">{latestAudit?.industry || 'Consultant View'}</h3>
               {latestAudit && (
                 <div className={`mt-3 inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase border ${certificationColors[latestAudit.certificationLevel]}`}>
                   {latestAudit.certificationLevel} Certified
                 </div>
               )}
             </div>
             <div className="scale-75 origin-right">
               {latestAudit ? (
                 <BenchmarkGauge score={latestAudit.industryBenchmark} industry="" />
               ) : (
                 <div className="w-40 h-20 bg-emerald-900/30 rounded-t-full border-t border-emerald-800 flex items-center justify-center text-emerald-700 font-bold text-[10px] uppercase">Data Required</div>
               )}
             </div>
           </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Segment Focus</p>
          <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100">
            <div className="bg-emerald-900" style={{ width: `30%` }} title="Scope 1"></div>
            <div className="bg-emerald-500" style={{ width: `45%` }} title="Scope 2"></div>
            <div className="bg-emerald-200" style={{ width: `25%` }} title="Scope 3"></div>
          </div>
          <div className="flex justify-between mt-3">
             <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-slate-400 uppercase">S1</span>
               <span className="text-[10px] font-bold text-slate-700">30%</span>
             </div>
             <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-slate-400 uppercase">S2</span>
               <span className="text-[10px] font-bold text-slate-700">45%</span>
             </div>
             <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-slate-400 uppercase">S3</span>
               <span className="text-[10px] font-bold text-slate-700">25%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">Carbon Trends</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verified Strategic Path</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#064e3b' : '#10b981'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-emerald-50/30 rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-950 tracking-tight leading-none">Advisor Recommendations</h3>
              <p className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest">Immediate Savings</p>
            </div>
          </div>
          
          <div className="space-y-4 flex-1">
            {latestAudit ? (
              latestAudit.quickWins.map((win, i) => (
                <div key={i} className="group p-5 bg-white rounded-3xl border border-emerald-50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 uppercase tracking-widest">
                      ${win.financialSave} Savings
                    </span>
                  </div>
                  <h4 className="font-black text-slate-800 text-sm mb-1 leading-tight">{win.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed truncate">{win.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-16 flex flex-col items-center">
                <p className="text-slate-400 text-xs font-bold leading-relaxed px-4 italic">
                  Upload an audit document to unlock your strategic roadmap.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
