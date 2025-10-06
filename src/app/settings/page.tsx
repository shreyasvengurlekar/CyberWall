
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as React from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/alert-provider';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User, KeyRound, Trash2 } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export default function SettingsPage() {
  const { user, profile, isUserLoading, updateDisplayName, updateUserPassword, deleteUserAccount } = useUser();
  const router = useRouter();
  const { showAlert } = useAlert();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (user && profile) {
      profileForm.setValue('displayName', user.displayName || '');
    }
  }, [user, profile, isUserLoading, router, profileForm]);

  const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
    try {
        await updateDisplayName(values.displayName);
        showAlert({ title: 'Success', message: 'Profile updated successfully!' });
    } catch (err: any) {
        showAlert({ title: 'Error', message: `Failed to update profile: ${err.message}`, variant: 'destructive' });
    }
  };

  const handlePasswordUpdate = async (values: z.infer<typeof passwordSchema>) => {
    try {
        await updateUserPassword(values.newPassword);
        showAlert({ title: 'Success', message: 'Password updated successfully!' });
        passwordForm.reset();
    } catch (err: any) {
        showAlert({ title: 'Error', message: `Failed to update password: ${err.message}`, variant: 'destructive' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
        await deleteUserAccount();
        showAlert({ 
            title: 'Account Deleted', 
            message: 'Your account has been successfully deleted.', 
            onConfirm: () => router.push('/') 
        });
    } catch (err: any) {
        showAlert({ title: 'Error', message: `Failed to delete account: ${err.message}`, variant: 'destructive' });
    }
  };

  if (isUserLoading || !user || !profile) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 mt-2" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, password, and account settings.</p>
      </div>

      {/* Profile Information */}
      <section className="grid md:grid-cols-3 gap-8 border-t pt-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><User /> Profile Information</h2>
          <p className="text-muted-foreground mt-2">Update your personal details.</p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" value={user?.email || ''} disabled />
                    <p className="text-xs text-muted-foreground pt-1">Email address cannot be changed.</p>
                  </FormItem>
                  <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Change Password */}
      <section className="grid md:grid-cols-3 gap-8 border-t pt-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><KeyRound /> Change Password</h2>
          <p className="text-muted-foreground mt-2">Update your password regularly to keep your account secure.</p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                    {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Delete Account */}
      <section className="grid md:grid-cols-3 gap-8 border-t pt-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-destructive"><Trash2 /> Delete Account</h2>
          <p className="text-muted-foreground mt-2">Permanently delete your account and all associated data. This action cannot be undone.</p>
        </div>
        <div className="md:col-span-2">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Once you delete your account, you will lose all data associated with it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete My Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
