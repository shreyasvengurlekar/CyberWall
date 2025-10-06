
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

const formSchema = z
  .object({
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export default function SignupPage() {
  const router = useRouter();
  const { user, signUp } = useUser();
  const { showAlert } = useAlert();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await signUp(values.email, values.password);
        showAlert({
            title: 'Account Created!',
            message: 'Please check your email to verify your account before logging in.',
        });
        form.reset();
    } catch (error: any) {
        console.error(error.code, error.message);
        let message = 'An unexpected error occurred. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
            message = 'This email is already in use. Please try another email or log in.';
        } else if (error.code === 'auth/weak-password') {
            message = 'The password is too weak. Please choose a stronger password.';
        }
        showAlert({
            title: 'Signup Failed',
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
            <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
            <CardDescription>Sign up for unlimited scans and full reports.</CardDescription>
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Log In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
