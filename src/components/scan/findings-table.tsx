'use client';

import { useState } from 'react';
import { ChevronDown, ListFilter, FileDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Finding, FindingSeverity } from '@/lib/types';
import { SeverityBadge } from './severity-badge';

const severities: FindingSeverity[] = ['Critical', 'High', 'Medium', 'Low', 'Informational'];

export function FindingsTable({ findings }: { findings: Finding[] }) {
  const [severityFilters, setSeverityFilters] = useState<Set<FindingSeverity>>(new Set(severities));

  const toggleSeverityFilter = (severity: FindingSeverity) => {
    setSeverityFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(severity)) {
        newSet.delete(severity);
      } else {
        newSet.add(severity);
      }
      return newSet;
    });
  };

  const filteredFindings = findings.filter(finding => severityFilters.has(finding.severity));

  return (
    <div>
        <div className="flex items-center gap-2 mb-4">
             <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter Severity
                </span>
                 <ChevronDown className="h-3.5 w-3.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by severity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {severities.map(severity => (
                <DropdownMenuCheckboxItem
                    key={severity}
                    checked={severityFilters.has(severity)}
                    onCheckedChange={() => toggleSeverityFilter(severity)}
                >
                    {severity}
                </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="gap-1" disabled>
                <FileDown className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
        </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Severity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">CWE</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFindings.length > 0 ? (
              filteredFindings.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell>
                    <SeverityBadge severity={finding.severity} />
                  </TableCell>
                  <TableCell className="font-medium">{finding.description}</TableCell>
                  <TableCell className="text-muted-foreground">{finding.cwe}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-xs">{finding.location}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No findings match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
