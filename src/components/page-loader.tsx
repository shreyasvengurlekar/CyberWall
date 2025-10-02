'use client';

import * as React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageLoader() {
  const [showLongLoadMessage, setShowLongLoadMessage] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const longLoadTimer = setTimeout(() => {
      setShowLongLoadMessage(true);
    }, 2000); // Show message after 2 seconds

    // This effect should only run once on mount
    return () => {
      clearTimeout(longLoadTimer);
    };
  }, []);

  React.useEffect(() => {
    // In a real app with suspense, the loader would unmount naturally.
    // We keep a small delay here for visual consistency in development.
    const visibilityTimer = setTimeout(() => setVisible(false), 3000); // Max wait time before fade out
    return () => clearTimeout(visibilityTimer);
  }, []);


  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 animate-shield-pulse">
            <Shield className="h-12 w-12 text-primary" />
            <span className="font-bold text-4xl">CyberWall</span>
        </div>
        <div className="w-48 h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-loader-progress rounded-full"></div>
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
