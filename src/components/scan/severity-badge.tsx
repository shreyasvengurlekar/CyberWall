import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { FindingSeverity } from '@/lib/types';

const severityConfig: Record<FindingSeverity, string> = {
  Critical: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  High: 'bg-red-600 text-white hover:bg-red-600/90',
  Medium: 'bg-orange-500 text-white hover:bg-orange-500/90',
  Low: 'bg-yellow-400 text-gray-900 hover:bg-yellow-400/90',
  Informational: 'bg-blue-500 text-white hover:bg-blue-500/90',
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: FindingSeverity;
  className?: string;
}) {
  return (
    <Badge className={cn(severityConfig[severity], 'border-none', className)}>
      {severity}
    </Badge>
  );
}
