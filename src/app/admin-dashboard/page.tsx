'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Users, Mail, CheckCircle, Clock } from 'lucide-react';
import { useAllUsers } from '@/firebase/firestore/use-all-users';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
    const { users, isLoading, error } = useAllUsers();

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-6">
                <div className="grid gap-8">
                    <Skeleton className="h-9 w-48" />
                    <div className="grid md:grid-cols-3 gap-8">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container mx-auto py-10">Error: {error.message}</div>;
    }

    const totalUsers = users.length;
    const verifiedUsers = users.filter(user => user.emailVerified).length;
    
    // Placeholder for active users logic
    const activeUsers = users.length; 

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="grid gap-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">Manage users and monitor site activity.</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsers}</div>
                            <p className="text-xs text-muted-foreground">All registered users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{verifiedUsers}</div>
                            <p className="text-xs text-muted-foreground">{((verifiedUsers / totalUsers) * 100).toFixed(0)}% of users are verified</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeUsers}</div>
                            <p className="text-xs text-muted-foreground">Users active in the last 24h</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>A list of all users in the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-center">Email Verified</TableHead>
                                    <TableHead className="text-center">Role</TableHead>
                                    <TableHead className="text-right">Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.uid}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                                    <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                                </Avatar>
                                                <span>{user.displayName || 'No Name'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                                                {user.emailVerified ? 'Yes' : 'No'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                             <Badge variant={user.email === 'shreyasvengurlekar2004@gmail.com' ? 'destructive' : 'outline'}>
                                                {user.email === 'shreyasvengurlekar2004@gmail.com' ? 'Admin' : 'User'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}