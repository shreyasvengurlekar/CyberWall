
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Code } from 'lucide-react';
import * as React from 'react';
import { useUser } from '@/firebase/auth/use-user';

export default function XssPage() {
  const { user } = useUser();
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Code className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Cross-Site Scripting (XSS)</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Detailed information about Cross-Site Scripting (XSS) vulnerabilities, how they work, and how CyberWall helps you detect and remediate them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is XSS?</h2>
          <p>
            Cross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            Our scanner analyzes how your application handles user input and identifies where it might be vulnerable to script injection. We provide clear examples and remediation steps to eliminate XSS risks.
          </p>
        </div>
        <div className='border-t pt-6 flex flex-col items-center text-center gap-4'>
            <h3 className='text-xl font-semibold'>Ready to find XSS vulnerabilities?</h3>
            <p className='text-muted-foreground'>Scan your application now to check for this specific issue.</p>
            <div className='flex gap-4'>
              {user ? (
                <Button asChild>
                    <Link href="/scanner?vulnerability=xss">Scan Now</Link>
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

    