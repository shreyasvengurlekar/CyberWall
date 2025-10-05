
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import * as React from 'react';

// Mock user state - in a real app, this would come from an auth context
const useUser = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    // Simulate login for demo
    React.useEffect(() => {
        const handleLogin = () => setIsLoggedIn(true);
        const handleLogout = () => setIsLoggedIn(false);
        window.addEventListener('login', handleLogin);
        window.addEventListener('logout', handleLogout);

        if (typeof window !== 'undefined' && window.location.pathname.includes('/dashboard')) {
            setIsLoggedIn(true);
        }

        return () => {
            window.removeEventListener('login', handleLogin);
            window.removeEventListener('logout', handleLogout);
        };
    }, []);
    
    return { isLoggedIn };
}

export default function BrokenAccessControlPage() {
  const { isLoggedIn } = useUser();
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Lock className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Broken Access Control</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about Broken Access Control vulnerabilities and how our scanner helps identify them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is Broken Access Control?</h2>
          <p>
            Restrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access unauthorized functionality and/or data, such as access other users' accounts, view sensitive files, modify other users' data, change access rights, etc.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            CyberWall tests your application's endpoints to ensure that users can only access the data and functions they are authorized for, helping you enforce the principle of least privilege.
          </p>
        </div>
        <div className='border-t pt-6 flex flex-col items-center text-center gap-4'>
            {isLoggedIn ? (
                 <>
                    <h3 className='text-xl font-semibold'>Ready to find access control flaws?</h3>
                    <p className='text-muted-foreground'>Scan your application now to check for this specific issue.</p>
                    <div className='flex gap-4'>
                        <Button asChild>
                            <Link href="/scanner">Scan Now</Link>
                        </Button>
                        <Button asChild variant='outline'>
                             <Link href="/#pricing">Upgrade to Pro for AI Fixes</Link>
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <h3 className='text-xl font-semibold'>Log in to Access Scanner</h3>
                    <p className='text-muted-foreground'>Create an account or log in to use our scanner and check your application for vulnerabilities.</p>
                    <div className='flex gap-4'>
                        <Button asChild>
                            <Link href="/login">Log In to Scan</Link>
                        </Button>
                         <Button asChild variant="outline">
                            <Link href="/services">Back to Services</Link>
                        </Button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
}
