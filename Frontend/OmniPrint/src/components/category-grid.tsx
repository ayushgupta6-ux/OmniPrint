import { Link } from "react-router"; // Updated to standard react-router-dom
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCatalog";
import { cn } from "@/lib/utils";

export function CategoryGrid() {
  const { categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  if (isError) {
    return <div className="text-center py-32 text-red-500">Failed to load categories.</div>;
  }

  return (
    <section id="categories" className="py-20 lg:py-32 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header section remains exactly the same as your code */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
                index === 0 && "lg:col-span-2 lg:row-span-2",
                index === 0 ? "aspect-square md:aspect-[2/1] lg:aspect-square" : "aspect-[4/3]"
              )}
            >
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={cn("font-serif text-white mb-2", index === 0 ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl")}>
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
                    
                    {/* Render Products dynamically */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {category.products?.slice(0, 3).map((product) => (
                        <span key={product.id} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white backdrop-blur-sm">
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="h-5 w-5 text-white group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}