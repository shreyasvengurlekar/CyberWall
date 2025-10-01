import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function BrokenAccessControlPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Lock className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Broken Access Control</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about Broken Access Control vulnerabilities and how our scanner helps identify them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is Broken Access Control?</h2>
          <p>
            Restrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access unauthorized functionality and/or data, such as access other users' accounts, view sensitive files, modify other users' data, change access rights, etc.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            CyberWall tests your application's endpoints to ensure that users can only access the data and functions they are authorized for, helping you enforce the principle of least privilege.
          </p>
        </div>
        <Button asChild>
            <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    </div>
  );
}
