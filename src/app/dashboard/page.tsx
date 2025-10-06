
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, ScanLine, Settings, Shield } from 'lucide-react';
import * as React from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { ScanResult } from '@/ai/flows/scanner-flow';

interface ScanDoc {
    url: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    results: ScanResult;
    scanType: string;
}

const getSeverityBadge = (score: number) => {
  if (score < 40) return 'destructive';
  if (score < 70) return 'secondary';
  if (score < 90) return 'outline';
  return 'default';
};

const getSeverityText = (score: number) => {
    if (score < 40) return 'Critical';
    if (score < 70) return 'High';
    if (score < 90) return 'Medium';
    return 'Low';
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

    React.useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);
    
    if (isUserLoading || !user || !profile || areScansLoading) {
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
                     <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-8">
                            <Skeleton className="h-36 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                        <div className="md:col-span-2">
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
                     <Button variant="outline"><Settings className='mr-2 w-4 h-4' /> Manage Account</Button>
                </div>
            </div>

            {/* Grid for cards */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile & Plan Section */}
                <div className="md:col-span-1 space-y-8">
                    {/* User Card */}
                    <Card>
                        <CardHeader className='flex-row items-center gap-4'>
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                <AvatarFallback>{user.displayName ? user.displayName.charAt(0) : 'U'}</AvatarFallback>
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
                            <CardTitle className='flex items-center gap-2'><Shield /> Plan Details</CardTitle>
                            <CardDescription>You are on the <span className='font-semibold text-primary'>Free</span> plan with unlimited scans.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2'>
                                <p className='text-sm font-medium'>Daily Scans: Unlimited</p>
                                <p className='text-sm text-muted-foreground'>You have full access to our scanning features.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Recent Scans Section */}
                <div className="md:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'><FileText /> Recent Scans</CardTitle>
                            <CardDescription>A summary of your most recent security scans.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentScans && recentScans.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-center">Findings</TableHead>
                                        <TableHead className="text-right">Risk Level</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentScans.map((scan) => (
                                        <TableRow key={scan.id}>
                                            <TableCell className="font-medium truncate max-w-xs">{scan.url}</TableCell>
                                            <TableCell>{new Date(scan.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-center">{scan.results.vulnerabilities.length}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={getSeverityBadge(scan.results.overallScore)}>{getSeverityText(scan.results.overallScore)}</Badge>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className='text-center py-10'>
                                    <p className='text-muted-foreground'>You haven't performed any scans yet.</p>
                                    <Button asChild className='mt-4'>
                                        <Link href="/scanner">Start Your First Scan</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  )
}
