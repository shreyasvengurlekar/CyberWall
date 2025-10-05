
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import * as React from 'react';
import { useUser } from '@/firebase/auth/use-user';

export default function InsecureDeserializationPage() {
  const { user } = useUser();
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <FileText className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Insecure Deserialization</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about Insecure Deserialization vulnerabilities and how our scanner helps identify them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is Insecure Deserialization?</h2>
          <p>
            Insecure deserialization often leads to remote code execution. Even if deserialization flaws do not result in remote code execution, they can be used to perform attacks, including replay attacks, injection attacks, and privilege escalation attacks.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            CyberWall examines how your application handles serialized data objects, identifying patterns that could be exploited by attackers. We provide insights on how to safely handle data serialization and deserialization.
          </p>
        </div>
        <div className='border-t pt-6 flex flex-col items-center text-center gap-4'>
            <h3 className='text-xl font-semibold'>Ready to find deserialization flaws?</h3>
            <p className='text-muted-foreground'>Scan your application now to check for this specific issue.</p>
            <div className='flex gap-4'>
              {user ? (
                <Button asChild>
                    <Link href="/scanner?vulnerability=insecure-deserialization">Scan Now</Link>
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

    