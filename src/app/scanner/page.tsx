
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
import { ScanLine, ShieldCheck, ShieldAlert, AlertTriangle, Info, Bot, FileText, CheckCircle, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase/auth/use-user';


const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL (e.g., https://example.com)' }),
});

type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';
type ScanType = 'quick' | 'full';

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

const mockVulnerabilities = [
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
];


export default function ScannerPage() {
  const { user, profile, recordScan } = useUser();
  const [scanStatus, setScanStatus] = React.useState<ScanStatus>('idle');
  const [scanType, setScanType] = React.useState<ScanType>('quick');
  const [progress, setProgress] = React.useState(0);
  const [scannedUrl, setScannedUrl] = React.useState('');
  
  const plan = profile?.plan || 'guest';
  const scansToday = profile?.scansToday || 0;

  const scanLimit = plan === 'guest' ? 2 : (plan === 'pro' || plan === 'business' ? Infinity : 10);
  const canScan = plan === 'pro' || plan === 'business' || scansToday < scanLimit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const handleScan = (scanType: ScanType) => {
    form.handleSubmit((values) => {
        if (!canScan) {
          alert('You have reached your daily scan limit.');
          return;
        }
        
        setScannedUrl(values.url);
        setScanStatus('scanning');
        setScanType(scanType);
        if(user) {
          recordScan();
        }
        
        // Simulate scan progress
        const scanTime = scanType === 'quick' ? 2000 : 4000;
        const intervalTime = scanTime / 20;

        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 5;
            });
        }, intervalTime);

        setTimeout(() => {
          setProgress(100);
          setScanStatus('complete');
          clearInterval(interval);
        }, scanTime);
    })();
  };

  const handleNewScan = () => {
    setScanStatus('idle');
    setProgress(0);
    setScannedUrl('');
    form.reset();
  }
  
  const scansRemaining = scanLimit === Infinity ? 'unlimited' : scanLimit - scansToday;

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
                        <AlertTitle>{user ? `Welcome, ${user.displayName || 'User'}!` : 'Welcome, Guest!'}</AlertTitle>
                        <AlertDescription>
                            <b>You have {scansRemaining} scans remaining today.</b>
                            {!user && ' Login or Sign Up for more scans and detailed results.'}
                        </AlertDescription>
                    </Alert>

                    <Form {...form}>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-6">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button onClick={() => handleScan('quick')} className="w-full text-lg" size="lg" disabled={!canScan}>
                                    {canScan ? 'Quick Scan' : 'Limit Reached'}
                                </Button>
                                <Button onClick={() => handleScan('full')} className="w-full text-lg" size="lg" variant="outline" disabled={!canScan}>
                                    {canScan ? 'Full Scan' : 'Limit Reached'}
                                </Button>
                            </div>
                            <p className='text-center text-sm text-muted-foreground flex items-center justify-center gap-2'>
                                <Clock className='w-4 h-4' />
                                Full scan is more comprehensive and will take longer.
                            </p>
                        </form>
                    </Form>
                </div>
            )}

            {scanStatus === 'scanning' && (
                <div className="text-center animate-fade-in space-y-4">
                    <p className="text-lg text-muted-foreground">Performing {scanType} scan on <span className='font-bold text-primary'>{scannedUrl}</span>...</p>
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
                                { mockVulnerabilities.slice(0, (plan === 'free' || plan === 'guest') ? 2 : mockVulnerabilities.length).map((vuln, index) => (
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
                            
                            {plan === 'guest' && (
                                 <Alert variant="default" className='mt-6 bg-blue-500/10 border-blue-500/20'>
                                     <Info className="h-4 w-4 text-blue-500" />
                                     <AlertTitle>Get the Full Picture</AlertTitle>
                                     <AlertDescription>
                                         You're seeing limited results as a guest. This includes {mockVulnerabilities.slice(0,2).length} of {mockVulnerabilities.length} potential findings.
                                         <br/>
                                         <Link href="/signup" className="text-primary font-bold hover:underline mt-2 inline-block">
                                             Sign Up to Explore More &rarr;
                                         </Link>
                                     </AlertDescription>
                                 </Alert>
                            )}

                             {plan === 'free' && (
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

                            { (plan === 'pro' || plan === 'business') && (
                                <Alert variant="default" className="mt-6 bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertTitle>You're a Pro!</AlertTitle>
                                    <AlertDescription>
                                        You have access to all vulnerability details and remediation advice.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter className='flex-col sm:flex-row justify-between items-center gap-4'>
                             <p className='text-sm text-muted-foreground'>You have {scansRemaining} scans remaining today.</p>
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
