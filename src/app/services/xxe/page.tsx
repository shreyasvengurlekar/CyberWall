
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Server } from 'lucide-react';
import * as React from 'react';
import { useUser } from '@/firebase/auth/use-user';

export default function XxePage() {
  const { user } = useUser();
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Server className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">XML External Entity (XXE)</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about XML External Entity (XXE) vulnerabilities and how our scanner helps identify them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is XXE?</h2>
          <p>
            An XML External Entity attack is a type of attack against an application that parses XML input. This attack occurs when XML input containing a reference to an external entity is processed by a weakly configured XML parser.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            Our scanner checks how your application processes XML data, identifying parsers that are vulnerable to XXE. We provide guidance on configuring your parsers securely to prevent these attacks.
          </p>
        </div>
        <div className='border-t pt-6 flex flex-col items-center text-center gap-4'>
            <h3 className='text-xl font-semibold'>Ready to find XXE vulnerabilities?</h3>
            <p className='text-muted-foreground'>Scan your application now to check for this specific issue.</p>
            <div className='flex gap-4'>
              {user ? (
                <Button asChild>
                    <Link href="/scanner?vulnerability=xxe">Scan Now</Link>
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

    