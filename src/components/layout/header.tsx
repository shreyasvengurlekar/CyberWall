'use client';

import { Shield, Menu, Search } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#testimonials', label: 'Testimonials' },
  { href: '/about', label: 'About' },
];

type HeaderProps = {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  setIsLoading?: (isLoading: boolean) => void;
};


export function Header({ searchQuery, setSearchQuery, setIsLoading }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const handleLinkClick = (href: string) => {
    if (pathname !== href && setIsLoading) {
      setIsLoading(true);
    }
  };

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
  
  React.useEffect(() => {
    setIsSearchOpen(false);
    if(setSearchQuery){
      setSearchQuery('');
    }
  }, [pathname, setSearchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className={cn("mr-4 hidden items-center md:flex")}>
          <Link href="/" onClick={() => handleLinkClick('/')} className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))]" />
            <span className="font-bold">CyberWall</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Desktop Search */}
          <div className="relative hidden sm:flex items-center gap-2 justify-end flex-1">
              <div ref={searchRef} className={cn('relative w-full transition-all duration-300', !isSearchOpen ? 'max-w-0 opacity-0' : 'max-w-sm')}>
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
            <nav className="hidden items-center gap-6 text-sm lg:flex">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className="font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            <ThemeToggle />
            <div className='hidden sm:flex items-center gap-2'>
              <Button variant="ghost" asChild>
                  <Link href="/login" onClick={() => handleLinkClick('/login')}>Log In</Link>
              </Button>
              <Button asChild>
                  <Link href="/signup" onClick={() => handleLinkClick('/signup')}>Sign Up</Link>
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
                      <Link href="/" onClick={() => handleLinkClick('/')} className="flex items-center gap-2 mb-4">
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
                        onChange={(e) => setSearchQuery?.(e.target.value)}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                        <Link
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className="flex w-full items-center py-2 text-lg font-semibold"
                        >
                        {link.label}
                        </Link>
                    </SheetClose>
                    ))}
                     <SheetClose asChild>
                        <Link
                        href="/#contact"
                        onClick={() => handleLinkClick('/#contact')}
                        className="flex w-full items-center py-2 text-lg font-semibold"
                        >
                        Contact
                        </Link>
                    </SheetClose>
                    <div className="flex flex-col gap-2 mt-4">
                      <SheetClose asChild>
                        <Button asChild>
                            <Link href="/signup" onClick={() => handleLinkClick('/signup')}>Sign Up</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild variant="outline">
                            <Link href="/login" onClick={() => handleLinkClick('/login')}>Log In</Link>
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

    