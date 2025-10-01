import Link from "next/link";
import { Shield, Github, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com", label: "Instagram" },
  ];
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col-reverse items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="flex items-center gap-2 group mb-2">
              <Shield className="h-6 w-6 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_4px_hsl(var(--primary))]" />
              <span className="font-bold">CyberWall</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CyberWall. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div className="flex gap-4 text-sm text-muted-foreground">
                <Link href="/services" className="hover:text-foreground">Services</Link>
                <Link href="/#pricing" className="hover:text-foreground">Pricing</Link>
                <Link href="/about" className="hover:text-foreground">About</Link>
                <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
