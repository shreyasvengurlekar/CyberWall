
'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info, Star, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

type Plan = 'pro' | 'business';

export default function PurchasePage() {
    const [isConfirmed, setIsConfirmed] = React.useState(false);
    const [confirmedPlan, setConfirmedPlan] = React.useState<Plan | null>(null);

    const handleSelectPlan = (plan: Plan) => {
        setConfirmedPlan(plan);
        setIsConfirmed(true);
        toast.success(`Congratulations! You've upgraded to the ${plan === 'pro' ? 'Pro' : 'Business'} plan.`);
    };

    if (isConfirmed) {
        return (
            <div className="container mx-auto max-w-2xl py-20 md:py-32 px-4 text-center animate-fade-in">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-4 w-fit mb-4">
                            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Upgrade Successful!</CardTitle>
                        <CardDescription className='text-lg'>
                            You now have access to all features of the {confirmedPlan === 'pro' ? 'Pro' : 'Business'} plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Thank you for trying out our demo. Explore your new features on the dashboard!</p>
                    </CardContent>
                 </Card>
            </div>
        );
    }

  return (
    <div className="container mx-auto max-w-5xl py-20 md:py-32 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground mt-2">Unlock advanced features and take control of your security.</p>
      </div>

       <Alert variant="default" className="mb-8 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
        <Info className="h-4 w-4" />
        <AlertTitle>This is a Project Demo</AlertTitle>
        <AlertDescription>
          The payment gateway is not implemented. No payment will be processed and no card details are required. Selecting a plan will simulate a successful upgrade.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
        {/* Pro Plan */}
        <Card className="transition-all hover:ring-2 hover:ring-primary hover:-translate-y-1">
          <CardHeader>
             <div className="flex items-center gap-4 mb-2">
                <Star className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
             </div>
            <CardDescription className="text-4xl font-bold">$49<span className="text-sm font-normal text-muted-foreground">/month</span></CardDescription>
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
            <CardDescription className="text-4xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/month</span></CardDescription>
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
