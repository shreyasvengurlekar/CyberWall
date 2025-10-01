import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DatabaseZap } from 'lucide-react';

export default function SqlInjectionPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <DatabaseZap className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">SQL Injection</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Detailed information about SQL Injection (SQLi) vulnerabilities, how they work, and how CyberWall helps you detect and remediate them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is SQL Injection?</h2>
          <p>
            SQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            Our scanner intelligently probes your application's input fields and parameters to identify potential SQLi vulnerabilities. We provide detailed reports on the findings and offer AI-powered guidance to help your developers patch the security holes effectively.
          </p>
        </div>
        <Button asChild>
            <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    </div>
  );
}
