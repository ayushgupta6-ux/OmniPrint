import { useParams, Link } from "react-router"; // Updated to react-router-dom
import { ArrowLeft, Loader2 } from "lucide-react";
import { useProductBySlug } from "@/hooks/useCatalog";
import { ProductConfigurator } from "@/components/product-configurator";
import NotFound from "./NotFound"; 

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductBySlug(slug ?? "");

  if (isLoading) return <div className="flex justify-center pt-32"><Loader2 className="animate-spin h-8 w-8" /></div>;
  if (isError || !product) return <NotFound />;

  // Cloudinary allows arrays, but since our DB has a single imageUrl, we wrap it in an array for the configurator
  const images = product.images.length > 0 ? product.images : ["/placeholder-image.png"]; // Fallback to a placeholder if no images

  return (
    <main className="pt-20">
      {/* Navigation formatting remains exactly the same */}
      <section className="py-8 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ProductConfigurator product={product} images={images} />
        </div>
      </section>
    </main>
  );
}