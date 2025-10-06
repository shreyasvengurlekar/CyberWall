
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useUser } from '@/firebase/auth/use-user';
import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Download, AlertTriangle, ScanLine } from 'lucide-react';
import type { ScanResult } from '@/ai/flows/scanner-flow';
import { generatePdf } from '@/lib/pdf-generator';
import { Badge } from '@/components/ui/badge';

interface ScanDoc {
    id: string;
    url: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    results: ScanResult;
    scanType: string;
}

const getSeverityBadgeVariant = (severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational') => {
  switch (severity) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'secondary';
    case 'Medium':
      return 'default';
    case 'Low':
      return 'outline';
    default:
      return 'outline';
  }
};


export default function ScanDetailPage() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const router = useRouter();
    const params = useParams();
    const scanId = params.scanId as string;

    const scanDocRef = useMemoFirebase(() => {
        if (!user || !firestore || !scanId) return null;
        return doc(firestore, `users/${user.uid}/scans`, scanId);
    }, [user, firestore, scanId]);

    const { data: scan, isLoading: isScanLoading, error } = useDoc<ScanDoc>(scanDocRef);

    React.useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const handleDownloadReport = () => {
        if (!scan) return;
        generatePdf(scan.url, scan.results);
    };

    if (isUserLoading || isScanLoading) {
        return (
             <div className="container mx-auto max-w-4xl py-12 px-4 space-y-6">
                <Skeleton className="h-8 w-48" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container mx-auto max-w-4xl py-12 px-4">
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Loading Scan</AlertTitle>
                    <AlertDescription>
                        There was a problem fetching the scan details. It's possible you don't have permission to view this scan or it doesn't exist.
                    </AlertDescription>
                </Alert>
                 <Button onClick={() => router.push('/dashboard')} variant="outline" className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        )
    }
    
    if (!scan) {
        return (
            <div className="container mx-auto max-w-4xl py-12 px-4 text-center">
                <h2 className="text-2xl font-semibold">Scan Not Found</h2>
                <p className="text-muted-foreground mt-2">The requested scan could not be found.</p>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        )
    }

    const { url, createdAt, results } = scan;

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
             <div className="mb-8">
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <h1 className="text-4xl font-bold tracking-tight">Scan Report</h1>
                <p className="text-muted-foreground">Detailed results from the security scan performed on {new Date(createdAt.seconds * 1000).toLocaleString()}.</p>
             </div>
            
            <Card className="animate-fade-in">
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-2xl'>
                        <ShieldCheck className='w-8 h-8 text-primary'/>
                        Scan Details
                    </CardTitle>
                    <CardDescription>
                        Results for: <a href={url} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>{url}</a>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                        {results.vulnerabilities.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full" defaultValue='item-0'>
                            {results.vulnerabilities.map((vuln, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4 text-left">
                                            <Badge variant={getSeverityBadgeVariant(vuln.severity)}>{vuln.severity}</Badge>
                                            <span className="font-semibold">{vuln.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='prose dark:prose-invert prose-sm max-w-none'>
                                        <p>{vuln.description}</p>
                                        <h4 className='font-bold mt-2'>AI-Powered Remediation</h4>
                                        <p>{vuln.remediation}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                            <Alert variant="default" className='mt-6 bg-green-500/10 border-green-500/20'>
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                <AlertTitle>No Vulnerabilities Found!</AlertTitle>
                                <AlertDescription>
                                Our AI-powered scan did not find any critical issues for this URL.
                                </AlertDescription>
                            </Alert>
                    )}
                    
                </CardContent>
                <CardFooter className='flex-col sm:flex-row justify-between items-center gap-4'>
                    <Button onClick={handleDownloadReport} variant="secondary">
                        <Download className='w-4 h-4 mr-2'/> Download Report
                    </Button>
                    <div className="flex gap-2">
                        <Button asChild><Link href="/scanner"><ScanLine className='w-4 h-4 mr-2'/> Start New Scan</Link></Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

