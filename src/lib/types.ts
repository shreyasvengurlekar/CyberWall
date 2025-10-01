export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type Finding = {
  id: string;
  cwe: string;
  severity: FindingSeverity;
  description: string;
  remediation: string;
  location: string;
};

export type Scan = {
  id: string;
  url: string;
  status: 'Completed' | 'In Progress' | 'Failed' | 'Queued';
  createdAt: string;
  completedAt?: string;
  findings: Finding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
};
