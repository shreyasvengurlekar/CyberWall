
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useUser } from '@/firebase/auth/use-user';
import * as React from 'react';
import { useAlert } from '@/context/alert-provider';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn } = useUser();
  const { showAlert } = useAlert();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await signIn(values.email, values.password);
        showAlert({
            title: 'Login Successful!',
            message: 'Redirecting to your dashboard...',
            onConfirm: () => router.push('/dashboard'),
        });
        form.reset();
    } catch (error: any) {
        console.error(error);
        let message = 'An unexpected error occurred. Please try again.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            message = 'Invalid email or password. Please try again.';
        } else if (error.code === 'auth/user-disabled') {
            message = 'This account has been disabled.';
        } else if (error.code === 'auth/too-many-requests') {
            message = 'Too many login attempts. Please try again later.';
        } else if (error.code === 'auth/email-not-verified' || (error.message && error.message.includes('auth/email-not-verified'))) {
            message = 'Please verify your email before logging in. Check your inbox for a verification link.';
        }
        
        showAlert({
            title: 'Login Failed',
            message,
            variant: 'destructive',
        });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="shadow-2xl transition-all hover:shadow-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Log In</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
