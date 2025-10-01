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
  { href: '/services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

type HeaderProps = {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
};


export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  React.useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className={cn("mr-4 hidden items-center md:flex")}>
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))]" />
            <span className="font-bold">CyberWall</span>
          </Link>
        </div>
        
        <div ref={searchRef} className="flex flex-1 items-center justify-end gap-2">
          {/* Desktop Search */}
          <div className={cn("relative w-full max-w-xs transition-all duration-300 hidden sm:flex items-center gap-2 justify-end flex-1", isSearchOpen && "max-w-md")}>
              <div className={cn('relative w-full transition-all duration-300', !isSearchOpen ? 'max-w-0 opacity-0' : 'max-w-xs')}>
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-10"
                  aria-hidden={!isSearchOpen}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                />
                 <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
          </div>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className='hidden sm:inline-flex'
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Toggle Search</span>
            </Button>

          <div className="flex items-center gap-2">
             {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 text-sm lg:flex">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:drop-shadow-[0_0_2px_hsl(var(--primary))] origin-center"
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            <ThemeToggle />
            <div className='hidden sm:flex items-center gap-2'>
              <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                  <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>


          {/* Mobile Menu */}
          <div className="flex items-center sm:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon">
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
                      <Input 
                        type="search" 
                        placeholder="Search..." 
                        className="w-full pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery?.(e.target.value)}
                      />
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
                      <SheetClose asChild>
                        <Button asChild variant="outline">
                            <Link href="/login">Log In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                      </SheetClose>
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
