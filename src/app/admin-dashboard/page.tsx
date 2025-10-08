// src/app/admin-dashboard/page.tsx
'use client';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Shield, Users, MoreHorizontal, Search, Trash2, UserCog, BarChart3, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Firebase and Real-time data hook
import { useAllUsers, AdminUser } from '@/firebase/firestore/use-all-users';
import { useFirebase } from '@/firebase/provider';
import { getFunctions, httpsCallable } from "firebase/functions";

// Charting Components
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const USERS_PER_PAGE = 10;

export default function AdminDashboardPage() {
    const { users, isLoading, error } = useAllUsers();
    const { firebaseApp } = useFirebase(); // Get the firebaseApp for functions

    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [userToDelete, setUserToDelete] = React.useState<AdminUser | null>(null);

    // --- Data Processing ---

    const filteredUsers = React.useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const chartData = React.useMemo(() => {
        const signupsByDate: { [key: string]: { date: string, count: number } } = {};
        users.forEach(user => {
            const date = new Date(user.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD for sorting
            if (!signupsByDate[date]) {
                signupsByDate[date] = { date, count: 0 };
            }
            signupsByDate[date].count++;
        });
        return Object.values(signupsByDate).sort((a, b) => a.date.localeCompare(b.date));
    }, [users]);

    // --- Action Handlers ---

    const handleDeleteClick = (user: AdminUser) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (!userToDelete || !firebaseApp) return;

        console.log(`Preparing to delete user: ${userToDelete.displayName}`);
        try {
            const functions = getFunctions(firebaseApp);
            const deleteUserCallable = httpsCallable(functions, 'deleteUser');
            
            await deleteUserCallable({ uid: userToDelete.uid });

            alert(`User ${userToDelete.displayName} has been successfully deleted.`);
        } catch (error: any) {
            console.error("Error calling deleteUser function:", error);
            alert(`Failed to delete user: ${error.message}`);
        } finally {
            setUserToDelete(null);
        }
    };

    // --- Render Logic ---

    if (isLoading) {
        return (
             <div className="container mx-auto py-10 px-4 md:px-6">
                <div className="grid gap-8">
                    <Skeleton className="h-9 w-64" />
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
        return <div className="container mx-auto py-10 text-destructive">Error: {error.message}. Please check Firestore security rules and network connection.</div>;
    }

    const totalUsers = users.length;
    const verifiedUsers = users.filter(user => user.emailVerified).length;
    const newUsersThisWeek = users.filter(user => new Date(user.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

    return (
        <>
            <div className="container mx-auto py-10 px-4 md:px-6">
                <div className="grid gap-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">Monitor users and manage application data in real-time.</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalUsers}</div>
                                <p className="text-xs text-muted-foreground">{`+${newUsersThisWeek} new this week`}</p>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Email Verified</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{`${((verifiedUsers / totalUsers) * 100 || 0).toFixed(0)}%`}</div>
                                <p className="text-xs text-muted-foreground">{`${verifiedUsers} of ${totalUsers} users`}</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Live</div>
                                <p className="text-xs text-muted-foreground">Monitoring real-time updates</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart3/> User Sign-ups</CardTitle>
                            <CardDescription>Number of new users registered per day.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{ count: { label: "Users", color: "hsl(var(--primary))" } }} className="w-full h-[250px]">
                                <BarChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Users Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                             <div className="relative mt-2">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="w-full pl-8"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead className='hidden md:table-cell'>Email</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className='hidden md:table-cell text-center'>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedUsers.map((user) => (
                                        <TableRow key={user.uid}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                                        <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.displayName || 'No Name'}</div>
                                                        <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>{user.email}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                                                    {user.emailVerified ? 'Verified' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell text-center'>
                                                <Badge variant={user.email === 'shreyasvengurlekar2004@gmail.com' ? 'destructive' : 'outline'}>
                                                    {user.email === 'shreyasvengurlekar2004@gmail.com' ? 'Admin' : 'User'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem disabled>
                                                            <UserCog className="mr-2 h-4 w-4" />
                                                            <span>Edit Role</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleDeleteClick(user)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete User</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{paginatedUsers.length}</strong> of <strong>{filteredUsers.length}</strong> users.
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}>Next</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Alert Dialog for Delete Confirmation */}
            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account for <span className='font-semibold'>{userToDelete?.displayName}</span> and remove all their data from the servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Yes, delete user</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}