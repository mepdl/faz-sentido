import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  TrendingUp, 
  DollarSign, 
  Brain, 
  Briefcase 
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Negócios", href: "/category/negocios", icon: Briefcase },
    { name: "Dinheiro", href: "/category/dinheiro", icon: DollarSign },
    { name: "Mentalidade", href: "/category/mentalidade", icon: Brain },
    { name: "Crescimento", href: "/category/crescimento", icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Faz Sentido." className="h-10 w-auto" />
            <span className="text-xl font-bold font-display tracking-tight text-primary hidden sm:block">
              Faz Sentido.
            </span>
            <span className="text-xl font-bold font-display tracking-tight text-primary sm:hidden">
              FS.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="ml-4">
                  Admin
                </Button>
              </Link>
            ) : (
              <a href="/api/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  Entrar
                </Button>
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 text-base font-medium p-2 rounded-md hover:bg-muted",
                  location === link.href ? "text-primary bg-muted/50" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {user ? (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-start" variant="outline">
                  Painel Admin
                </Button>
              </Link>
            ) : (
              <a href="/api/login">
                <Button className="w-full" variant="default">
                  Entrar
                </Button>
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
