import { useState } from "react";
import { Sparkles, Loader2, Image as ImageIcon, Check, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useConfigStore } from "@/store/useConfigStore";
import { api } from "@/api/api"; // Your Axios API client

interface AiDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string; // Passed from parent so we know what they are configuring
}

export function AiDesignModal({ isOpen, onClose, productName }: AiDesignModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedImageBase64, setGeneratedImageBase64] = useState<string | null>(null);
  
  const { selections, setDesignPath, setDesignUrl } = useConfigStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    try {
      // Build a string of their current configurations to send to the backend
      const configString = `${productName} with filters: ${JSON.stringify(selections)}`;
      
      // Call your Spring Boot proxy endpoint
      const response = await fetch("http://localhost:8080/api/design/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt_token")}` // Ensure secure call
        },
        body: JSON.stringify({ 
          prompt: prompt, 
          productConfig: configString 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedImageBase64(data.imageUrl); // This is the data:image/png;base64 string
      } else {
        throw new Error("Generation failed");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = async () => {
    if (!generatedImageBase64) return;
    setIsUploading(true);

    try {
      // 1. Convert the Base64 string back into a File object so Cloudinary accepts it
      const response = await fetch(generatedImageBase64);
      const blob = await response.blob();
      const file = new File([blob], "ai-generated-design.png", { type: "image/png" });

      // 2. Upload to Cloudinary using your existing API setup
      const secureCloudinaryUrl = await api.cloudinary.uploadImage(file);
      
      // 3. Save to global state and close
      setDesignUrl(secureCloudinaryUrl);
      setDesignPath("ai");
      onClose();
    } catch (error) {
      console.error("Cloudinary upload failed", error);
      alert("Failed to save your design permanently. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background">
        
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-6 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" /> 
              AI Design Studio
            </DialogTitle>
            <DialogDescription className="text-base">
              Describe your vision for the {productName}. Our AI will enhance your prompt and generate a production-ready design.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Textarea
              placeholder="E.g., A minimalist logo with a steaming cup and modern typography..."
              className="min-h-[100px] resize-none border-primary/20 focus-visible:ring-accent"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating || isUploading}
            />
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isGenerating || isUploading} 
              className="w-full gap-2 bg-accent hover:bg-accent/90 text-white"
            >
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Enhancing & Generating...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generate Design</>
              )}
            </Button>
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-secondary/30 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                <Sparkles className="h-10 w-10 text-accent opacity-50 animate-bounce" />
                <p className="text-sm font-medium text-center px-4">
                  Refining your prompt...<br/>Rendering high-quality image...
                </p>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-medium">Saving to secure cloud storage...</p>
              </div>
            ) : generatedImageBase64 ? (
              <div className="w-full h-full relative group">
                <img 
                  src={generatedImageBase64} 
                  alt="Generated Design" 
                  className="w-full h-[300px] object-contain bg-black/5"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Button variant="secondary" onClick={handleGenerate} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Re-roll
                  </Button>
                  <Button onClick={handleConfirm} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <Check className="h-4 w-4" /> Use this Design
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                <ImageIcon className="h-12 w-12" />
                <p className="text-sm font-medium">Your design will appear here</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}