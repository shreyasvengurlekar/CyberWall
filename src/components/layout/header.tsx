'use client';

import { Shield, Menu, Search } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className={cn("mr-4 flex items-center transition-all duration-300", isSearchOpen && "lg:hidden")}>
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))]" />
            <span className="font-bold">CyberWall</span>
          </Link>
        </div>

        {/* Desktop and Mobile Search */}
        <div className={cn("flex flex-1 items-center justify-start lg:justify-end space-x-2", isSearchOpen && "!justify-end")}>
          <div className="flex w-full items-center gap-2">
            <div className={cn("relative w-full transition-all duration-300", !isSearchOpen && "w-0 opacity-0")}>
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10"
                aria-hidden={!isSearchOpen}
              />
               <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setIsSearchOpen(true)}
                aria-hidden={isSearchOpen}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Open Search</span>
              </Button>
            </div>
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Toggle Search</span>
              </Button>
          </div>

          <div className={cn("flex items-center gap-2", isSearchOpen && "hidden")}>
             {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 text-sm lg:flex">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out after:hover:scale-x-100 after:origin-center hover:drop-shadow-[0_0_2px_hsl(var(--primary))] "
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            <ThemeToggle />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex">
                <Link href="/signup">Sign Up</Link>
            </Button>
          </div>


          {/* Mobile Menu */}
          <div className={cn(isSearchOpen && "hidden")}>
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right">
                <div className="grid gap-4 py-6">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-bold">CyberWall</span>
                    </Link>
                    <div className="relative">
                    <Input type="search" placeholder="Search..." className="w-full pr-10" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                        <Link
                        href={link.href}
                        className="flex w-full items-center py-2 text-lg font-semibold"
                        >
                        {link.label}
                        </Link>
                    </SheetClose>
                    ))}
                    <div className="flex flex-col gap-2 mt-4">
                    <Button asChild variant="outline">
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                    </div>
                </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
