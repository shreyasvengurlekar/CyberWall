
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DatabaseZap } from 'lucide-react';
import * as React from 'react';
import { useUser } from '@/firebase/auth/use-user';

export default function SqlInjectionPage() {
  const { user } = useUser();
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <DatabaseZap className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">SQL Injection</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Detailed information about SQL Injection (SQLi) vulnerabilities, how they work, and how CyberWall helps you detect and remediate them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is SQL Injection?</h2>
          <p>
            SQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            Our scanner intelligently probes your application's input fields and parameters to identify potential SQLi vulnerabilities. We provide detailed reports on the findings and offer AI-powered guidance to help your developers patch the security holes effectively.
          </p>
        </div>
        
        <div className='border-t pt-6 flex flex-col items-center text-center gap-4'>
            <h3 className='text-xl font-semibold'>Ready to find SQLi vulnerabilities?</h3>
            <p className='text-muted-foreground'>Scan your application now to check for this specific issue.</p>
            <div className='flex gap-4'>
              {user ? (
                <Button asChild>
                    <Link href="/scanner?vulnerability=sql-injection">Scan Now</Link>
                </Button>
              ) : (
                <Button asChild>
                    <Link href="/login">Log In to Scan</Link>
                </Button>
              )}
                 <Button asChild variant='outline'>
                     <Link href="/#pricing">Upgrade to Pro for AI Fixes</Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

    