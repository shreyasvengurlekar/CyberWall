'use client';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, ShieldCheck } from 'lucide-react';

export function ScanProgress({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 20, 100));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      const completionTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(completionTimer);
    }
  }, [progress, onComplete]);

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
          {progress < 100 ? (
                <ScanLine className="animate-pulse text-primary h-12 w-12" />
            ) : (
                <ShieldCheck className="text-green-500 h-12 w-12" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {progress < 100 ? "Scanning in Progress" : "Scan Complete"}
          </CardTitle>
          <CardDescription>
            {progress < 100 ? "Analyzing your target. Please wait..." : "Finalizing results..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full h-2" />
          <p className="mt-2 text-sm font-semibold text-muted-foreground">{Math.round(progress)}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
