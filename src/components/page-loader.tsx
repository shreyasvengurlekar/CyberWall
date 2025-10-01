'use client';

import * as React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  isLoading: boolean;
}

export function PageLoader({ isLoading }: PageLoaderProps) {
  const [showLongLoadMessage, setShowLongLoadMessage] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setShowLongLoadMessage(false);
      timer = setTimeout(() => {
        setShowLongLoadMessage(true);
      }, 2000); // Show message after 2 seconds
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-500',
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <Shield className="w-16 h-16 text-primary animate-shield-pulse" />
        </div>
        <div className="w-48 h-1.5 bg-border rounded-full overflow-hidden">
          {isLoading && <div className="h-full bg-primary animate-loader-progress rounded-full"></div>}
        </div>
        <div className="h-6 mt-2 text-center">
            {showLongLoadMessage && (
                <p className="text-sm text-muted-foreground animate-fade-in">
                    Almost there...
                </p>
            )}
        </div>
      </div>
    </div>
  );
}
