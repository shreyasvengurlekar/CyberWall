
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import * as React from 'react';
import { useUser } from '@/hooks/use-user';

export default function BrokenAuthenticationPage() {
  const { user } = useUser();
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <KeyRound className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Broken Authentication</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about Broken Authentication vulnerabilities and how our scanner helps identify them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is Broken Authentication?</h2>
          <p>
            Application functions related to authentication and session management are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users' identities temporarily or permanently.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            CyberWall tests for common authentication flaws like weak password policies, insecure session handling, and predictable session tokens. We help you enforce strong authentication and session management to protect user accounts.
          </p>
        </div>
        <div className='border-t pt-6 flex flex-col items-center text-center gap-4'>
            <h3 className='text-xl font-semibold'>Ready to find authentication flaws?</h3>
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
