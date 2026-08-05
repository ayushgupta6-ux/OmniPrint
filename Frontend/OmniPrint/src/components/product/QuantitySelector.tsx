import { Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const QUICK_QUANTITIES = [10, 50, 100, 500, 1000];

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (q: number) => void;
}

export function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  return (
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
  );
}