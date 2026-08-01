
import { Hero } from "@/components/hero";
import { CategoryGrid } from "@/components/category-grid";

import { CTASection } from "@/components/cta-section";

import { ProcessTracker } from "@/components/ui/process-tracker"; 


export default function HomePage() {
  return (
    <>
      
      <main>
        <Hero />
        <CategoryGrid />
        <ProcessTracker/>
        <CTASection />
      </main>
      
    </>
  );
}
