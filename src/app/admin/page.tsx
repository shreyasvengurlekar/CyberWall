
'use client';

import * as React from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Scan, FileText } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface UserDoc {
    uid: string;
    displayName: string;
    email: string;
    plan: string;
}

interface ScanDoc {
    id: string;
    url: string;
    userId: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    results: {
        vulnerabilities: any[];
    };
}


export default function AdminDashboardPage() {
    const { user, isAdmin, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const router = useRouter();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), orderBy('displayName'));
    }, [firestore]);

    const allScansQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // Using a collection group query to get scans from all users
        const scansCollectionGroup = collectionGroup(firestore, 'scans');
        return query(scansCollectionGroup, orderBy('createdAt', 'desc'), limit(20));
    }, [firestore]);

    const { data: users, isLoading: areUsersLoading } = useCollection<UserDoc>(usersQuery);
    const { data: allScans, isLoading: areScansLoading } = useCollection<ScanDoc>(allScansQuery);

    React.useEffect(() => {
        if (!isUserLoading && !isAdmin) {
            router.push('/dashboard');
        }
    }, [user, isAdmin, isUserLoading, router]);

    if (isUserLoading || !isAdmin) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-6">
                 <div className="space-y-8">
                    <Skeleton className="h-10 w-64" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                    </div>
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }
    
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of system activity.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users ? users.length : '...'}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scans (All Time)</CardTitle>
                        <Scan className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* Note: This is an estimation based on the limited query. For a true total, a counter would be needed. */}
                        <div className="text-2xl font-bold">{allScans ? allScans.length : '...'}</div>
                        <p className="text-xs text-muted-foreground">Showing last 20 scans</p>
                    </CardContent>
                </Card>
            </div>
            
            {/* Recent Scans Table */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><FileText /> All Recent Scans</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>URL</TableHead>
                                <TableHead>User Email</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Findings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areScansLoading && [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                                </TableRow>
                            ))}
                            {allScans && allScans.map((scan) => {
                                // Find the user who performed the scan
                                const scanUser = users?.find(u => u.uid === scan.userId.split('/')[1]);
                                return (
                                <TableRow key={scan.id}>
                                    <TableCell className="font-medium max-w-sm truncate">{scan.url}</TableCell>
                                    <TableCell>{scanUser?.email || 'N/A'}</TableCell>
                                    <TableCell>{new Date(scan.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-center">{scan.results.vulnerabilities.length}</TableCell>
                                </TableRow>
                            )})}
                             {!areScansLoading && allScans?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No scans found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Users /> Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areUsersLoading && [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={3}><Skeleton className="h-8 w-full" /></TableCell>
                                </TableRow>
                            ))}
                            {users && users.map((u) => (
                                <TableRow key={u.uid}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{u.displayName ? u.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{u.displayName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.plan === 'free' ? 'secondary' : 'default'}>
                                            {u.plan.charAt(0).toUpperCase() + u.plan.slice(1)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!areUsersLoading && users?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">No users found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
