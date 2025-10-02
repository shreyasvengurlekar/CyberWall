'use client';

import { Shield, Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useSearch } from '@/context/search-provider';


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


export function Header() {
  const { searchQuery, setSearchQuery } = useSearch();
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
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  React.useEffect(() => {
    if (pathname) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSuggestions([]);
    }
  }, [pathname, setSearchQuery]);
  
    const handleToggleSearch = () => {
    setIsSearchOpen(prev => !prev);
    if (!isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
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
    if (e.key === 'Escape') {
      setSuggestions([]);
      setIsSearchOpen(false);
      return;
    }
    
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
      e.preventDefault();
      if (activeSuggestionIndex > -1) {
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      } else if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      }
    }
  };

  const handleSuggestionClick = (suggestion: {term: string, path: string}) => {
    router.push(suggestion.path);
    setSearchQuery('');
    setSuggestions([]);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        {/* Mobile menu */}
        <div className="flex items-center md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="mr-2" aria-label="Toggle Menu">
                    <Menu className="h-5 w-5" />
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="grid gap-4 py-6">
                        <SheetClose asChild>
                        <Link href="/" className="mb-4 flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold">CyberWall</span>
                        </Link>
                        </SheetClose>
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
                        <div className="mt-4 flex flex-col gap-2">
                            <SheetClose asChild>
                                <Button asChild>
                                <Link href="/dashboard">Scan Now</Link>
                                </Button>
                            </SheetClose>
                             <SheetClose asChild>
                                <Button asChild variant="ghost">
                                <Link href="/login">Log In</Link>
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button asChild variant="outline">
                                <Link href="/signup">Sign Up</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
             <Link href="/" className="group flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))]" />
                <span className="text-2xl font-bold">CyberWall</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
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

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="relative" ref={searchRef}>
            <div className='md:hidden'>
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(prev => !prev)}
                  aria-label="Toggle Search"
                >
                  {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </Button>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
                <div
                    className={cn(
                        "flex items-center gap-2 transition-all duration-300",
                        isSearchOpen ? "w-64" : "w-0"
                    )}
                    >
                    <div className={cn("relative w-full", isSearchOpen ? 'opacity-100' : 'opacity-0')}>
                        <Input
                            ref={inputRef}
                            type="search"
                            placeholder="Search..."
                            className={cn(
                                "w-full pl-10 transition-all duration-300",
                                isSearchOpen ? "w-full" : "w-0"
                            )}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                        />
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleSearch}
                    aria-label="Toggle Search"
                    >
                    {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </Button>
            </div>

            {isSearchOpen && (
              <div className="absolute top-full mt-2 w-screen max-w-sm -right-4 md:right-0 md:w-full md:max-w-sm">
                  <div className="relative p-4 md:p-0">
                      <div className="md:hidden w-full">
                           <Input
                              ref={inputRef}
                              type="search"
                              placeholder="Search..."
                              className="w-full pl-10"
                              value={searchQuery}
                              onChange={handleSearchChange}
                              onKeyDown={handleKeyDown}
                            />
                            <Search className="absolute left-7 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      {suggestions.length > 0 && (
                          <Card className="absolute top-full z-10 mt-2 w-full max-h-60 overflow-y-auto">
                          <ul>
                              {suggestions.map((suggestion, index) => (
                              <li
                                  key={index}
                                  className={cn(
                                  "cursor-pointer px-4 py-2 hover:bg-muted",
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
              </div>
            )}
          </div>

          <ThemeToggle />

          <div className='hidden md:flex items-center gap-2'>
            <Button asChild>
              <Link href="/dashboard">Scan Now</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
