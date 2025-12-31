
export type CarbonScope = 'Scope 1' | 'Scope 2' | 'Scope 3';

export interface DataPoint {
  source: string;
  value: number;
  unit: string;
  description: string;
  scope: CarbonScope;
}

export interface QuickWin {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  category: 'Energy' | 'Logistics' | 'Waste' | 'Procurement';
  financialSave: string; // Estimated monthly or yearly savings
}

export interface Supplier {
  name: string;
  emailDraft: string;
}

export interface AuditResult {
  id: string;
  userId: string;
  businessName: string;
  industry: string;
  auditDate: string;
  estimatedCarbonScore: number; // kg CO2e
  industryBenchmark: number; // 0 (Leader) to 100 (High Emitter)
  trend: 'up' | 'down' | 'neutral';
  dataPoints: DataPoint[];
  quickWins: QuickWin[];
  suppliers: Supplier[];
  summary: string;
  scopeBreakdown: {
    scope1: number;
    scope2: number;
    scope3: number;
  };
  solarROI?: {
    paybackMonths: number;
    estimatedCost: number;
    monthlySaving: number;
    solarPotential: 'High' | 'Medium' | 'Low';
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface MapResource {
  title: string;
  uri: string;
  type: string;
}

export type AppView = 'dashboard' | 'upload' | 'history' | 'map' | 'audit-details';

export interface MonthlyEmissions {
  month: string;
  value: number;
}
