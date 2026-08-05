import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router";
import { useConfigStore } from "@/store/useConfigStore";
import type { Product } from "@/api/api";

// Import our new sub-components
import { ImageGallery } from "./product/ImageGallery";
import { ProductFilters } from "./product/ProductFilters";
import { DesignPathSelector } from "./product/DesignPathSelector";
import { QuantitySelector } from "./product/QuantitySelector";

interface ProductConfiguratorProps {
  product: Product;
  images: string[];
}

export function ProductConfigurator({ product, images }: ProductConfiguratorProps) {
  const { selections, designPath, needsInstallation, setNeedsInstallation, resetConfig } = useConfigStore();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    resetConfig();
    setQuantity(1);
  }, [product.id, resetConfig]);

  const isConfigComplete =
    product.filters &&
    Object.keys(selections).length === product.filters.length &&
    designPath;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <ImageGallery images={images} productName={product.name} />

      <div className="space-y-8">
        <div>
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            {product.categories?.[0]?.name || "Product"}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl mt-2 mb-4">{product.name}</h1>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        <ProductFilters filters={product.filters} />
        
        <DesignPathSelector />

        {/* Installation toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">Professional Installation</div>
              <div className="text-xs text-muted-foreground">Available in Noida / NCR region</div>
            </div>
          </div>
          <Switch checked={needsInstallation} onCheckedChange={setNeedsInstallation} />
        </div>

        <div className="pt-6 border-t border-border space-y-5">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

          {/* Configuration summary */}
          {Object.keys(selections).length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Your Configuration</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selections).map(([key, value]) => (
                  <span key={key} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground border border-border">
                    {key}: {value as string}
                  </span>
                ))}
                {needsInstallation && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                    + Installation
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            Get instant volume discounts on bulk orders!
          </p>

          <Button
            size="lg"
            className="w-full text-base font-semibold shadow-md mt-6"
            disabled={!isConfigComplete}
            onClick={() => {
              navigate("/checkout", {
                state: {
                  productId: product.id,
                  quantity: quantity,
                  selections: selections,
                  needsInstallation: needsInstallation,
                  designPath: designPath,
                },
              });
            }}
          >
            {isConfigComplete ? "Proceed to Checkout" : "Complete Configuration"}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-2">
            Delivery location is required on the next step to calculate your final price and volume discounts.
          </p>
        </div>
      </div>
    </div>
  );
}