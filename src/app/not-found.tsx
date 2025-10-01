import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center px-4">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Page Not Found</h2>
        <p className="mt-4 text-lg text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild>
                <Link href="/">Go back home</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="#contact">Contact support <span aria-hidden="true">&rarr;</span></Link>
            </Button>
        </div>
    </div>
  )
}
