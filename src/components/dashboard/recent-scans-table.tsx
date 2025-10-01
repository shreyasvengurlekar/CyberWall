import { ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllScans } from '@/lib/data';
import type { Scan } from '@/lib/types';

const statusIcons = {
  Completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  'In Progress': <Clock className="h-4 w-4 text-yellow-500 animate-spin" />,
  Failed: <XCircle className="h-4 w-4 text-red-500" />,
  Queued: <Clock className="h-4 w-4 text-gray-500" />,
};

const statusColors = {
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  Failed: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  Queued: 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300',
};


export function RecentScansTable() {
    const recentScans = getAllScans().slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>
            An overview of your most recent scans.
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
            <Link href="/scans">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentScans.map((scan) => (
              <TableRow key={scan.id}>
                <TableCell className="font-medium">{scan.url}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[scan.status]}>
                    {statusIcons[scan.status]}
                    {scan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {new Date(scan.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/scans/${scan.id}`}>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
