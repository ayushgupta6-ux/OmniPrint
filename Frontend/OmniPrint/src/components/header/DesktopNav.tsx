import { Link } from "react-router";
import { ChevronDown, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCatalog";

export function DesktopNav() {
  const { categories, isLoading } = useCategories();
  
  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  if (!categories) return null;

  const visibleCategories = categories.slice(0, 3);
  const moreCategories = categories.slice(3);

  return (
    <div className="hidden lg:flex lg:items-center lg:gap-x-8">
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
    </div>
  );
}