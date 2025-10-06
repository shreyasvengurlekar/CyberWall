
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, ScanLine, Settings, Shield, Download, BarChart2 } from 'lucide-react';
import * as React from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { ScanResult } from '@/ai/flows/scanner-flow';
import { generatePdf } from '@/lib/pdf-generator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

interface ScanDoc {
    id: string;
    url: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    results: ScanResult;
    scanType: string;
}

const getSeverityBadgeVariant = (score: number) => {
  if (score < 40) return 'destructive';
  if (score < 70) return 'secondary';
  return 'default';
};

const getSeverityText = (score: number) => {
    if (score < 40) return 'Critical';
    if (score < 70) return 'High';
    if (score < 90) return 'Medium';
    return 'Low';
}

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
}

export default function DashboardPage() {
    const { user, profile, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const router = useRouter();

    const scansQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        const scansCollection = collection(firestore, `users/${user.uid}/scans`);
        return query(scansCollection, orderBy('createdAt', 'desc'), limit(10));
    }, [user, firestore]);

    const { data: recentScans, isLoading: areScansLoading } = useCollection<ScanDoc>(scansQuery);
    
    const chartData = React.useMemo(() => {
        if (!recentScans) return [];
        return recentScans.slice().reverse().map(scan => ({
            name: new Date(scan.createdAt.seconds * 1000).toLocaleDateString(),
            score: scan.results.overallScore,
            url: new URL(scan.url).hostname,
        }));
    }, [recentScans]);

    React.useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const handleDownloadReport = (scan: ScanDoc) => {
        generatePdf(scan.url, scan.results);
    };
    
    if (isUserLoading || !user || !profile) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-6">
                <div className="grid gap-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <Skeleton className="h-9 w-48" />
                            <Skeleton className="h-5 w-64 mt-2" />
                        </div>
                        <div className='flex gap-2'>
                           <Skeleton className="h-10 w-36" />
                           <Skeleton className="h-10 w-36" />
                        </div>
                    </div>
                     <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-8">
                            <Skeleton className="h-36 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-80 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="grid gap-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user.displayName || 'User'}!</p>
                </div>
                <div className='flex gap-2'>
                    <Button asChild>
                        <Link href="/scanner"><ScanLine className='mr-2 w-4 h-4' /> Start New Scan</Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/settings"><Settings className='mr-2 w-4 h-4' /> Manage Account</Link>
                     </Button>
                </div>
            </div>

            {/* Grid for cards */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & Plan */}
                <div className="lg:col-span-1 space-y-8">
                    {/* User Card */}
                    <Card>
                        <CardHeader className='flex-row items-center gap-4'>
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{user.displayName || 'User'}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </div>
                        </CardHeader>
                         <CardFooter>
                            <p className={`text-sm ${user.emailVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                                {user.emailVerified ? 'Email Verified' : 'Email Not Verified'}
                            </p>
                        </CardFooter>
                    </Card>

                    {/* Plan Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'><Shield /> Current Plan</CardTitle>
                            <CardDescription>You are on the <span className='font-semibold text-primary'>Free</span> plan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2'>
                                <p className='text-sm font-medium'>Unlimited Scans</p>
                                <p className='text-sm text-muted-foreground'>You have full access to our scanning features.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column: Chart & Scans */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Analytics Chart */}
                     {recentScans && recentScans.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><BarChart2 /> Security Score Trend</CardTitle>
                                <CardDescription>Overall security scores of your last 10 scans.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="w-full h-[250px]">
                                    <BarChart accessibilityLayer data={chartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                     )}

                     {/* Recent Scans Table */}
                     <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'><FileText /> Recent Scans</CardTitle>
                            <CardDescription>A summary of your most recent security scans.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {areScansLoading && (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                                </div>
                            )}
                            {!areScansLoading && recentScans && recentScans.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='w-2/5'>URL</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-center">Findings</TableHead>
                                            <TableHead className="text-center">Risk</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentScans.map((scan) => (
                                        <TableRow key={scan.id} onClick={() => router.push(`/dashboard/scan/${scan.id}`)} className="cursor-pointer hover:bg-muted/50">
                                            <TableCell className="font-medium truncate max-w-xs">{scan.url}</TableCell>
                                            <TableCell>{new Date(scan.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-center">{scan.results.vulnerabilities.length}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={getSeverityBadgeVariant(scan.results.overallScore)}>{getSeverityText(scan.results.overallScore)}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={(e) => { e.stopPropagation(); handleDownloadReport(scan); }}
                                                    aria-label="Download report"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                !areScansLoading && (
                                    <div className='text-center py-10'>
                                        <p className='text-muted-foreground'>You haven't performed any scans yet.</p>
                                        <Button asChild className='mt-4'>
                                            <Link href="/scanner">Start Your First Scan</Link>
                                        </Button>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  )
}

    