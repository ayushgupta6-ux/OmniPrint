import { useState } from "react";
import {
  Upload,
  Sparkles,
  Headphones,
  Phone,
  Check,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

interface ProductConfiguratorProps {
  product: Product;
  images: string[];
}

const CONTACT_NUMBER = "+91 9999xxx";

export function ProductConfigurator({
  product,
  images,
}: ProductConfiguratorProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [designPath, setDesignPath] = useState<
    "upload" | "ai" | "consult" | null
  >(null);
  const [needsInstallation, setNeedsInstallation] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSelection = (filterLabel: string, option: string) => {
    setSelections((prev) => ({
      ...prev,
      [filterLabel]: option,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setDesignPath("upload");
    }
  };

  const isConfigComplete =
    Object.keys(selections).length === product.filters.length && designPath;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Image gallery */}
      <div className="space-y-4">
        {/* Main image */}
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-secondary">
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails */}
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
        {/* Product info */}
        <div>
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            {product.category}
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
          {product.filters.map((filter) => (
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
                    onClick={() => handleSelection(filter.label, option)}
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

          {designPath === "ai" && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm text-muted-foreground">
                Login to access our AI-powered design tool. Create stunning
                designs with just a text prompt!
              </p>
              <Button size="sm" className="mt-3">
                Login to Continue
              </Button>
            </div>
          )}

          {designPath === "consult" && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Our design experts will help you create the perfect design.
                Contact us to discuss your requirements.
              </p>
              <a
                href={`tel:${CONTACT_NUMBER.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-accent font-medium text-sm hover:underline"
              >
                <Phone className="h-4 w-4" />
                {CONTACT_NUMBER}
              </a>
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

        {/* Summary & CTA */}
        <div className="pt-6 border-t border-border space-y-4">
          {/* Configuration summary */}
          {Object.keys(selections).length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Your Configuration</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selections).map(([key, value]) => (
                  <span
                    key={key}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground"
                  >
                    {key}: {value}
                  </span>
                ))}
                {needsInstallation && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent">
                    + Installation
                  </span>
                )}
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={!isConfigComplete}
          >
            {isConfigComplete ? "Get Quote" : "Complete Configuration"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We will contact you within 24 hours with a detailed quote
          </p>
        </div>
      </div>
    </div>
  );
}