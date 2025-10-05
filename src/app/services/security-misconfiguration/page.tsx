
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
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

export default function SecurityMisconfigurationPage() {
  const { isLoggedIn } = useUser();
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <ShieldAlert className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Security Misconfiguration</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about Security Misconfiguration vulnerabilities and how our scanner helps identify them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is Security Misconfiguration?</h2>
          <p>
            Security misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            Our scanner checks for a wide array of common misconfigurations across your technology stack, from server settings to cloud service permissions, providing a comprehensive view of your security posture.
          </p>
        </div>
        <div className='border-t pt-6 flex flex-col items-center text-center gap-4'>
            {isLoggedIn ? (
                 <>
                    <h3 className='text-xl font-semibold'>Ready to find misconfigurations?</h3>
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
