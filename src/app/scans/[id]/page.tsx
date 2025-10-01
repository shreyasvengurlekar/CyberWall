'use client';

import { useState } from 'react';
import { AlertTriangle, Bug, FileDown, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

import { FindingsTable } from '@/components/scan/findings-table';
import { ScanProgress } from '@/components/scan/scan-progress';
import { SeverityBadge } from '@/components/scan/severity-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getScanById } from '@/lib/data';
import type { FindingSeverity } from '@/lib/types';

const severityIcons: Record<FindingSeverity, React.ReactElement> = {
  Critical: <ShieldAlert className="h-6 w-6 text-destructive" />,
  High: <AlertTriangle className="h-6 w-6 text-red-600" />,
  Medium: <Bug className="h-6 w-6 text-orange-500" />,
  Low: <Info className="h-6 w-6 text-yellow-400" />,
  Informational: <Info className="h-6 w-6 text-blue-500" />,
};

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  const scanData = getScanById(params.id);
  const [isScanning, setIsScanning] = useState(scanData?.status === 'In Progress');
  const [completedScan, setCompletedScan] = useState(scanData?.status === 'Completed' ? scanData : null);

  if (!scanData) {
    notFound();
  }

  const handleScanComplete = () => {
    const finalScanData = { ...scanData, status: 'Completed' as const };
    setCompletedScan(finalScanData);
    setIsScanning(false);
  };
  
  const scan = isScanning ? scanData : completedScan;
  if(!scan) {
     return <ScanProgress onComplete={handleScanComplete} />;
  }

  const summary = [
      { level: 'Critical', count: scan.summary.critical, icon: severityIcons.Critical },
      { level: 'High', count: scan.summary.high, icon: severityIcons.High },
      { level: 'Medium', count: scan.summary.medium, icon: severityIcons.Medium },
      { level: 'Low', count: scan.summary.low, icon: severityIcons.Low },
      { level: 'Informational', count: scan.summary.informational, icon: severityIcons.Informational },
  ];

  if(isScanning && !completedScan){
    return <ScanProgress onComplete={handleScanComplete} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan Report</h1>
          <p className="text-muted-foreground break-all">{scan.url}</p>
        </div>
        <Button variant="outline" disabled>
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Scan Summary</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {summary.map(item => (
                      <div key={item.level} className="flex items-center p-4 bg-secondary/50 rounded-lg">
                        <div className="mr-4">{item.icon}</div>
                        <div>
                            <p className="text-2xl font-bold">{item.count}</p>
                            <p className="text-sm text-muted-foreground">{item.level}</p>
                        </div>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Findings</CardTitle>
        </CardHeader>
        <CardContent>
            <FindingsTable findings={scan.findings} />
        </CardContent>
      </Card>
    </div>
  );
}
