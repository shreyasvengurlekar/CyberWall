
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { ScanLine, ShieldCheck, ShieldAlert, AlertTriangle, Info, Bot, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Mock user state - in a real app, this would come from an auth provider
const useUser = () => {
    const [user, setUser] = React.useState<{isLoggedIn: boolean, name: string} | null>(null);
    const [scansToday, setScansToday] = React.useState(0);

    // Simulate login state change
    const login = () => {
        setUser({ isLoggedIn: true, name: 'Demo User' });
        setScansToday(0); // Reset scans on login for demo
    }
    const logout = () => {
        setUser(null);
        setScansToday(0); // Reset scans on logout for demo
    }

    const recordScan = () => {
        setScansToday(prev => prev + 1);
    }
    
    return { user, login, logout, scansToday, recordScan };
}

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL (e.g., https://example.com)' }),
});

type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';

const getSeverityBadge = (severity: 'Critical' | 'High' | 'Medium' | 'Low') => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-500 text-white';
    case 'High':
      return 'bg-orange-500 text-white';
    case 'Medium':
      return 'bg-yellow-500 text-black';
    case 'Low':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const mockVulnerabilities = {
    guest: [
        {
            title: 'Cross-Site Scripting (XSS)',
            severity: 'High',
            description: 'A potential reflected XSS vulnerability was found in a search parameter. Malicious scripts could be injected.',
            remediation: 'Sanitize user input to prevent script execution. A Pro plan provides AI-generated code snippets for your specific framework.'
        },
        {
            title: 'Insecure Security Headers',
            severity: 'Medium',
            description: 'The Content-Security-Policy (CSP) header is missing.',
            remediation: 'Implement a strict CSP to mitigate various attacks. Upgrade to see a recommended policy.'
        },
    ],
    loggedIn: [
        {
            title: 'Cross-Site Scripting (XSS)',
            severity: 'High',
            description: 'A potential reflected XSS vulnerability was found in a search parameter. Malicious scripts could be injected.',
            remediation: 'Sanitize all user-provided input on the server-side before rendering it back to the page. Use libraries like DOMPurify on the client-side.'
        },
        {
            title: 'Insecure Security Headers',
            severity: 'Medium',
            description: 'The Content-Security-Policy (CSP) header is missing, which can increase the risk of XSS attacks.',
            remediation: 'Implement a strict Content-Security-Policy header to control which resources can be loaded by the browser.'
        },
        {
            title: 'SQL Injection',
            severity: 'Critical',
            description: 'A login form parameter appears to be vulnerable to SQL Injection, potentially allowing attackers to bypass authentication.',
            remediation: 'Use parameterized queries (prepared statements) for all database interactions. Never concatenate user input directly into SQL queries.'
        },
        {
            title: 'Outdated Component: jQuery 3.1.0',
            severity: 'Low',
            description: 'The application uses an outdated version of jQuery which has known vulnerabilities.',
            remediation: 'Update jQuery to the latest stable version to patch known security issues.'
        }
    ]
}


export default function ScannerPage() {
  const { user, login, logout, scansToday, recordScan } = useUser();
  const [scanStatus, setScanStatus] = React.useState<ScanStatus>('idle');
  const [progress, setProgress] = React.useState(0);
  const [scannedUrl, setScannedUrl] = React.useState('');
  
  const scanLimit = user?.isLoggedIn ? 10 : 2;
  const canScan = scansToday < scanLimit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!canScan) {
      alert('You have reached your daily scan limit.');
      return;
    }
    
    setScannedUrl(values.url);
    setScanStatus('scanning');
    recordScan();
    
    // Simulate scan progress
    setProgress(0);
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) {
                clearInterval(interval);
                return prev;
            }
            return prev + 5;
        });
    }, 200);

    setTimeout(() => {
      setProgress(100);
      setScanStatus('complete');
      clearInterval(interval);
    }, 4000);
  };

  const handleNewScan = () => {
    setScanStatus('idle');
    setProgress(0);
    setScannedUrl('');
    form.reset();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
            <div className='flex justify-center items-center gap-3'>
                <ScanLine className="w-10 h-10 text-primary" />
                <CardTitle className="text-4xl font-bold tracking-tight">Website Security Scanner</CardTitle>
            </div>
          <CardDescription className="text-lg">
            Enter a URL to scan for common web vulnerabilities. Educational use only.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {scanStatus === 'idle' && (
                <div className='animate-fade-in'>
                    <Alert className="bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        <AlertTitle>{user?.isLoggedIn ? `Welcome, ${user.name}!` : 'You are scanning as a guest.'}</AlertTitle>
                        <AlertDescription>
                            <b>You have used {scansToday} of your {scanLimit} scans for today.</b> 
                            {!user?.isLoggedIn && ' Login or Sign Up for more scans and detailed results.'}
                        </AlertDescription>
                    </Alert>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                            <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-lg">URL to Scan</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit" className="w-full text-lg" size="lg" disabled={!canScan}>
                                {canScan ? 'Start Scan' : 'Scan Limit Reached'}
                            </Button>
                        </form>
                    </Form>

                    {/* Simulate Login/Logout for demo */}
                    <div className='text-center mt-6'>
                        {user?.isLoggedIn ? (
                             <Button variant="link" onClick={logout}>Log out to scan as a guest.</Button>
                        ): (
                            <Button variant="link" onClick={login}>Simulate Login</Button>
                        )}
                    </div>
                </div>
            )}

            {scanStatus === 'scanning' && (
                <div className="text-center animate-fade-in space-y-4">
                    <p className="text-lg text-muted-foreground">Scanning <span className='font-bold text-primary'>{scannedUrl}</span>...</p>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">This may take a moment. Please don't close this page.</p>
                     <div className="flex justify-center items-center text-primary pt-4">
                        <Bot className="w-16 h-16 animate-pulse" />
                    </div>
                </div>
            )}
            
            {scanStatus === 'complete' && (
                <div className="animate-fade-in">
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-2xl'>
                                <ShieldCheck className='w-8 h-8 text-green-500'/>
                                Scan Complete
                            </CardTitle>
                            <CardDescription>
                                Results for: <a href={scannedUrl} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>{scannedUrl}</a>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible className="w-full">
                                { (user?.isLoggedIn ? mockVulnerabilities.loggedIn : mockVulnerabilities.guest).map((vuln, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityBadge(vuln.severity as any)}`}>{vuln.severity}</span>
                                                <span className="font-semibold">{vuln.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className='prose prose-sm max-w-none'>
                                            <p>{vuln.description}</p>
                                            <h4 className='font-bold mt-2'>Remediation</h4>
                                            <p>{vuln.remediation}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>

                             {!user?.isLoggedIn && (
                                <Card className='mt-6 bg-muted'>
                                    <CardHeader className='flex-row items-center gap-4 space-y-0'>
                                        <FileText className='w-8 h-8 text-primary' />
                                        <div>
                                            <CardTitle>Get the Full Picture</CardTitle>
                                            <CardDescription>Our full scan found {mockVulnerabilities.loggedIn.length - mockVulnerabilities.guest.length} additional issues.</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">
                                            This includes vulnerabilities like SQL Injection, Broken Access Control, and more. Sign up to get access to all findings.
                                        </p>
                                        <Button asChild>
                                            <Link href="/signup">Sign Up to Explore <ExternalLink className='w-4 h-4 ml-2'/></Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                             )}
                              {user?.isLoggedIn && (
                                 <Alert variant="default" className='mt-4 bg-primary/10 border-primary/20'>
                                     <AlertTriangle className="h-4 w-4 text-primary" />
                                     <AlertTitle>Unlock AI-Powered Remediation</AlertTitle>
                                     <AlertDescription>
                                         Upgrade to a Pro plan to get detailed, AI-generated code fixes for every vulnerability, saving you time and ensuring your code is secure.
                                         <br/>
                                         <Link href="/#pricing" className="text-primary font-bold hover:underline mt-2 inline-block">
                                             View Pricing Plans &rarr;
                                         </Link>
                                     </AlertDescription>
                                 </Alert>
                              )}
                        </CardContent>
                        <CardFooter className='flex-col sm:flex-row justify-between items-center gap-4'>
                             <p className='text-sm text-muted-foreground'>You have {scanLimit - scansToday} scans remaining today.</p>
                             <Button onClick={handleNewScan}><ScanLine className='w-4 h-4 mr-2'/> Start New Scan</Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
            
        </CardContent>
      </Card>
    </div>
  );
}
