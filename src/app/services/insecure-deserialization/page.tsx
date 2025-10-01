import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function InsecureDeserializationPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <FileText className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Insecure Deserialization</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn about Insecure Deserialization vulnerabilities and how our scanner helps identify them.
        </p>

        <div className="space-y-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold">What is Insecure Deserialization?</h2>
          <p>
            Insecure deserialization often leads to remote code execution. Even if deserialization flaws do not result in remote code execution, they can be used to perform attacks, including replay attacks, injection attacks, and privilege escalation attacks.
          </p>

           <h2 className="text-2xl font-bold">How We Help</h2>
          <p>
            CyberWall examines how your application handles serialized data objects, identifying patterns that could be exploited by attackers. We provide insights on how to safely handle data serialization and deserialization.
          </p>
        </div>
        <Button asChild>
            <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    </div>
  );
}
