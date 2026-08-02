import { Link, useParams, Navigate } from "react-router"; // Updated import
import { ArrowLeft, ArrowUpRight, Filter, Loader2 } from "lucide-react"; 
import { useCategories } from "@/hooks/useCatalog";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { categories, isLoading } = useCategories();
  
  if (!slug) return <Navigate to="/404" replace />;
  if (isLoading) return <div className="flex justify-center pt-32"><Loader2 className="animate-spin h-8 w-8" /></div>;

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-3xl font-serif">Category Not Found</h1>
        <Link to="/" className="text-muted-foreground hover:text-foreground">Return to Home</Link>
      </div>
    );
  }

  return (
    <main className="pt-20">
      <section className="relative h-[40vh] min-h-[300px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${category.imageUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />
        
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 lg:px-8 pb-8 lg:pb-12">
          {/* Header remains the same */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-card mb-2">{category.name}</h1>
          <p className="text-card/80 max-w-xl">{category.description}</p>
        </div>
      </section>

      {/* Render products dynamically from the backend */}
      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.products?.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`} className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-accent/50 transition-all">
                <div className="aspect-[4/3] overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}