import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function InsufficientLoggingPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Bot className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Insufficient Logging & Monitoring</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about the risks of insufficient logging and monitoring and how we help.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is the Risk?</h2>
          <p>
            Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response, allows attackers to further attack systems, maintain persistence, pivot to more systems, and tamper, extract, or destroy data.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            While automated scanning cannot replace a robust logging strategy, CyberWall can identify areas where critical security events are not being logged, providing recommendations to improve your visibility into application activity.
          </p>
        </div>
        <Button asChild>
            <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    </div>
  );
}
