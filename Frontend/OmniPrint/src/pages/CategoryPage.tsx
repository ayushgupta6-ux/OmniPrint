 
import { Link, useParams, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight, Filter } from "lucide-react"; 
import { categories, getCategoryBySlug } from "@/lib/products";
import { Button } from "@/components/ui/button";

const categoryImages: Record<string, string> = {
  "outdoor-signage": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  "corporate-stationery": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&q=80",
  "premium-acrylic": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
  "interior-decor": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
  "recognition-events": "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&q=80",
};

const productImages: Record<string, string> = {
  "flex-banners": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "solvent-print": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
  "standees": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
  "backdrops": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  "night-glow": "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=600&q=80",
  "fire-exit": "https://images.unsplash.com/photo-1586488628891-1c3906d3c7a4?w=600&q=80",
  "certificates": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80",
  "brochures": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
  "leaflets": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
  "folders": "https://images.unsplash.com/photo-1568205631548-c63ee01a2f6f?w=600&q=80",
  "clipboards": "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&q=80",
  "3d-letters": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
  "acrylic-molding": "https://images.unsplash.com/photo-1580893246395-52aead8960dc?w=600&q=80",
  "sandwich-posters": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
  "ss-engraving": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "led-boards": "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=600&q=80",
  "photo-frames": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  "frosted-film": "https://images.unsplash.com/photo-1505409859467-3a796fd5798e?w=600&q=80",
  "cut-vinyl": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "pin-boards": "https://images.unsplash.com/photo-1573588028698-f4759befb09a?w=600&q=80",
  "white-boards": "https://images.unsplash.com/photo-1573588028698-f4759befb09a?w=600&q=80",
  "trophies": "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80",
  "badges": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
  "easel-stands": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Guard against undefined slug
  if (!slug) {
    return <Navigate to="/404" replace />;
  }

  const category = getCategoryBySlug(slug);

  // Replaces Next.js notFound()
  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-3xl font-serif">Category Not Found</h1>
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <main className="pt-20">
        {/* Hero section */}
        <section className="relative h-[40vh] min-h-[300px] flex items-end">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${categoryImages[category.slug]})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />
          
          <div className="relative z-10 mx-auto max-w-7xl w-full px-4 lg:px-8 pb-8 lg:pb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-card/80 hover:text-card mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-card mb-2">
              {category.name}
            </h1>
            <p className="text-card/80 max-w-xl">
              {category.description}
            </p>
          </div>
        </section>

        {/* Filters bar */}
        <section className="border-b border-border sticky top-[73px] bg-background/95 backdrop-blur-md z-30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Primary Filters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {category.primaryFilters.map((filter) => (
                    <span
                      key={filter}
                      className="text-xs px-3 py-1 rounded-full bg-secondary text-foreground"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {category.products.length} products
              </span>
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
                >
                  {/* Product image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${productImages[product.slug] || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80"})`,
                      }}
                    />
                  </div>

                  {/* Product info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors">
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                      </div>
                    </div>

                    {/* Filter tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.filters.slice(0, 2).map((filter) => (
                        <span
                          key={filter.label}
                          className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground"
                        >
                          {filter.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="font-serif text-2xl md:text-3xl mb-4">
              Need help choosing?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Our experts can help you select the perfect product for your needs.
              Get a free consultation today.
            </p>
            <Button size="lg" className="gap-2">
              Get Expert Advice
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}