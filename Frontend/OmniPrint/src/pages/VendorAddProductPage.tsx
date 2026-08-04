import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Trash2, Loader2, Store, Percent, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAllProducts } from "@/hooks/useCatalog"; // Reusing your existing hook

export default function VendorAddProductPage() {
  const navigate = useNavigate();
  const { data: masterProducts, isLoading: isCatalogLoading } = useAllProducts();

  const [vendorId, setVendorId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [productId, setProductId] = useState("");
  const [vendorPrice, setVendorPrice] = useState<number | "">("");
  
  // Discount Tiers State
  const [discountTiers, setDiscountTiers] = useState([
    { minQuantity: 10, maxQuantity: 49, discountPercentage: 5.0 }
  ]);

  // Decode JWT on mount to get vendorId
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setVendorId(payload.userId);
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, []);

  // --- Dynamic Array Handlers for Tiers ---
  const addTier = () => {
    setDiscountTiers([
      ...discountTiers, 
      { minQuantity: 50, maxQuantity: 0, discountPercentage: 10.0 }
    ]);
  };

  const removeTier = (index: number) => {
    setDiscountTiers(discountTiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: string, value: number) => {
    const newTiers = [...discountTiers];
    (newTiers[index] as any)[field] = value;
    setDiscountTiers(newTiers);
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) {
      alert("Vendor ID not found. Please log in again.");
      return;
    }
    if (!productId) {
      alert("Please select a product from the master catalog.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("jwt_token");
      
      // Format payload (convert maxQuantity 0 or empty to null for the backend)
      const formattedTiers = discountTiers.map(tier => ({
        minQuantity: tier.minQuantity,
        maxQuantity: tier.maxQuantity > 0 ? tier.maxQuantity : null,
        discountPercentage: tier.discountPercentage
      }));

      const payload = {
        productId: productId,
        vendorPrice: Number(vendorPrice),
        discountTiers: formattedTiers
      };

      const response = await fetch(`http://localhost:8080/api/vendors/${vendorId}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to add product");
      }

      alert("Product successfully added to your catalog!");
      navigate("/vendor/dashboard");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCatalogLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-serif flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          Add Product to Shop
        </h1>
        <p className="text-muted-foreground mt-2">
          Select a master product, set your base price, and configure your volume discounts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- 1. Product Selection & Base Price --- */}
        <Card className="p-6 border-border shadow-sm space-y-6">
          <h2 className="text-xl font-medium border-b border-border pb-3 flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-primary" /> Core Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="productSelect">Select Master Product</Label>
              <select 
                id="productSelect"
                required
                className="w-full p-3 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="" disabled>-- Select a Product --</option>
                {masterProducts?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">This pulls the images and description from the main catalog.</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="vendorPrice">Your Base Price (₹) per Unit</Label>
              <Input 
                id="vendorPrice"
                type="number" 
                step="0.01" 
                min="0.01"
                required
                placeholder="e.g. 150.00"
                value={vendorPrice} 
                onChange={(e) => setVendorPrice(parseFloat(e.target.value))} 
              />
              <p className="text-xs text-muted-foreground">The price for a single unit before any volume discounts.</p>
            </div>
          </div>
        </Card>

        {/* --- 2. Volume Discount Tiers --- */}
        <Card className="p-6 border-border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <h2 className="text-xl font-medium flex items-center gap-2">
                <Percent className="h-5 w-5 text-green-600" /> Volume Discounts
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Attract bulk buyers by offering tier-based discounts.</p>
            </div>
            <Button type="button" variant="outline" onClick={addTier}>
              <Plus className="h-4 w-4 mr-2"/> Add Tier
            </Button>
          </div>

          <div className="space-y-4">
            {discountTiers.map((tier, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 items-end p-4 border border-border rounded-lg bg-secondary/20 relative">
                
                <div className="space-y-2 flex-1 w-full">
                  <Label>Min Quantity</Label>
                  <Input 
                    type="number" 
                    min="1"
                    required
                    value={tier.minQuantity} 
                    onChange={(e) => updateTier(index, "minQuantity", parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2 flex-1 w-full">
                  <Label>Max Quantity (Leave 0 for ∞)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={tier.maxQuantity} 
                    onChange={(e) => updateTier(index, "maxQuantity", parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2 flex-1 w-full">
                  <Label>Discount Percentage (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="99"
                    required
                    value={tier.discountPercentage} 
                    onChange={(e) => updateTier(index, "discountPercentage", parseFloat(e.target.value))}
                  />
                </div>

                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon"
                  className="mb-0.5 shrink-0" 
                  onClick={() => removeTier(index)}
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            ))}

            {discountTiers.length === 0 && (
              <div className="text-center py-6 text-muted-foreground bg-secondary/20 rounded-lg border border-dashed">
                No volume discounts configured. Customers will pay the base price for all quantities.
              </div>
            )}
          </div>
        </Card>

        {/* --- Submit Button --- */}
        <Button type="submit" size="lg" className="w-full py-6 text-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Saving to Catalog...</>
          ) : (
            "Add Product to My Catalog"
          )}
        </Button>
      </form>
    </main>
  );
}