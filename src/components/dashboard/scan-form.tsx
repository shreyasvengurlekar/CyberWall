'use client';

import { Globe, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export function ScanForm() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Scan Queued',
      description: 'Your scan has been added to the queue and will begin shortly.',
    });
    // In a real app, you would create a new scan record here
    // and then navigate to its "in-progress" page.
    router.push('/scans/scan-004');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Scan</CardTitle>
        <CardDescription>
          Enter a URL to start a new security scan.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="relative">
              <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="url" placeholder="https://example.com" required className="pl-8" defaultValue="https://example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Scan Type</Label>
            <RadioGroup defaultValue="quick" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="quick" id="quick" className="peer sr-only" />
                <Label
                  htmlFor="quick"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Zap className="mb-3 h-6 w-6" />
                  Quick Scan
                </Label>
              </div>
              <div>
                <RadioGroupItem value="advanced" id="advanced" className="peer sr-only" />
                <Label
                  htmlFor="advanced"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Zap className="mb-3 h-6 w-6" />
                  Advanced Scan
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button type="submit">
            <Zap className="mr-2 h-4 w-4" /> Start Scan
          </Button>
          <p className="text-xs text-muted-foreground">
            For educational purposes only. Not for unauthorized testing or commercial resale. By starting a scan, you affirm you have authorization to test the target URL.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
