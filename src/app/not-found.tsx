import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center px-4 overflow-hidden">
      <div className="relative animate-fade-in-slide-up">
        <ShieldAlert className="w-24 h-24 text-primary/80 mb-4 animate-bounce mx-auto" />
        <h1 className="text-9xl font-bold text-primary tracking-tighter animate-glitch" data-text="404">404</h1>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Page Not Found</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-md">
          Oops! Looks like this page doesn’t exist. Let’s get you back on track.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild className="transition-all hover:shadow-[0_0_15px_hsl(var(--primary))] hover:-translate-y-1">
            <Link href="/">Go back home</Link>
          </Button>
          <Button variant="ghost" asChild className="transition-all hover:text-primary">
            <Link href="/#contact">Contact Support <span aria-hidden="true">&rarr;</span></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
