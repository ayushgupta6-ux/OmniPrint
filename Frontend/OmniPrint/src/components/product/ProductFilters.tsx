import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/useConfigStore";

interface ProductFiltersProps {
  filters?: { label: string; options: string[] }[];
}

export function ProductFilters({ filters }: ProductFiltersProps) {
  const { selections, setSelection } = useConfigStore();

  if (!filters || filters.length === 0) return null;

  return (
    <div className="space-y-6">
      {filters.map((filter) => (
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
  );
}