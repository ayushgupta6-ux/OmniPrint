import { useState } from "react";
import { Upload, Sparkles, Headphones, Check, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/useConfigStore";
import { AiDesignModal } from "./AiDesignModal";
import { api } from "@/api/api"; // <-- Import API

interface DesignPathSelectorProps {
  productName: string;
}

export function DesignPathSelector({ productName }: DesignPathSelectorProps) {
  const { designPath, uploadedFile, setDesignPath, setUploadedFile, setDesignUrl } = useConfigStore();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // <-- Track upload state

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setDesignPath("upload");
      setIsUploading(true);
      
      try {
        // Upload to Cloudinary using your existing API setup
        const secureUrl = await api.cloudinary.uploadImage(file);
        setDesignUrl(secureUrl);
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload image. Please try again.");
        setUploadedFile(null);
        setDesignPath(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <div className="space-y-4 pt-4 border-t border-border">
        <Label className="text-sm font-medium">Choose Design Path</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Upload design */}
          <label
            className={cn(
              "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all",
              designPath === "upload" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            )}
          >
            <input type="file" accept=".cdr,.pdf,.png,.jpg,.jpeg,.ai" onChange={handleFileUpload} disabled={isUploading} className="sr-only" />
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", designPath === "upload" ? "bg-accent" : "bg-secondary")}>
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-accent-foreground" />
              ) : (
                <Upload className={cn("h-6 w-6", designPath === "upload" ? "text-accent-foreground" : "text-muted-foreground")} />
              )}
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">I have a design</div>
              <div className="text-xs text-muted-foreground mt-1">Upload CDR, PDF, PNG</div>
            </div>
            {designPath === "upload" && !isUploading && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <Check className="h-4 w-4 text-accent-foreground" />
              </div>
            )}
          </label>

          {/* AI Designer */}
          <button onClick={() => setIsAiModalOpen(true)} className={cn("relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all", designPath === "ai" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", designPath === "ai" ? "bg-accent" : "bg-secondary")}>
              <Sparkles className={cn("h-6 w-6", designPath === "ai" ? "text-accent-foreground" : "text-muted-foreground")} />
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">Use AI Designer</div>
              <div className="text-xs text-muted-foreground mt-1">Free with login</div>
            </div>
            {designPath === "ai" && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-md">
                <Check className="h-4 w-4 text-accent-foreground" />
              </div>
            )}
          </button>

          {/* Consult */}
          <button onClick={() => { setDesignPath("consult"); setDesignUrl("consultation-requested"); }} className={cn("relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all", designPath === "consult" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}>
             <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", designPath === "consult" ? "bg-accent" : "bg-secondary")}>
              <Headphones className={cn("h-6 w-6", designPath === "consult" ? "text-accent-foreground" : "text-muted-foreground")} />
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">Help me design</div>
              <div className="text-xs text-muted-foreground mt-1">Design service fee</div>
            </div>
            {designPath === "consult" && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-md">
                <Check className="h-4 w-4 text-accent-foreground" />
              </div>
            )}
          </button>
        </div>
      </div>
      <AiDesignModal productName={productName} isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </>
  );
}