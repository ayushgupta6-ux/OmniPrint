import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAllProducts } from "@/hooks/useCatalog";

interface SearchBarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function SearchBar({ isMobile = false, onNavigate }: SearchBarProps) {
  const [searchOpen, setSearchOpen] = useState(isMobile);
  const [searchQuery, setSearchQuery] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: allProducts } = useAllProducts();

  const searchResults = allProducts?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    if (isMobile) return; // Don't close on click outside for mobile
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const handleSelect = () => {
    setSearchQuery("");
    if (!isMobile) setSearchOpen(false);
    if (onNavigate) onNavigate();
  };

  return (
    <div className={cn("relative", isMobile ? "w-full mb-4" : "hidden sm:block")} ref={searchContainerRef}>
      <div className={cn("flex items-center transition-all duration-300", searchOpen && !isMobile ? "w-72" : isMobile ? "w-full" : "w-10")}>
        {(searchOpen || isMobile) && (
          <div className="relative w-full">
            {isMobile && <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            <Input
              type="text"
              placeholder="Search products..."
              className={cn("bg-secondary border-0", isMobile ? "pl-10" : "pr-10")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={!isMobile && searchOpen}
            />
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={cn("p-2 rounded-full hover:bg-secondary transition-colors", searchOpen && "absolute right-0")}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {(searchOpen || isMobile) && searchQuery.length > 1 && (
        <div className={cn("absolute z-50 bg-card border border-border shadow-xl overflow-hidden", 
          isMobile ? "top-full left-0 right-0 mt-2 rounded-xl" : "top-full right-0 mt-2 w-80 rounded-xl"
        )}>
          {searchResults.length > 0 ? (
            <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={handleSelect}
                  className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {product.images?.length ? (
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
            <div className="p-4 text-center text-sm text-muted-foreground">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
}