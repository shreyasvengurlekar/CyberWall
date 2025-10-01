import {
  Activity,
  AlertTriangle,
  FileText,
  ShieldCheck,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Scan } from '@/lib/types';

export function OverviewStats({ scans }: { scans: Scan[] }) {
  const totalScans = scans.length;
  const totalVulnerabilities = scans.reduce(
    (acc, scan) =>
      acc +
      scan.summary.critical +
      scan.summary.high +
      scan.summary.medium +
      scan.summary.low,
    0
  );
  const highSeverity = scans.reduce(
    (acc, scan) => acc + scan.summary.critical + scan.summary.high,
    0
  );
  const completedScans = scans.filter(
    (scan) => scan.status === 'Completed'
  ).length;

  const stats = [
    {
      title: 'Total Scans',
      value: totalScans,
      icon: FileText,
      description: 'All time',
    },
    {
      title: 'Vulnerabilities',
      value: totalVulnerabilities,
      icon: AlertTriangle,
      description: 'Across all scans',
    },
    {
      title: 'High Severity',
      value: highSeverity,
      icon: Activity,
      description: 'Critical and High',
    },
    {
      title: 'Completed Scans',
      value: completedScans,
      icon: ShieldCheck,
      description: `${Math.round((completedScans / totalScans) * 100)}% success rate`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
