
import React from 'react';
import { AuditResult } from '../types';

interface HistoryProps {
  history: AuditResult[];
  onView: (result: AuditResult) => void;
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, onView, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800">No audits found</h3>
        <p className="text-slate-500 mt-2">Start your first sustainability audit on the dashboard.</p>
      </div>
    );
  }

  const totalCarbon = history.reduce((acc, curr) => acc + curr.estimatedCarbonScore, 0).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Reported Footprint</p>
          <p className="text-3xl font-bold">{totalCarbon} <span className="text-lg font-normal text-emerald-400">kg CO₂e</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Audits Completed</p>
          <p className="text-3xl font-bold text-slate-800">{history.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Average Score</p>
          <p className="text-3xl font-bold text-slate-800">{(Number(totalCarbon) / history.length).toFixed(1)} <span className="text-lg font-normal text-slate-400">kg</span></p>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Business / Entity</th>
              <th className="px-6 py-4">Est. Footprint</th>
              <th className="px-6 py-4">Quick Wins</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((result) => (
              <tr key={result.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      {new Date(result.auditDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(result.auditDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-800">{result.businessName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{result.estimatedCarbonScore.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">kg CO₂e</span>
                    {result.trend === 'down' ? (
                      <span className="text-emerald-500 flex items-center text-xs font-bold">
                        ↓
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center text-xs font-bold">
                        ↑
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {result.quickWins.slice(0, 3).map((win, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${
                          win.impact === 'High' ? 'bg-emerald-500' : 
                          win.impact === 'Medium' ? 'bg-amber-400' : 'bg-slate-300'
                        }`}
                        title={win.title}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => onView(result)}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => onDelete(result.id)}
                    className="text-slate-300 hover:text-rose-500 font-semibold text-sm transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
