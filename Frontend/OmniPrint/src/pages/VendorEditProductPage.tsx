import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Plus, Trash2, Loader2, Store, Percent, PackageOpen, Wrench, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAllProducts } from "@/hooks/useCatalog";
import { api } from '@/api/api';

export default function VendorEditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: masterProducts, isLoading: isCatalogLoading } = useAllProducts();

  const [vendorId, setVendorId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingVendorProduct, setIsLoadingVendorProduct] = useState(true);

  // Form State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [vendorPrice, setVendorPrice] = useState<number | "">("");
  const [offersInstallation, setOffersInstallation] = useState(false);
  const [installationFee, setInstallationFee] = useState<number | "">("");
  const [discountTiers, setDiscountTiers] = useState<any[]>([]);
  const [filterPricings, setFilterPricings] = useState<any[]>([]);

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

  // Fetch specific vendor product data to pre-fill
  useEffect(() => {
    if (!vendorId || !productId || !masterProducts) return;

    const fetchVendorProduct = async () => {
      try {
        const catalog = await api.vendor.getVendorProducts(vendorId);
        
        const currentItem = catalog.find((c: any) => c.productId === productId);
        if (currentItem) {
          const masterMatch = masterProducts.find((p) => p.id === productId);
          setSelectedProduct(masterMatch);
          setVendorPrice(currentItem.vendorPrice);
          setOffersInstallation(currentItem.offersInstallation || false);
          setInstallationFee(currentItem.installationFee || "");
          
          setDiscountTiers(currentItem.discountTiers?.map((t: any) => ({
            minQuantity: t.minQuantity,
            maxQuantity: t.maxQuantity || 0,
            discountPercentage: t.discountPercentage
          })) || []);

          setFilterPricings(currentItem.filterPricings || []);
        } else {
          alert("Product not found in your catalog.");
          navigate("/vendor/dashboard");
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setIsLoadingVendorProduct(false);
      }
    };

    fetchVendorProduct();
  }, [vendorId, productId, masterProducts, navigate]);

  const handleFilterSurchargeChange = (filterLabel: string, optionName: string, price: number) => {
    const existingIndex = filterPricings.findIndex(
      (f) => f.filterLabel === filterLabel && f.optionName === optionName
    );

    if (price <= 0 || isNaN(price)) {
      if (existingIndex > -1) setFilterPricings(filterPricings.filter((_, i) => i !== existingIndex));
    } else {
      if (existingIndex > -1) {
        const updated = [...filterPricings];
        updated[existingIndex].additionalPrice = price;
        setFilterPricings(updated);
      } else {
        setFilterPricings([...filterPricings, { filterLabel, optionName, additionalPrice: price }]);
      }
    }
  };

  const addTier = () => setDiscountTiers([...discountTiers, { minQuantity: 50, maxQuantity: 0, discountPercentage: 10.0 }]);
  const removeTier = (index: number) => setDiscountTiers(discountTiers.filter((_, i) => i !== index));
  const updateTier = (index: number, field: string, value: number) => {
    const newTiers = [...discountTiers];
    (newTiers[index] as any)[field] = value;
    setDiscountTiers(newTiers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!vendorId) throw new Error("Vendor ID is required");
      const payload = {
        productId: productId,
        vendorPrice: Number(vendorPrice),
        offersInstallation,
        installationFee: offersInstallation ? Number(installationFee) : 0,
        discountTiers: discountTiers.map((tier) => ({
          minQuantity: tier.minQuantity,
          maxQuantity: tier.maxQuantity > 0 ? tier.maxQuantity : null,
          discountPercentage: tier.discountPercentage,
        })),
        filterPricings,
      };

      await api.vendor.updateVendorProduct(vendorId, productId!, payload);
      alert("Product pricing updated successfully!");
      navigate("/vendor/dashboard");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCatalogLoading || isLoadingVendorProduct) {
    return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-serif flex items-center gap-3"><Store className="h-8 w-8 text-primary" /> Edit Product Pricing</h1>
        <p className="text-muted-foreground mt-2">Update your base prices, options, and volume discounts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-2 border-b pb-3"><PackageOpen className="h-5 w-5 text-primary" /> Core Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Product ID</Label>
              <Input disabled value={productId} className="bg-secondary/50 font-mono" />
            </div>
            <div className="space-y-3">
              <Label>Base Unit Price (₹)</Label>
              <Input type="number" step="0.01" min="0.01" required value={vendorPrice} onChange={(e) => setVendorPrice(parseFloat(e.target.value))} />
            </div>
          </div>
        </Card>

        {selectedProduct?.filters?.length > 0 && (
          <Card className="p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-medium flex items-center gap-2 border-b pb-3"><Layers className="h-5 w-5 text-indigo-600" /> Filter Option Surcharges</h2>
            <div className="space-y-6">
              {selectedProduct.filters.map((filter: any) => (
                <div key={filter.label} className="p-4 border rounded-lg bg-secondary/10 space-y-3">
                  <span className="font-semibold text-sm">{filter.label} Options</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {filter.options.map((option: string) => {
                      const currentVal = filterPricings.find((f) => f.filterLabel === filter.label && f.optionName === option)?.additionalPrice || "";
                      return (
                        <div key={option} className="space-y-1">
                          <Label className="text-xs text-muted-foreground">{option}</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">+₹</span>
                            <Input type="number" min="0" className="pl-8 text-sm" value={currentVal} onChange={(e) => handleFilterSurchargeChange(filter.label, option, parseFloat(e.target.value))} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium flex items-center gap-2"><Wrench className="h-5 w-5 text-amber-600" /> Professional Installation</h2>
            </div>
            <Switch checked={offersInstallation} onCheckedChange={setOffersInstallation} />
          </div>
          {offersInstallation && (
            <div className="pt-4 border-t max-w-xs space-y-2">
              <Label>Flat Installation Fee (₹)</Label>
              <Input type="number" min="0" required value={installationFee} onChange={(e) => setInstallationFee(parseFloat(e.target.value))} />
            </div>
          )}
        </Card>

        <Card className="p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-medium flex items-center gap-2"><Percent className="h-5 w-5 text-green-600" /> Volume Discounts</h2>
            <Button type="button" variant="outline" onClick={addTier}><Plus className="h-4 w-4 mr-2"/> Add Tier</Button>
          </div>
          <div className="space-y-4">
            {discountTiers.map((tier, index) => (
              <div key={index} className="flex gap-4 items-end p-4 border rounded-lg bg-secondary/20">
                <div className="space-y-2 flex-1"><Label>Min Qty</Label><Input type="number" min="1" required value={tier.minQuantity} onChange={(e) => updateTier(index, "minQuantity", parseInt(e.target.value))} /></div>
                <div className="space-y-2 flex-1"><Label>Max Qty (0 for ∞)</Label><Input type="number" min="0" value={tier.maxQuantity} onChange={(e) => updateTier(index, "maxQuantity", parseInt(e.target.value))} /></div>
                <div className="space-y-2 flex-1"><Label>Discount (%)</Label><Input type="number" step="0.1" min="0" max="99" required value={tier.discountPercentage} onChange={(e) => updateTier(index, "discountPercentage", parseFloat(e.target.value))} /></div>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeTier(index)}><Trash2 className="h-4 w-4"/></Button>
              </div>
            ))}
          </div>
        </Card>

        <Button type="submit" size="lg" className="w-full py-6 text-lg" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : "Update Pricing"}
        </Button>
      </form>
    </main>
  );
}