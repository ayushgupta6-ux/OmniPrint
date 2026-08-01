"use client";

import {Link} from "react-router";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/products";
import { cn } from "@/lib/utils";

const categoryImages: Record<string, string> = {
  "outdoor-signage": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "corporate-stationery": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80",
  "premium-acrylic": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
  "interior-decor": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  "recognition-events": "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",
};

export function CategoryGrid() {
  return (
    <section id="categories" className="py-20 lg:py-32 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Our Categories
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-2 text-balance">
              Everything you need{" "}
              <span className="text-muted-foreground">for your brand</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-pretty">
            From outdoor signage to corporate stationery, we offer comprehensive
            printing and signage solutions for every need.
          </p>
        </div>

        {/* Category grid - Bento style */}
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
              {/* Background image */}
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${categoryImages[category.slug]})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className={cn(
                        "font-serif text-card-foreground-hh mb-2",
                        index === 0
                          ? "text-2xl md:text-3xl lg:text-4xl"
                          : "text-xl md:text-2xl"
                      )}
                    >
                      {category.name}
                    </h3>
                    <p className="text-card-foreground-hh/80 text-sm line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {category.products.slice(0, 3).map((product) => (
                        <span
                          key={product.id}
                          className="text-xs px-2 py-1 rounded-full bg-card/10 text-card-foreground-hh/90 backdrop-blur-sm"
                        >
                          {product.name}
                        </span>
                      ))}
                      {category.products.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-card/10 text-card-foreground-hh/90 backdrop-blur-sm">
                          +{category.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center transition-all group-hover:bg-card group-hover:text-foreground">
                    <ArrowUpRight className="h-5 w-5 text-card-foreground-hh group-hover:text-foreground transition-colors" />
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
