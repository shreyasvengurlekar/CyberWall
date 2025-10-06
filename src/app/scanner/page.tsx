
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
import { ScanLine, ShieldCheck, AlertTriangle, Bot, CheckCircle, ArrowLeft, Download, Shield } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useSearchParams, useRouter } from 'next/navigation';
import { performScan, type ScanResult } from '@/ai/flows/scanner-flow';
import jsPDF from 'jspdf';


const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL (e.g., https://example.com)' }),
});

type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';

const getSeverityBadge = (severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational') => {
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

const scanningMessages = [
    'Initializing scan engine...',
    'Mapping website structure...',
    'Probing for open ports and services...',
    'Analyzing entry points for SQL injection...',
    'Testing for Cross-Site Scripting (XSS)...',
    'Checking for security misconfigurations...',
    'Scanning dependencies for known vulnerabilities...',
    'Compiling report with AI-powered remediation...',
    'Finalizing analysis...',
];


function ScannerResults() {
  const { user, profile } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const vulnerabilityType = searchParams.get('vulnerability');
  const vulnerabilityName = vulnerabilityType
    ? vulnerabilityType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : '';

  const [scanStatus, setScanStatus] = React.useState<ScanStatus>('idle');
  const [progress, setProgress] = React.useState(0);
  const [loadingMessage, setLoadingMessage] = React.useState(scanningMessages[0]);
  const [scannedUrl, setScannedUrl] = React.useState('');
  const [scanResults, setScanResults] = React.useState<ScanResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const plan = user ? 'free' : 'guest';
  const scansToday = profile?.scansToday || 0;

  const scanLimit = plan === 'guest' ? 2 : Infinity;
  const canScan = plan === 'guest' ? scansToday < scanLimit : true;


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const handleScan = form.handleSubmit(async (values) => {
    if (!canScan) {
      alert('You have reached your daily scan limit. Please sign up for unlimited scans.');
      return;
    }

    setScannedUrl(values.url);
    setScanStatus('scanning');
    setError(null);
    setScanResults(null);
    
    // Simulate progress
    setProgress(0);
    setLoadingMessage(scanningMessages[0]);
    
    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) {
                clearInterval(progressInterval);
                return prev;
            }
            const increment = Math.random() * 10;
            return Math.min(prev + increment, 95);
        });
    }, 400);

    const messageInterval = setInterval(() => {
        setLoadingMessage(prevMessage => {
            const currentIndex = scanningMessages.indexOf(prevMessage);
            const nextIndex = (currentIndex + 1) % scanningMessages.length;
            return scanningMessages[nextIndex];
        });
    }, 1500);

    try {
        const results = await performScan({ 
            url: values.url, 
            scanType: vulnerabilityType || 'general' 
        });
        setScanResults(results);
        setProgress(100);
        setScanStatus('complete');
    } catch (err) {
        console.error(err);
        setError('An unexpected error occurred during the scan. Please try again.');
        setScanStatus('error');
    } finally {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        setProgress(100);
    }
  });


  const handleNewScan = () => {
    setScanStatus('idle');
    setProgress(0);
    setScannedUrl('');
    setScanResults(null);
    setError(null);
    form.reset();
  }

  const downloadReport = () => {
    if (!scanResults) return;

    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    let y = 20;

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CyberWall Security Report', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setDrawColor(200); // divider color
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;


    // --- Scan Details ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`URL Scanned: ${scannedUrl}`, margin, y);
    y += 7;
    doc.text(`Scan Date: ${new Date().toLocaleString()}`, margin, y);
    y += 12;

    
    // --- Summary ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Scan Summary', margin, y);
    y += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(scanResults.summary, usableWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Overall Security Score: ${scanResults.overallScore}/100`, margin, y);
    y += 15;

    // --- Vulnerabilities ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Vulnerabilities Found', margin, y);
    y += 10;

    const checkAndAddPage = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    if (scanResults.vulnerabilities.length > 0) {
        scanResults.vulnerabilities.forEach((vuln, index) => {
            checkAndAddPage(40); // Estimate height for a new vulnerability entry

            // Severity Badge
            let severityColor = '#6b7280'; // gray-500
            if (vuln.severity === 'Critical') severityColor = '#ef4444'; // red-500
            if (vuln.severity === 'High') severityColor = '#f97316'; // orange-500
            if (vuln.severity === 'Medium') severityColor = '#eab308'; // yellow-500
            if (vuln.severity === 'Low') severityColor = '#3b82f6'; // blue-500
            
            doc.setFillColor(severityColor);
            doc.roundedRect(margin, y - 4, 25, 6, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setTextColor('#ffffff');
            doc.setFont('helvetica', 'bold');
            doc.text(vuln.severity, margin + 12.5, y, { align: 'center' });

            // Title
            doc.setFontSize(14);
            doc.setTextColor('#000000');
            doc.setFont('helvetica', 'bold');
            doc.text(vuln.title, margin + 30, y);
            y += 12;

            // Description
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Description', margin, y);
            y += 6;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const descLines = doc.splitTextToSize(vuln.description, usableWidth);
            checkAndAddPage(descLines.length * 5);
            doc.text(descLines, margin, y);
            y += descLines.length * 5 + 8;

             // Remediation
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('AI-Powered Remediation', margin, y);
            y += 6;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const remLines = doc.splitTextToSize(vuln.remediation, usableWidth);
            checkAndAddPage(remLines.length * 5);
            doc.text(remLines, margin, y);
            y += remLines.length * 5 + 10;

            if(index < scanResults.vulnerabilities.length - 1) {
                doc.setDrawColor(220);
                doc.line(margin, y, pageWidth - margin, y);
                y+= 10;
            }
        });
    } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('No vulnerabilities were found during this scan.', margin, y);
    }

    doc.save(`CyberWall-Report-${new URL(scannedUrl).hostname}.pdf`);
  };

  
  const scansRemaining = scanLimit === Infinity ? 'unlimited' : scanLimit - scansToday;

  const pageTitle = vulnerabilityType 
    ? `Scan for ${vulnerabilityName}` 
    : 'Website Security Scanner';


  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
            <div className='flex justify-center items-center gap-3'>
                <ScanLine className="w-10 h-10 text-primary" />
                <CardTitle className="text-4xl font-bold tracking-tight">{pageTitle}</CardTitle>
            </div>
          <CardDescription className="text-lg">
            Enter a URL to scan for web vulnerabilities. Educational use only.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {scanStatus === 'idle' && (
                <div className='animate-fade-in'>
                    <Alert className="bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        <AlertTitle>{user ? `Welcome, ${user.displayName || 'User'}!` : 'Welcome, Guest!'}</AlertTitle>
                        <AlertDescription>
                            {user ? (
                                <b>You have unlimited scans.</b>
                            ) : (
                                <b>You have {scansRemaining} scans remaining today. Sign up for unlimited scans.</b>
                            )}
                        </AlertDescription>
                    </Alert>

                    <Form {...form}>
                        <form onSubmit={handleScan} className="space-y-6 mt-6">
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
                            {vulnerabilityType ? (
                                <div className="flex flex-col gap-4">
                                    <Button type="submit" className="w-full text-lg" size="lg" disabled={!canScan}>
                                        <ScanLine className='mr-2 w-5 h-5'/> {canScan ? `Scan for ${vulnerabilityName}` : 'Limit Reached'}
                                    </Button>
                                    <Button onClick={() => router.push('/services')} variant="ghost" className="w-full text-md hover:bg-transparent hover:text-muted-foreground" size="lg">
                                        <ArrowLeft className='mr-2 w-4 h-4'/> Back to Services
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <Button onClick={() => router.back()} className="w-full text-lg" size="lg" variant="outline">
                                        <ArrowLeft className='mr-2 w-4 h-4'/> Back
                                    </Button>
                                    <Button type="submit" className="w-full text-lg" size="lg" disabled={!canScan}>
                                        {canScan ? 'Quick Scan' : 'Limit Reached'}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            )}

            {scanStatus === 'scanning' && (
                <div className="text-center animate-fade-in space-y-4 pt-4 pb-8">
                    <div className="relative w-24 h-24 mx-auto">
                        <Bot className="w-full h-full text-primary animate-pulse" />
                    </div>
                    <p className="text-xl font-bold text-foreground">
                        {Math.round(progress)}%
                    </p>
                    <p className="text-lg text-muted-foreground">Scanning <span className='font-bold text-primary'>{scannedUrl}</span>...</p>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground h-5">{loadingMessage}</p>
                </div>
            )}
            
            {(scanStatus === 'complete' && scanResults) && (
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
                             {scanResults.vulnerabilities.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full" defaultValue='item-0'>
                                    {scanResults.vulnerabilities.map((vuln, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityBadge(vuln.severity)}`}>{vuln.severity}</span>
                                                    <span className="font-semibold">{vuln.title}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className='prose prose-sm max-w-none'>
                                                <p>{vuln.description}</p>
                                                <h4 className='font-bold mt-2'>AI-Powered Remediation</h4>
                                                <p>{vuln.remediation}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                 <Alert variant="default" className='mt-6 bg-green-500/10 border-green-500/20'>
                                     <CheckCircle className="h-4 w-4 text-green-500" />
                                     <AlertTitle>No Vulnerabilities Found!</AlertTitle>
                                     <AlertDescription>
                                        Our AI-powered scan did not find any critical issues on this URL. You can start a new scan to check again.
                                     </AlertDescription>
                                 </Alert>
                            )}
                            
                        </CardContent>
                        <CardFooter className='flex-col sm:flex-row justify-between items-center gap-4'>
                           <Button onClick={downloadReport} variant="secondary">
                                <Download className='w-4 h-4 mr-2'/> Download Report
                            </Button>
                            <div className="flex gap-2">
                                <Button onClick={handleNewScan}><ScanLine className='w-4 h-4 mr-2'/> Start New Scan</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {scanStatus === 'error' && (
                <div className="animate-fade-in text-center">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Scan Failed</AlertTitle>
                        <AlertDescription>
                            {error || 'An unknown error occurred. Please try again.'}
                        </AlertDescription>
                    </Alert>
                    <Button onClick={handleNewScan} className="mt-4">
                        <ScanLine className='w-4 h-4 mr-2'/> Try Again
                    </Button>
                </div>
            )}
            
        </CardContent>
      </Card>
    </div>
  );
}

export default function ScannerPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <ScannerResults />
        </React.Suspense>
    )
}
