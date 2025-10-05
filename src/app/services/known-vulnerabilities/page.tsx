
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Workflow } from 'lucide-react';
import * as React from 'react';
import { useUser } from '@/hooks/use-user';

export default function KnownVulnerabilitiesPage() {
  const { user } = useUser();
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Workflow className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Using Components with Known Vulnerabilities</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about the risks of using components with known vulnerabilities and how our scanner helps.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is the Risk?</h2>
          <p>
            Components, such as libraries, frameworks, and other software modules, run with the same privileges as the application. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            Our scanner maintains an up-to-date database of known vulnerabilities. We scan your project's dependencies and flag any components that have reported security issues, allowing you to update them before they can be exploited.
          </p>
        </div>
        <div className='border-t pt-6 flex flex-col items-center text-center gap-4'>
            <h3 className='text-xl font-semibold'>Ready to find outdated components?</h3>
            <p className='text-muted-foreground'>Scan your application now to check for this specific issue.</p>
            <div className='flex gap-4'>
              {user ? (
                <Button asChild>
                    <Link href="/scanner">Scan Now</Link>
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
