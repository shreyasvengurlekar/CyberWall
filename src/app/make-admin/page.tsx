'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAlert } from '@/context/alert-provider';

// This is a server action that will run on the backend.
import { setAdminClaim } from './actions';

export default function MakeAdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleMakeAdmin = async () => {
    if (!user) {
      showAlert({ title: 'Error', message: 'You must be logged in.', variant: 'destructive'});
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await setAdminClaim(user.uid);
      if (result.success) {
        setIsSuccess(true);
        showAlert({ 
            title: 'Success!', 
            message: 'You are now an admin. You will be logged out to refresh your permissions. Please log back in.',
            onConfirm: () => router.push('/login')
        });
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error: any) {
      showAlert({ title: 'Operation Failed', message: error.message, variant: 'destructive'});
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return <div className="container text-center py-20">Loading...</div>;
  }

  if (isSuccess) {
    return (
        <div className="container mx-auto max-w-lg py-20 md:py-32 px-4 text-center">
            <Card>
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-4 w-fit mb-4">
                        <ShieldCheck className="w-16 h-16 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Success!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You have been granted admin privileges. You will be redirected to the login page shortly.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-20 md:py-32 px-4 text-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Become an Admin</CardTitle>
          <CardDescription>
            This is a one-time setup step to grant your account admin privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <p>You are logged in as:</p>
              <p className="font-bold text-primary">{user.email}</p>
              <p className='text-sm text-muted-foreground'>Click the button below to elevate your account to an admin. You will be logged out and asked to log in again.</p>
              <Button onClick={handleMakeAdmin} disabled={isLoading} size="lg">
                {isLoading ? 'Processing...' : 'Make Me Admin'}
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
                <div className="mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full p-4 w-fit mb-4">
                    <LogIn className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-muted-foreground">You must be logged in to perform this action.</p>
                <Button asChild>
                    <Link href="/login?redirect=/make-admin">Log In</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
