import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Rankings", href: "/rankings", hasDropdown: true },
  { label: "Methodology", href: "/methodology" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
];

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="glass fixed left-0 right-0 top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-primary to-primary/70">
              <span className="font-mono text-sm font-bold text-primary-foreground">CI</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Corp<span className="text-primary">Index</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 250, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:block"
                >
                  <Input
                    placeholder="Search companies..."
                    className="h-9 border-border/50 bg-secondary focus:border-primary"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                </motion.div>
              ) : (
                <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </AnimatePresence>

            <ThemeToggle />
            <Link to="/apply" className="hidden sm:block">
              <Button variant="terminal" size="sm">
                Apply for Review
              </Button>
            </Link>
            <Link to="/partner" className="hidden lg:block">
              <Button variant="premium" size="sm">
                Partner
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 bg-background md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "rounded-md px-4 py-3 text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link to="/apply" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="terminal" className="w-full">
                    Apply for Review
                  </Button>
                </Link>
                <Link to="/partner" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="premium" className="w-full">
                    Partner
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
