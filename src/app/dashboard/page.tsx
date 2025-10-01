import { OverviewStats } from '@/components/dashboard/overview-stats';
import { RecentScansTable } from '@/components/dashboard/recent-scans-table';
import { ScanForm } from '@/components/dashboard/scan-form';
import { getAllScans } from '@/lib/data';

export default function DashboardPage() {
  const scans = getAllScans();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <OverviewStats scans={scans} />

      <div className="grid gap-6 md:grid-cols-2">
        <ScanForm />
        <RecentScansTable />
      </div>
    </div>
  );
}
