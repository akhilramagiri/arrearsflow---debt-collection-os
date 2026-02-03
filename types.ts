
export enum BucketId {
  B1 = 1,
  B2 = 2,
  B3 = 3,
  B4 = 4,
  B5 = 5,
  B6 = 6,
  B7 = 7
}

export interface BucketRule {
  id: BucketId;
  name: string;
  monthlyRange: [number, number];
  meaning: string;
  actions: string[];
  isCritical?: boolean;
}

export interface Account {
  id: string;
  customerName: string;
  loanAmount: number;
  arrearsAmount: number;
  dpd: number;
  bucket: BucketId;
  lastContactDate?: string;
  status: 'active' | 'pured' | 'written-off' | 'legal';
  riskScore: number;
  ptpDate?: string; // Promise to Pay
}

export interface ActionLog {
  id: string;
  accountId: string;
  timestamp: string;
  actionType: string;
  performer: string;
  notes: string;
  complianceFlag: boolean;
}

export interface PortfolioStats {
  totalArrears: number;
  rollRate: number; // % moving up buckets
  cureRate: number; // % moving back to B0/Current
  riskExposure: number; // Total in B4+
}
