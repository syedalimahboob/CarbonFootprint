
export type CarbonScope = 'Scope 1' | 'Scope 2' | 'Scope 3';
export type CertificationLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

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
  financialSave: string;
  taxBenefit?: string;
}

export interface Supplier {
  name: string;
  emailDraft: string;
}

export interface WhiteLabelConfig {
  companyName: string;
  primaryColor: string;
  accentColor: string;
  logoMode: 'default' | 'text-only';
  consultantName: string;
}

export interface AuditResult {
  id: string;
  userId: string;
  businessName: string;
  industry: string;
  auditDate: string;
  estimatedCarbonScore: number;
  industryBenchmark: number;
  certificationLevel: CertificationLevel;
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

export type AppView = 'dashboard' | 'upload' | 'history' | 'map' | 'audit-details' | 'branding';

export interface MonthlyEmissions {
  month: string;
  value: number;
}
