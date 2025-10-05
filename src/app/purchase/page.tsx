
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
import { CheckCircle, CreditCard, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, 'Name on card is required'),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value), 'Card number must be 16 digits'),
  expiry: z.string().refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), 'Expiry must be in MM/YY format'),
  cvc: z.string().refine((value) => /^\d{3}$/.test(value), 'CVC must be 3 digits'),
});

type Plan = 'pro' | 'business';

export default function PurchasePage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null);
    const [isPaid, setIsPaid] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            cardNumber: '',
            expiry: '',
            cvc: '',
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log('Payment details:', values);
        setIsPaid(true);

        setTimeout(() => {
            router.push('/dashboard');
        }, 3000);
    };

    if (isPaid) {
        return (
            <div className="container mx-auto max-w-2xl py-20 md:py-32 px-4 text-center animate-fade-in">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-4 w-fit mb-4">
                            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
                        <CardDescription className='text-lg'>
                            Congratulations on upgrading to the {selectedPlan === 'pro' ? 'Pro' : 'Business'} plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You now have full access to all features. You will be redirected to your dashboard shortly.</p>
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

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Pro Plan */}
        <Card className={`transition-all ${selectedPlan === 'pro' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader>
            <CardTitle className="text-2xl">Pro Plan</CardTitle>
            <CardDescription className="text-4xl font-bold">₹49<span className="text-sm font-normal text-muted-foreground">/month</span></CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPlan === 'pro' ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="cardNumber" render={({ field }) => (
                    <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input {...field} placeholder="•••• •••• •••• ••••" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="flex gap-4">
                     <FormField control={form.control} name="expiry" render={({ field }) => (
                        <FormItem className="w-1/2"><FormLabel>Expiry</FormLabel><FormControl><Input {...field} placeholder="MM/YY" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="cvc" render={({ field }) => (
                        <FormItem className="w-1/2"><FormLabel>CVC</FormLabel><FormControl><Input {...field} placeholder="•••" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full"><CreditCard className='mr-2 w-4 h-4' /> Pay ₹49</Button>
                </form>
              </Form>
            ) : (
              <Button onClick={() => setSelectedPlan('pro')} className="w-full" size="lg">Select Pro</Button>
            )}
          </CardContent>
        </Card>

        {/* Business Plan */}
         <Card className={`transition-all ${selectedPlan === 'business' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader>
            <CardTitle className="text-2xl">Business Plan</CardTitle>
            <CardDescription className="text-4xl font-bold">₹99<span className="text-sm font-normal text-muted-foreground">/month</span></CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPlan === 'business' ? (
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="cardNumber" render={({ field }) => (
                        <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input {...field} placeholder="•••• •••• •••• ••••" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex gap-4">
                        <FormField control={form.control} name="expiry" render={({ field }) => (
                            <FormItem className="w-1/2"><FormLabel>Expiry</FormLabel><FormControl><Input {...field} placeholder="MM/YY" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="cvc" render={({ field }) => (
                            <FormItem className="w-1/2"><FormLabel>CVC</FormLabel><FormControl><Input {...field} placeholder="•••" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <Button type="submit" className="w-full"><CreditCard className='mr-2 w-4 h-4' /> Pay ₹99</Button>
                    </form>
              </Form>
            ) : (
              <Button onClick={() => setSelectedPlan('business')} className="w-full" size="lg">Select Business</Button>
            )}
          </CardContent>
        </Card>
      </div>

       <Alert variant="default" className="mt-8 bg-muted">
        <DollarSign className="h-4 w-4" />
        <AlertTitle>Secure Payments</AlertTitle>
        <AlertDescription>
          All transactions are securely processed. This is a demo and no real payment will be made.
        </AlertDescription>
      </Alert>
    </div>
  );
}
