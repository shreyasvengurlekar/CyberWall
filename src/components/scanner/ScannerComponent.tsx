// src/components/scanner/ScannerComponent.tsx

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
import { ScanLine, ShieldCheck, AlertTriangle, Bot, CheckCircle, ArrowLeft, Download, LogIn } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { performScan, type ScanResult } from '@/ai/flows/scanner-flow';
import { generatePdf } from '@/lib/pdf-generator';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL (e.g., https://example.com)' }),
});

type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';

// --- THIS IS THE NEW HELPER FUNCTION ---
/**
 * Formats the AI remediation text by inserting line breaks before numbered points.
 * This ensures ReactMarkdown renders it as a proper list.
 * @param text The raw string from the AI.
 * @returns A formatted string with newlines.
 */
const formatRemediationText = (text: string) => {
  if (!text) return "";
  // This regular expression finds any number followed by a period (like "2." or "3.")
  // and inserts two line breaks before it, creating a new paragraph in Markdown.
  return text.replace(/(\d\.)/g, '\n\n$1');
};
// --- END OF NEW FUNCTION ---


const getSeverityBadgeClass = (severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational') => {
    // ... (this function remains the same)
};

const scanningMessages = [
    // ... (this array remains the same)
];


export default function ScannerComponent({ vulnerabilityType }: { vulnerabilityType?: string }) {
  // ... (all your existing state hooks and functions remain the same)
  const { user } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  // ... etc.

  // --- THE JSX PART IS THE ONLY THING THAT CHANGES ---
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card className="shadow-lg">
        {/* ... (CardHeader and other JSX is unchanged) ... */}
        <CardContent>
            {/* ... (idle, scanning, and error states are unchanged) ... */}
            {(scanStatus === 'complete' && scanResults) && (
                <div className="animate-fade-in">
                    <Card>
                        <CardHeader>{/* ... */}</CardHeader>
                        <CardContent>
                             {scanResults.vulnerabilities.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full" defaultValue='item-0'>
                                    {scanResults.vulnerabilities.map((vuln, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger>{/* ... */}</AccordionTrigger>
                                            <AccordionContent className='prose dark:prose-invert prose-sm max-w-none px-4 py-2'>
                                                {user ? (
                                                    <>
                                                        <p>{vuln.description}</p>
                                                        <h4 className='font-bold mt-4 mb-2'>AI-Powered Remediation</h4>
                                                        
                                                        {/* --- THIS IS THE FIX --- */}
                                                        {/* We now pass the text through our new formatting function */}
                                                        {/* before giving it to ReactMarkdown. */}
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                          {formatRemediationText(vuln.remediation)}
                                                        </ReactMarkdown>
                                                        {/* --- END OF FIX --- */}
                                                    </>
                                                ) : (
                                                    <>{/* ... */}</>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                 <Alert variant="default">{/* ... */}</Alert>
                            )}
                        </CardContent>
                        <CardFooter>{/* ... */}</CardFooter>
                    </Card>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}