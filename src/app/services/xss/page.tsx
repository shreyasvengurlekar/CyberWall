import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Code } from 'lucide-react';

export default function XssPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Code className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Cross-Site Scripting (XSS)</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Detailed information about Cross-Site Scripting (XSS) vulnerabilities, how they work, and how CyberWall helps you detect and remediate them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is XSS?</h2>
          <p>
            Cross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            Our scanner analyzes how your application handles user input and identifies where it might be vulnerable to script injection. We provide clear examples and remediation steps to eliminate XSS risks.
          </p>
        </div>
        <Button asChild>
            <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    </div>
  );
}
