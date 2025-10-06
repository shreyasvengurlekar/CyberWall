
'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, Briefcase, Construction, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Plan = 'pro' | 'business';

export default function PurchasePage() {
    const [isDevelopmentNotice, setIsDevelopmentNotice] = React.useState(false);
    const router = useRouter();

    const handleSelectPlan = (plan: Plan) => {
        setIsDevelopmentNotice(true);
    };

    if (isDevelopmentNotice) {
        return (
            <div className="container mx-auto max-w-2xl py-20 md:py-32 px-4 text-center animate-fade-in">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <div className="mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full p-4 w-fit mb-4">
                            <Construction className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Payment Gateway Under Development</CardTitle>
                        <CardDescription className='text-lg'>
                            We are working hard to bring you a seamless payment experience.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">This feature will be available in a future update. Thank you for your patience!</p>
                        <Button onClick={() => router.back()} className="mt-6">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                        </Button>
                    </CardContent>
                 </Card>
            </div>
        );
    }

  return (
    <div className="container mx-auto max-w-5xl py-20 md:py-32 px-4">
      <div className='mb-8'>
        <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground mt-2">Unlock advanced features and take control of your security.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
        {/* Pro Plan */}
        <Card className="transition-all hover:ring-2 hover:ring-primary hover:-translate-y-1">
          <CardHeader>
             <div className="flex items-center gap-4 mb-2">
                <Star className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
             </div>
            <CardDescription className="text-4xl font-bold">₹4,000<span className="text-sm font-normal text-muted-foreground">/month</span></CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Advanced Scanning</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> AI Remediation</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Detailed PDF Reports</li>
            </ul>
             <Button onClick={() => handleSelectPlan('pro')} className="w-full" size="lg">Select Pro</Button>
          </CardContent>
        </Card>

        {/* Business Plan */}
         <Card className="transition-all hover:ring-2 hover:ring-primary hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
                <Briefcase className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Business Plan</CardTitle>
            </div>
            <CardDescription className="text-4xl font-bold">₹8,000<span className="text-sm font-normal text-muted-foreground">/month</span></CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
             <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> All Pro Features</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Team Collaboration</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Priority Support</li>
            </ul>
            <Button onClick={() => handleSelectPlan('business')} className="w-full" size="lg">Select Business</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
