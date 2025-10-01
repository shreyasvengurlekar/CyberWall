'use client';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { PageLoader } from '@/components/page-loader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    // Hide loader on initial load and when path changes
    setIsLoading(false);
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>CyberWall Scanner</title>
        <meta name="description" content="An educational tool for web security analysis." />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageLoader isLoading={isLoading} />
          <div className="flex flex-col min-h-screen animate-fade-in">
            <Header 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              setIsLoading={setIsLoading} 
            />
            <main className="flex-1">{React.cloneElement(children as React.ReactElement, { searchQuery, setIsLoading })}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
