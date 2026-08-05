import { Upload, Sparkles, Headphones, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/useConfigStore";

export function DesignPathSelector() {
  const { designPath, uploadedFile, setDesignPath, setUploadedFile } = useConfigStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setDesignPath("upload");
    }
  };

  return (
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
          <input
            type="file"
            accept=".cdr,.pdf,.png,.jpg,.jpeg,.ai"
            onChange={handleFileUpload}
            className="sr-only"
          />
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", designPath === "upload" ? "bg-accent" : "bg-secondary")}>
            <Upload className={cn("h-6 w-6 transition-colors", designPath === "upload" ? "text-accent-foreground" : "text-muted-foreground")} />
          </div>
          <div className="text-center">
            <div className="font-medium text-sm">I have a design</div>
            <div className="text-xs text-muted-foreground mt-1">Upload CDR, PDF, PNG</div>
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
          className={cn("relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all", designPath === "ai" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}
        >
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", designPath === "ai" ? "bg-accent" : "bg-secondary")}>
            <Sparkles className={cn("h-6 w-6 transition-colors", designPath === "ai" ? "text-accent-foreground" : "text-muted-foreground")} />
          </div>
          <div className="text-center">
            <div className="font-medium text-sm">Use AI Designer</div>
            <div className="text-xs text-muted-foreground mt-1">Free with login</div>
          </div>
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">Free</span>
        </button>

        {/* Design consultation */}
        <button
          onClick={() => setDesignPath("consult")}
          className={cn("relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all", designPath === "consult" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}
        >
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", designPath === "consult" ? "bg-accent" : "bg-secondary")}>
            <Headphones className={cn("h-6 w-6 transition-colors", designPath === "consult" ? "text-accent-foreground" : "text-muted-foreground")} />
          </div>
          <div className="text-center">
            <div className="font-medium text-sm">Help me design</div>
            <div className="text-xs text-muted-foreground mt-1">Design service fee</div>
          </div>
        </button>
      </div>

      {designPath === "upload" && uploadedFile && (
        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Check className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="font-medium text-sm">{uploadedFile.name}</div>
              <div className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}