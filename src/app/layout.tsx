'use client';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import * as React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchQuery, setSearchQuery] = React.useState('');

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
          <div className="flex flex-col min-h-screen animate-fade-in">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <main className="flex-1">{React.cloneElement(children as React.ReactElement, { searchQuery })}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
