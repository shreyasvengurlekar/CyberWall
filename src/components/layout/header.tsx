
'use client';

import { Shield, Menu, Search, X, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
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
import { Highlight } from '../highlight';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@/firebase/auth/use-user';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#features', label: 'Features' },
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
  { term: 'Scanner', path: '/scanner' },
  { term: 'Scan Now', path: '/scanner' },
];


export function Header() {
  const { user, signOut } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        {/* Mobile Nav Trigger */}
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden" aria-label="Toggle Menu">
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
                    <div className="mt-4 flex flex-col gap-2">
                      <SheetClose asChild>
                          <Button asChild>
                            <Link href="/scanner">Scan Now</Link>
                          </Button>
                      </SheetClose>
                      {user ? (
                        <>
                          <SheetClose asChild>
                            <Button asChild>
                              <Link href="/dashboard">Dashboard</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button variant="outline" onClick={handleLogout}>
                              Log Out
                            </Button>
                          </SheetClose>
                        </>
                      ) : (
                        <>
                          <SheetClose asChild>
                            <Button asChild>
                              <Link href="/login">Log In</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button asChild variant="outline">
                              <Link href="/signup">Sign Up</Link>
                            </Button>
                          </SheetClose>
                        </>
                      )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>

        {/* Desktop Logo */}
        <div className="hidden md:flex items-center gap-2">
             <Link href="/" className="group flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))]" />
                <span className="text-2xl font-bold">CyberWall</span>
            </Link>
        </div>
        
        {/* Mobile Logo (centered) */}
        <div className="flex-1 flex justify-center md:hidden">
             <Link href="/" className="group flex items-center gap-2">
                <Shield className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold">CyberWall</span>
            </Link>
        </div>

        {/* Desktop Nav (centered) */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-4 text-sm">
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

        {/* Actions & Search */}
        <div className="flex items-center justify-end gap-2 md:w-auto">
          <SearchFlyout />
          <ThemeToggle />
          <div className='hidden md:flex items-center gap-2'>
            <Button asChild variant="default">
              <Link href="/scanner">Scan Now</Link>
            </Button>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                            <AvatarFallback>{user.displayName ? user.displayName.charAt(0) : 'U'}</AvatarFallback>
                        </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                        <Link href="/dashboard"><LayoutDashboard className="mr-2" /> Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        <Settings className="mr-2" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <Button asChild variant='ghost'>
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


function SearchFlyout() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const { setSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<{term: string, path: string}[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(-1);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const closeAndClearSearch = React.useCallback(() => {
    setIsSearchOpen(false);
    setLocalQuery('');
    setSearchQuery('');
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  }, [setSearchQuery]);

  React.useEffect(() => {
    closeAndClearSearch();
  }, [pathname, closeAndClearSearch]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === 'Escape') {
        closeAndClearSearch();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen && searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        closeAndClearSearch();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, closeAndClearSearch]);

  React.useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalQuery(query);
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

  const handleSuggestionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      const suggestion = activeSuggestionIndex > -1 
        ? suggestions[activeSuggestionIndex] 
        : suggestions.length > 0 ? suggestions[0] : null;
      
      if(suggestion) {
        handleSuggestionClick(suggestion);
      }
    }
  };

  const handleSuggestionClick = (suggestion: {term: string, path: string}) => {
    router.push(suggestion.path);
    closeAndClearSearch();
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSearchOpen(true)}
        aria-label="Open Search"
      >
        <Search className="h-5 w-5" />
      </Button>

      {isSearchOpen && (
        <div 
          ref={searchContainerRef}
          className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-background/80 backdrop-blur-sm animate-fade-in"
        >
          <Card className="w-full max-w-lg relative animate-fade-in-down">
            <div className='relative w-full'>
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search the site..."
                className="w-full h-14 pl-12 text-lg"
                value={localQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSuggestionKeyDown}
              />
              <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={closeAndClearSearch}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {suggestions.length > 0 && (
                <ul className="max-h-80 overflow-y-auto border-t">
                    {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        className={cn(
                        "cursor-pointer px-4 py-3 hover:bg-muted text-base",
                        index === activeSuggestionIndex && "bg-muted"
                        )}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                    >
                        <Highlight query={localQuery}>{suggestion.term}</Highlight>
                    </li>
                    ))}
                </ul>
            )}
            <div className="p-2 text-center text-xs text-muted-foreground border-t">
              Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">ESC</kbd> to close.
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
