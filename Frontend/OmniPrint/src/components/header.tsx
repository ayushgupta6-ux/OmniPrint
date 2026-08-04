"use client"; 

import { Link, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Search, Menu, X, User, Moon, Sun, LogOut, ChevronDown, Loader2, ShieldCheck, Package, Store } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useCategories, useAllProducts } from "@/hooks/useCatalog"; // <-- Import useAllProducts

export function Header({ isAuthenticated }: { isAuthenticated: boolean | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // --- NEW: Search State ---
  const [searchQuery, setSearchQuery] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [userName, setUserName] = useState("User");
  
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate(); 
  const { logout } = useAuthStore() as any;

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  
  // --- NEW: Fetch all products for live search ---
  const { data: allProducts } = useAllProducts(); 
  
  const MAX_VISIBLE_CATEGORIES = 3;
  const visibleCategories = categories?.slice(0, MAX_VISIBLE_CATEGORIES) || [];
  const moreCategories = categories?.slice(MAX_VISIBLE_CATEGORIES) || [];

  // Filter products based on search query
  const searchResults = allProducts?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

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
          console.error("Failed to decode token in header", error);
          setIsAdmin(false);
          setIsVendor(false);
        }
      }
    } else {
      setIsAdmin(false); 
      setIsVendor(false);
    }
  }, [isAuthenticated]);

  // --- NEW: Close search when clicking outside ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const effectiveTheme = mounted && theme !== "system" ? theme : "light";
  const isDark = effectiveTheme === "dark";

  const handleLogout = async () => {
    try {
       logout(); 
       navigate('/login');  
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeSearchAndNavigate = () => {
    setSearchQuery("");
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C10 9.33 8 8 6 8a4 4 0 1 0 0 8c2 0 4-1.33 6-4Z" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" stroke="#E31D2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-serif text-2xl font-normal tracking-tight bg-transparent rounded">
            OmniPrint
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          {isCategoriesLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              {visibleCategories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {category.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
              ))}

              {moreCategories.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                    More <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 ease-out z-50">
                    <div className="bg-card border border-border rounded-xl shadow-xl w-64 p-3 flex flex-col gap-1">
                      {moreCategories.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/category/${category.slug}`}
                          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          
          {/* --- DESKTOP LIVE SEARCH --- */}
          <div className="relative hidden sm:block" ref={searchContainerRef}>
            <div className={cn("flex items-center transition-all duration-300", searchOpen ? "w-72" : "w-10")}>
              {searchOpen && (
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pr-10 bg-secondary border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn("p-2 rounded-full hover:bg-secondary transition-colors", searchOpen && "absolute right-0")}
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Desktop Search Results Dropdown */}
            {searchOpen && searchQuery.length > 1 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={closeSearchAndNavigate}
                        className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground line-clamp-1">{product.name}</span>
                          <span className="text-xs text-muted-foreground">₹{product.basePrice}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

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
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Welcome, {userName?.split(" ")[0] || "User"}</span>
                
                {isAdmin && (
                  <Link to="/admin/products" className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                {

                  isVendor && (
                    <Link to="/vendor/dashboard" className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                       <Store className="h-4 w-4 " />
                      Vendor
                    </Link>
                  )
                }

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

          <button
            className="lg:hidden p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn("lg:hidden overflow-hidden transition-all duration-300", mobileMenuOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0")}>
        <div className="px-4 py-4 space-y-2 bg-background border-t border-border shadow-lg pb-8">
          
          {/* --- MOBILE LIVE SEARCH --- */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 bg-secondary border-0" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile Search Results */}
          {searchQuery.length > 1 ? (
             <div className="bg-card border border-border rounded-xl p-2 flex flex-col gap-1 mb-4">
               {searchResults.length > 0 ? (
                 searchResults.map((product) => (
                   <Link
                     key={product.id}
                     to={`/product/${product.slug}`}
                     onClick={closeSearchAndNavigate}
                     className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors"
                   >
                      <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground line-clamp-1">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.basePrice}</span>
                      </div>
                   </Link>
                 ))
               ) : (
                 <div className="p-4 text-center text-sm text-muted-foreground">
                   No products found.
                 </div>
               )}
             </div>
          ) : (
            // Only show categories when NOT actively searching on mobile
            isCategoriesLoading ? (
              <div className="p-4 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : (
              categories?.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))
            )
          )}

          {/* MOBILE LOGIN/USER STATE */}
          <div className="pt-4 mt-4 border-t border-border w-full">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4 w-full px-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">Welcome, {userName?.split(" ")[0] || "User"}</span>
                </div>
                
                {isAdmin && (
                  <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                 {

                  isVendor && (
                    <Link to="/vendor/dashboard" className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                        <Store className="h-4 w-4 " />
                        
                      Vendor
                    </Link>
                  )
                }

                <Button variant="outline" size="sm" className="gap-2 justify-center" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" className="w-full justify-center gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-center gap-2 w-full">
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