
'use client';

import * as React from 'react';
import { useAlert } from '@/context/alert-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

export function AlertManager() {
  const { alert, hideAlert } = useAlert();

  const handleConfirm = () => {
    alert?.onConfirm?.();
    hideAlert();
  };

  return (
    <AlertDialog open={!!alert} onOpenChange={(open) => !open && hideAlert()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {alert?.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(
              alert?.variant === 'destructive' &&
                buttonVariants({ variant: 'destructive' })
            )}
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
