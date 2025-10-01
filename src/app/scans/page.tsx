import { ArrowRight, CheckCircle, Clock, FileDown, XCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllScans } from "@/lib/data";

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

export default function ScansPage() {
  const allScans = getAllScans();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Scans</CardTitle>
            <CardDescription>
              Browse and manage all of your security scans.
            </CardDescription>
          </div>
          <Button disabled>
            <FileDown className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vulnerabilities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="font-medium">{scan.url}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[scan.status]}>
                      {statusIcons[scan.status]}
                      {scan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {scan.status === "Completed" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">{scan.summary.critical}</span>
                        <span className="text-orange-500 font-semibold">{scan.summary.high}</span>
                        <span className="text-yellow-500">{scan.summary.medium}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/scans/${scan.id}`}>
                        View Report <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
