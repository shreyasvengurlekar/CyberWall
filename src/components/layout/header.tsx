'use client';

import { Shield, Menu, Search, ScanLine } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useRouter } from 'next/navigation';

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
  { term: 'Home', path: '/' },
  { term: 'Features', path: '/#features' },
  { term: 'How It Works', path: '/#how-it-works' },
  { term: 'Testimonials', path: '/#testimonials' },
  { term: 'Pricing', path: '/#pricing' },
  { term: 'Free Plan', path: '/#pricing' },
  { term: 'Pro Plan', path: '/#pricing' },
  { term: 'Business Plan', path: '/#pricing' },
  { term: 'Contact', path: '/#contact' },
  { term: 'Get in Touch', path: '/#contact' },
  { term: 'Services', path: '/services' },
  { term: 'SQL Injection', path: '/services/sql-injection' },
  { term: 'Cross-Site Scripting (XSS)', path: '/services/xss' },
  { term: 'Broken Authentication', path: '/services/broken-authentication' },
  { term: 'XML External Entity (XXE)', path: '/services/xxe' },
  { term: 'Broken Access Control', path: '/services/broken-access-control' },
  { term: 'Security Misconfiguration', path: '/services/security-misconfiguration' },
  { term: 'Insecure Deserialization', path: '/services/insecure-deserialization' },
  { term: 'Known Vulnerabilities', path: '/services/known-vulnerabilities' },
  { term: 'Insufficient Logging & Monitoring', path: '/services/insufficient-logging' },
  { term: 'About', path: '/about' },
  { term: 'My Journey', path: '/about' },
  { term: 'Project Timeline', path: '/about' },
  { term: 'Technologies', path: '/about' },
  { term: 'Skills', path: '/about' },
  { term: 'Dashboard', path: '/dashboard' },
  { term: 'Login', path: '/login' },
  { term: 'Sign Up', path: '/signup' },
  { term: 'Privacy Policy', path: '/privacy'},
  { term: 'Terms of Service', path: '/terms'},
];


type HeaderProps = {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
};


export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<{term: string, path: string}[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(-1);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

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
    if (isSearchOpen && window.innerWidth > 640) { // Only auto-focus on desktop
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
    if (query.length > 0) {
      const filteredSuggestions = searchableTerms.filter(item =>
        item.term.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex =>
        prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex =>
        prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1
      );
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex > -1) {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setIsSearchOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: {term: string, path: string}) => {
    router.push(suggestion.path);
    setSearchQuery?.('');
    setSuggestions([]);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Toggle Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-6">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                    <span className="font-bold text-2xl">CyberWall</span>
                  </Link>
                </SheetClose>
                <div className="relative">
                  <Input 
                    type="search" 
                    placeholder="Search..." 
                    className="w-full pr-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   {suggestions.length > 0 && (
                    <Card className="absolute top-full mt-2 w-full max-h-48 overflow-y-auto z-10">
                      <ul>
                        {suggestions.map((suggestion, index) => (
                          <SheetClose asChild key={index}>
                          <li
                            className={cn(
                              "px-4 py-2 hover:bg-muted cursor-pointer",
                              index === activeSuggestionIndex && "bg-muted"
                            )}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setActiveSuggestionIndex(index)}
                          >
                            {suggestion.term}
                          </li>
                          </SheetClose>
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
          <Link href="/" className="flex items-center gap-2 group ml-4 md:ml-0">
            <Shield className="h-8 w-8 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))]" />
            <span className="font-bold text-2xl hidden sm:inline-block">CyberWall</span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
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
        </div>
          
        <div className="flex items-center gap-2">
            <div className="relative hidden sm:flex items-center gap-2" ref={searchRef}>
              <div className={cn('relative transition-all duration-300', !isSearchOpen ? 'w-0 opacity-0 pointer-events-none' : 'w-full max-w-sm opacity-100')}>
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={handleKeyDown}
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                {suggestions.length > 0 && (
                    <Card className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto z-10">
                      <ul>
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className={cn(
                              "px-4 py-2 hover:bg-muted cursor-pointer",
                              index === activeSuggestionIndex && "bg-muted"
                            )}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setActiveSuggestionIndex(index)}
                          >
                            {suggestion.term}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
              </div>
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(prev => !prev)}
                  aria-label="Toggle Search"
                >
                  <Search className="h-5 w-5" />
              </Button>
            </div>
            
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
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

       {isSearchOpen && (
        <div className="sm:hidden absolute top-0 left-0 w-full h-16 bg-background border-b z-50 flex items-center px-4 animate-fade-in-down">
           <div className="relative w-full" ref={searchRef}>
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                {suggestions.length > 0 && (
                  <Card className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto z-10">
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className={cn(
                            "px-4 py-2 hover:bg-muted cursor-pointer",
                            index === activeSuggestionIndex && "bg-muted"
                          )}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                        >
                          {suggestion.term}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
            </div>
             <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
            </Button>
        </div>
      )}
    </header>
  );
}
