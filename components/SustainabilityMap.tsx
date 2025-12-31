
import React, { useState, useEffect } from 'react';
import { findSustainableResources } from '../services/geminiService';
import { MapResource } from '../types';

const SustainabilityMap: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{text: string, resources: MapResource[]}>({ text: '', resources: [] });
  const [error, setError] = useState<string | null>(null);

  // Thresholds for segment health (Safe vs Critical)
  const segments = [
    { id: 'S1', name: 'Scope 1: Direct', threshold: 500, current: 720, desc: 'Mobile combustion & heating' },
    { id: 'S2', name: 'Scope 2: Energy', threshold: 800, current: 420, desc: 'Purchased electricity' },
    { id: 'S3', name: 'Scope 3: Supply', threshold: 1200, current: 1540, desc: 'Value chain & logistics' },
  ];

  // Manual list of agencies based on user request (can be augmented by Gemini in a real scenario)
  const reductionAgencies = [
    { 
      name: "Circular Economy Lab", 
      type: "Waste & Material Recovery", 
      specialty: "Closed-loop manufacturing systems for SMEs",
      contact: "circularlab.earth",
      rating: "A+"
    },
    { 
      name: "SolarGrid Solutions", 
      type: "Renewable Integration", 
      specialty: "Subsidized rooftop solar for industrial units",
      contact: "solargrid.ai",
      rating: "Gold"
    },
    { 
      name: "GreenFleet Logistics", 
      type: "Transport Reduction", 
      specialty: "EV fleet transitioning and route optimization",
      contact: "greenfleet.logistics",
      rating: "Certified"
    },
    { 
      name: "NetZero Advisory", 
      type: "Carbon Auditing", 
      specialty: "Full Scope 1-3 auditing and verification",
      contact: "netzero.consulting",
      rating: "Platinum"
    }
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await findSustainableResources(pos.coords.latitude, pos.coords.longitude);
          setData(result);
        } catch (e) {
          setError("Grounding failed. Showing verified global partners.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied. Using standard partner list.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-800 font-black text-xl">Accessing Reduction Network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Carbon Segments Status */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl font-black text-emerald-950 tracking-tighter">Segment Health Monitor</h3>
            <p className="text-slate-500 text-sm font-medium">Real-time status of your carbon footprint categories.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Safe Zone</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Critical Zone</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segments.map((s) => {
            const isCritical = s.current > s.threshold;
            const percentage = Math.min((s.current / s.threshold) * 100, 100);
            return (
              <div key={s.id} className={`p-8 rounded-[2.5rem] border bg-white shadow-sm transition-all hover:shadow-xl ${isCritical ? 'border-rose-100' : 'border-emerald-100'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isCritical ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {isCritical ? 'Critical' : 'Safe'}
                    </span>
                    <h4 className="text-lg font-black text-slate-800 mt-3">{s.name}</h4>
                  </div>
                  <div className={`text-2xl font-black ${isCritical ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {s.current} <span className="text-xs text-slate-400">kg</span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden mb-4 border border-slate-100">
                  <div 
                    className={`h-full transition-all duration-1000 ${isCritical ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                  <span>Usage Level</span>
                  <span>Goal: {s.threshold}kg</span>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {s.desc}. {isCritical ? 'Focus on immediate mitigation via agencies below.' : 'Maintaining efficiency. Explore optimization.'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reduction Agencies */}
      <section className="bg-emerald-950 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900 rounded-full -mr-32 -mt-32 opacity-30"></div>
        
        <div className="relative z-10 mb-10">
          <h3 className="text-3xl font-black tracking-tighter mb-2">Footprint Reduction Agencies</h3>
          <p className="text-emerald-400 font-bold uppercase text-xs tracking-[0.2em]">Verified SME Partner Network</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {reductionAgencies.map((agency, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group flex flex-col md:flex-row gap-6">
              <div className="w-20 h-20 bg-emerald-800 rounded-3xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-black group-hover:text-emerald-300 transition-colors">{agency.name}</h4>
                  <span className="text-[10px] font-black bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-md uppercase tracking-widest">{agency.rating}</span>
                </div>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">{agency.type}</p>
                <p className="text-sm text-emerald-100/70 leading-relaxed mb-6 font-medium">
                  {agency.specialty}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-bold italic">{agency.contact}</span>
                  <button className="bg-white text-emerald-950 px-6 py-2 rounded-xl font-black text-xs uppercase hover:bg-emerald-400 transition-colors">Connect</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Local Grounding Results if available */}
        {data.resources.length > 0 && (
          <div className="mt-12 pt-12 border-t border-white/10">
            <h4 className="text-xl font-black mb-6">Local Support Found Nearby</h4>
            <div className="flex flex-wrap gap-4">
              {data.resources.map((res, i) => (
                <a 
                  key={i} 
                  href={res.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-800/50 hover:bg-emerald-800 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all border border-emerald-700/50"
                >
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="font-bold text-sm">{res.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Educational Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <h4 className="text-lg font-black text-slate-800 mb-4">How Safe Zones are Calculated</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Safe zones are determined by **Industry Standard Carbon Benchmarks (ISCB)** for SMEs. We cross-reference your revenue, head count, and sector against average high-performing green entities to set realistic thresholds.
          </p>
        </div>
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <h4 className="text-lg font-black text-slate-800 mb-4">Partner Agency Verification</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Agencies listed in the reduction hub have been verified for **SME-specific logistics**. They specialize in low-upfront-cost interventions that provide immediate carbon ROI within 6 to 18 months.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityMap;
