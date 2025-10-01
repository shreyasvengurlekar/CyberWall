'use client';

import { Shield, Menu, Search, ScanLine, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/services', label: 'Services' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

const searchableTerms = [
  'Vulnerability Scanning',
  'AI-Powered Remediation',
  'Actionable Reporting',
  'SQL Injection',
  'Cross-Site Scripting (XSS)',
  'Broken Authentication',
  'Security Misconfiguration',
  'Pricing',
  'Features',
  'Testimonials',
  'About',
  'Services'
];

type HeaderProps = {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
};


export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSuggestions([]);
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
  
  React.useEffect(() => {
    setIsSearchOpen(false);
    if(setSearchQuery){
      setSearchQuery('');
    }
    setSuggestions([]);
  }, [pathname, setSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery?.(query);
    if (query.length > 1) {
      const filteredSuggestions = searchableTerms.filter(term =>
        term.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery?.(suggestion);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className={cn("mr-4 hidden items-center md:flex")}>
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))]" />
            <span className="font-bold">CyberWall</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Desktop Search */}
          <div className="relative hidden sm:flex items-center gap-2 justify-end flex-1">
              <div ref={searchRef} className={cn('relative transition-all duration-300', !isSearchOpen ? 'w-0 opacity-0' : 'w-full max-w-sm')}>
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-10"
                  aria-hidden={!isSearchOpen}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchOpen(true)}
                />
                 <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                 {suggestions.length > 0 && (
                    <Card className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto z-10">
                      <ul>
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
              </div>
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-label="Toggle Search"
                >
                  <Search className="h-5 w-5" />
              </Button>
          </div>
         
          <div className="flex items-center gap-2">
             {/* Desktop Navigation */}
            <nav className="hidden items-center gap-4 text-sm lg:flex">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            <ThemeToggle />
            <div className='hidden sm:flex items-center gap-2'>
              <Button asChild>
                <Link href="/dashboard"><ScanLine className="mr-2 h-4 w-4" /> Scan Now</Link>
              </Button>
              <Button variant="outline" asChild>
                  <Link href="/signup">Sign Up</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>


          {/* Mobile Menu */}
          <div className="flex items-center sm:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Toggle Menu">
                    <Menu className="h-5 w-5" />
                </Button>
                </SheetTrigger>
                <SheetContent side="right">
                <div className="grid gap-4 py-6">
                    <SheetClose asChild>
                      <Link href="/" className="flex items-center gap-2 mb-4">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-bold">CyberWall</span>
                      </Link>
                    </SheetClose>
                    <div className="relative">
                      <Input 
                        type="search" 
                        placeholder="Search..." 
                        className="w-full pr-10"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                       {suggestions.length > 0 && (
                        <Card className="absolute top-full mt-2 w-full max-h-48 overflow-y-auto z-10">
                          <ul>
                            {suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="px-4 py-2 hover:bg-muted cursor-pointer"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      )}
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
                     <SheetClose asChild>
                        <Link
                        href="/#contact"
                        className="flex w-full items-center py-2 text-lg font-semibold"
                        >
                        Contact
                        </Link>
                    </SheetClose>
                    <div className="flex flex-col gap-2 mt-4">
                      <SheetClose asChild>
                        <Button asChild>
                            <Link href="/dashboard">Scan Now</Link>
                        </Button>
                      </SheetClose>
                       <SheetClose asChild>
                        <Button asChild variant="outline">
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild variant="outline">
                            <Link href="/login">Log In</Link>
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
