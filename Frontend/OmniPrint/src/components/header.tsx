
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Menu, X, User, Moon, Sun, LogOut, ShieldCheck, Package, Store, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useCategories } from "@/hooks/useCatalog";

// Import our new extracted components
import { SearchBar } from "./header/SearchBar";
import { DesktopNav } from "./header/DesktopNav";
import { UserDropdown } from "./header/UserDropdown";

export function Header({ isAuthenticated }: { isAuthenticated: boolean | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [userName, setUserName] = useState("User");
  
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate(); 
  const { logout } = useAuthStore() as any;
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  useEffect(() => setMounted(true), []);

  // Auth decoding logic remains here to pass down to children
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("jwt_token"); 
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          setIsAdmin(decodedToken.role === "ADMIN"); 
          setIsVendor(decodedToken.role === "PRINT_AGENCY");
          setUserName(decodedToken.name || "User");
        } catch (error) {
          setIsAdmin(false); setIsVendor(false);
        }
      }
    } else {
      setIsAdmin(false); setIsVendor(false);
    }
  }, [isAuthenticated]);

  const effectiveTheme = mounted && theme !== "system" ? theme : "light";
  const isDark = effectiveTheme === "dark";

  const handleLogout = async () => {
    logout(); 
    navigate('/login');  
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C10 9.33 8 8 6 8a4 4 0 1 0 0 8c2 0 4-1.33 6-4Z" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" stroke="#E31D2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-serif text-2xl font-normal tracking-tight">OmniPrint</span>
        </Link>

        {/* 1. Desktop Nav Component */}
        <DesktopNav />

        <div className="flex items-center gap-3">
          {/* 2. Desktop Search Component */}
          <SearchBar />

          <Button variant="ghost" size="sm" className="hidden sm:inline-flex p-2 rounded-full hover:bg-secondary transition-colors" onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* 3. Desktop User State */}
          <div className="hidden sm:flex">
            {isAuthenticated ? (
              <UserDropdown userName={userName} isAdmin={isAdmin} isVendor={isVendor} onLogout={handleLogout} />
            ) : (
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link to="/login"><User className="h-4 w-4" /><span>Login</span></Link>
              </Button>
            )}
          </div>

          <button className="lg:hidden p-2 rounded-full hover:bg-secondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={cn("lg:hidden overflow-hidden transition-all duration-300", mobileMenuOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0")}>
        <div className="px-4 py-4 space-y-2 bg-background border-t border-border shadow-lg pb-8">
          
          {/* Mobile Search */}
          <SearchBar isMobile onNavigate={() => setMobileMenuOpen(false)} />

          {/* Mobile Categories */}
          {isCategoriesLoading ? (
            <div className="p-4 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : (
            categories?.map((category) => (
              <Link key={category.slug} to={`/category/${category.slug}`} className="block px-4 py-3 font-medium hover:bg-secondary rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                {category.name}
              </Link>
            ))
          )}

          {/* Mobile User Actions */}
          <div className="pt-4 mt-4 border-t border-border w-full">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3 px-2">
                <div className="flex items-center gap-2 font-medium border-b border-border pb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Welcome, {userName.split(" ")[0]}</span>
                </div>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-primary py-1"><Package className="h-4 w-4" /> My Orders</Link>
                {isAdmin && <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-accent py-1"><ShieldCheck className="h-4 w-4" /> Admin Panel</Link>}
                {isVendor && <Link to="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-accent py-1"><Store className="h-4 w-4" /> Vendor Dashboard</Link>}
                <Button variant="outline" size="sm" className="gap-2 justify-center mt-2" onClick={handleLogout}><LogOut className="h-4 w-4" /> Logout</Button>
              </div>
            ) : (
              <Button asChild variant="outline" className="w-full gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}><User className="h-4 w-4" /> Login / Sign up</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}