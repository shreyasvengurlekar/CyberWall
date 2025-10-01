import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Workflow } from 'lucide-react';

export default function KnownVulnerabilitiesPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Workflow className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Using Components with Known Vulnerabilities</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about the risks of using components with known vulnerabilities and how our scanner helps.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is the Risk?</h2>
          <p>
            Components, such as libraries, frameworks, and other software modules, run with the same privileges as the application. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            Our scanner maintains an up-to-date database of known vulnerabilities. We scan your project's dependencies and flag any components that have reported security issues, allowing you to update them before they can be exploited.
          </p>
        </div>
        <Button asChild>
            <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    </div>
  );
}
