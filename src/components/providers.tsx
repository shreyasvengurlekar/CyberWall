'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { SearchProvider } from '@/context/search-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <SearchProvider>
            {children}
        </SearchProvider>
    </ThemeProvider>
  );
}
