"use client"; // Keep this! We need it for useState and useTheme

import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Search, Menu, X, User, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
 



const navigation = [
  { name: "Signage", href: "/category/outdoor-signage" },
  { name: "Corporate", href: "/category/corporate-stationery" },
  { name: "Premium", href: "/category/premium-acrylic" },
  { name: "Decor", href: "/category/interior-decor" },
  { name: "Awards", href: "/category/recognition-events" },
];

// 2. Accept the user prop here! DO NOT call getUserSession() inside this file.
export function Header({ isAuthenticated }: { isAuthenticated: boolean | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate(); 
  const { logout } = useAuthStore() as any;

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveTheme = mounted && theme !== "system" ? theme : "light";
  const isDark = effectiveTheme === "dark";

  // 3. Create the logout function
  const handleLogout = async () => {
    try {
        
        navigate('/login');  
       logout(); // Call the logout function from Zustand store
       
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        {/* Logo */}
<Link to="/" className="flex items-center gap-3">
  {/* Corrected OmniPrint Infinity Icon */}
  <svg 
    width="40" 
    height="40" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left Blue Loop */}
    <path 
      d="M12 12C10 9.33 8 8 6 8a4 4 0 1 0 0 8c2 0 4-1.33 6-4Z" 
      stroke="#0056B3" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Right Red Loop */}
    <path 
      d="M12 12c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" 
      stroke="#E31D2A" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>

  {/* Company Name */}
  <span className="font-serif text-2xl font-normal tracking-tight bg-transparent rounded">
    OmniPrint
  </span>
</Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <div className={cn("flex items-center transition-all duration-300", searchOpen ? "w-64" : "w-10")}>
              {searchOpen && (
                <Input
                  type="text"
                  placeholder="Search signage, vinyl..."
                  className="pr-10 bg-secondary border-0"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn("p-2 rounded-full hover:bg-secondary transition-colors", searchOpen && "absolute right-0")}
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* DESKTOP LOGIN/USER STATE */}
          <div className="hidden sm:flex">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Welcome, User</span>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link to="/login" className="inline-flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn("lg:hidden overflow-hidden transition-all duration-300", mobileMenuOpen ? "max-h-96" : "max-h-0")}>
        <div className="px-4 py-4 space-y-2 bg-background border-t border-border">
          {/* Mobile search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search signage, vinyl..." className="pl-10 bg-secondary border-0" />
          </div>

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block px-4 py-3 text-base font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* MOBILE LOGIN/USER STATE */}
          <div className="pt-4 border-t border-border w-full">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-4 w-full px-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">Welcome, User</span>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" className="w-full justify-center gap-2">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 w-full">
                  <User className="h-4 w-4" />
                  <span>Login / Sign up</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}