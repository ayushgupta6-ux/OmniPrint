import { useState, useEffect } from "react";
import {
  Upload,
  Sparkles,
  Headphones,
  Phone,
  Check,
  ChevronDown,
  MapPin,
  Loader2,
  Minus, // <-- NEW IMPORT
  Plus,  // <-- NEW IMPORT
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/useConfigStore";
import type { Product } from "@/hooks/useCatalog"; 

interface ProductConfiguratorProps {
  product: Product;
  images: string[];
}

const CONTACT_NUMBER = "+91 9999xxx";
const QUICK_QUANTITIES = [10, 50, 100, 500, 1000]; // Quick select options for bulk

export function ProductConfigurator({
  product,
  images,
}: ProductConfiguratorProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const {
    selections,
    designPath,
    needsInstallation,
    uploadedFile,
    setSelection,
    setDesignPath,
    setNeedsInstallation,
    setUploadedFile,
    resetConfig,
  } = useConfigStore();

  const [quantity, setQuantity] = useState(1); 
  const [isQuoting, setIsQuoting] = useState(false); 
  const [quoteResult, setQuoteResult] = useState<any>(null); 

  useEffect(() => {
    resetConfig();
    setQuoteResult(null); 
    setQuantity(1);
  }, [product.id, resetConfig]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setDesignPath("upload");
    }
  };

  const isConfigComplete =
    product.filters &&
    Object.keys(selections).length === product.filters.length &&
    designPath;

  const handleGetQuote = async () => {
    if (!isConfigComplete) return;
    
    setIsQuoting(true);
    try {
      const response = await fetch("http://localhost:8080/api/products/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          selectedFilters: selections 
        })
      });

      if (!response.ok) throw new Error("Failed to fetch quote");
      const data = await response.json();
      setQuoteResult(data);
    } catch (error) {
      console.error(error);
      alert("Error generating quote. Please try again.");
    } finally {
      setIsQuoting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Image gallery */}
      <div className="space-y-4">
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-secondary">
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                  selectedImage === index
                    ? "border-accent ring-2 ring-accent/20"
                    : "border-border hover:border-accent/50"
                )}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Configurator */}
      <div className="space-y-8">
        <div>
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            {product.categories?.[0]?.name || "Product"}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl mt-2 mb-4">
            {product.name}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          {product.filters?.map((filter) => (
            <div key={filter.label} className="space-y-3">
              <Label className="text-sm font-medium flex items-center justify-between">
                <span>{filter.label}</span>
                {selections[filter.label] && (
                  <span className="text-accent flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {selections[filter.label]}
                  </span>
                )}
              </Label>
              <div className="flex flex-wrap gap-2">
                {filter.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelection(filter.label, option)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                      selections[filter.label] === option
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-card border-border hover:border-accent/50 text-foreground"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Design path selector */}
        <div className="space-y-4 pt-4 border-t border-border">
          <Label className="text-sm font-medium">Choose Design Path</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Upload design */}
            <label
              className={cn(
                "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all",
                designPath === "upload"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              )}
            >
              <input
                type="file"
                accept=".cdr,.pdf,.png,.jpg,.jpeg,.ai"
                onChange={handleFileUpload}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  designPath === "upload" ? "bg-accent" : "bg-secondary"
                )}
              >
                <Upload
                  className={cn(
                    "h-6 w-6 transition-colors",
                    designPath === "upload"
                      ? "text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">I have a design</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Upload CDR, PDF, PNG
                </div>
              </div>
              {uploadedFile && designPath === "upload" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <Check className="h-4 w-4 text-accent-foreground" />
                </div>
              )}
            </label>

            {/* AI Designer */}
            <button
              onClick={() => setDesignPath("ai")}
              className={cn(
                "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all",
                designPath === "ai"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  designPath === "ai" ? "bg-accent" : "bg-secondary"
                )}
              >
                <Sparkles
                  className={cn(
                    "h-6 w-6 transition-colors",
                    designPath === "ai"
                      ? "text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">Use AI Designer</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Free with login
                </div>
              </div>
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                Free
              </span>
            </button>

            {/* Design consultation */}
            <button
              onClick={() => setDesignPath("consult")}
              className={cn(
                "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all",
                designPath === "consult"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  designPath === "consult" ? "bg-accent" : "bg-secondary"
                )}
              >
                <Headphones
                  className={cn(
                    "h-6 w-6 transition-colors",
                    designPath === "consult"
                      ? "text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">Help me design</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Design service fee
                </div>
              </div>
            </button>
          </div>

          {/* Design path details */}
          {designPath === "upload" && uploadedFile && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-sm">{uploadedFile.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Installation toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">Professional Installation</div>
              <div className="text-xs text-muted-foreground">
                Available in Noida / NCR region
              </div>
            </div>
          </div>
          <Switch
            checked={needsInstallation}
            onCheckedChange={setNeedsInstallation}
          />
        </div>

        {/* --- NEW: Advanced Quantity & Summary Section --- */}
        <div className="pt-6 border-t border-border space-y-5">
          
          {/* Enhanced Quantity Selector */}
          <div className="space-y-3">
             <Label className="text-sm font-medium">Select Quantity</Label>
             
             <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
               
               {/* Minus / Plus Stepper */}
               <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden w-fit h-11 shadow-sm">
                 <button 
                   type="button"
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   className="px-3 h-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center"
                 >
                   <Minus className="h-4 w-4" />
                 </button>
                 <input 
                   type="number" 
                   min="1" 
                   value={quantity} 
                   onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                   className="w-16 h-full text-center bg-transparent focus:outline-none font-medium border-x border-border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                 />
                 <button 
                   type="button"
                   onClick={() => setQuantity(quantity + 1)}
                   className="px-3 h-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center"
                 >
                   <Plus className="h-4 w-4" />
                 </button>
               </div>

               {/* Bulk Quick Select Buttons */}
               <div className="flex flex-wrap gap-2">
                 {QUICK_QUANTITIES.map((q) => (
                   <button
                     key={q}
                     onClick={() => setQuantity(q)}
                     className={cn(
                       "px-4 py-2 rounded-lg text-sm font-medium transition-all border shadow-sm",
                       quantity === q 
                         ? "bg-accent text-accent-foreground border-accent" 
                         : "bg-secondary text-muted-foreground border-transparent hover:border-border hover:bg-secondary/80"
                     )}
                   >
                     {q}
                   </button>
                 ))}
               </div>
             </div>
          </div>

          {/* Configuration summary */}
          {Object.keys(selections).length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Your Configuration</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selections).map(([key, value]) => (
                  <span
                    key={key}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground border border-border"
                  >
                    {key}: {value}
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

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full text-base font-semibold shadow-md"
            disabled={!isConfigComplete || isQuoting}
            onClick={handleGetQuote} 
          >
            {isQuoting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            {isConfigComplete ? "Calculate Quote" : "Complete Configuration"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Get instant volume discounts on bulk orders!
          </p>

          {/* Display the Quote Result dynamically */}
          {quoteResult && (
            <div className="mt-6 p-5 bg-card border-2 border-primary/30 rounded-xl shadow-lg space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-serif font-bold text-xl text-foreground">Your Quotation</h3>
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md font-bold tracking-wide uppercase">
                  Estimated
                </span>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground pt-2">
                <span>Unit Price:</span> 
                <span>${quoteResult.finalUnitPrice}</span>
              </div>
              
              {quoteResult.discountPercent > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-bold bg-green-500/10 px-3 py-2 rounded-md">
                  <span>Volume Discount Applied:</span> 
                  <span>{quoteResult.discountPercent}% OFF</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-foreground text-2xl pt-4 border-t border-border mt-3">
                <span>Total ({quantity} items):</span> 
                <span className="text-primary">${quoteResult.totalPrice}</span>
              </div>
              
              <Button className="w-full mt-4" size="lg">Add to Cart</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}