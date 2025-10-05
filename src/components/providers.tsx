'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { SearchProvider } from '@/context/search-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserProvider } from '@/firebase/auth/user-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
      <FirebaseClientProvider>
        <UserProvider>
          <SearchProvider>
              {children}
          </SearchProvider>
        </UserProvider>
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
