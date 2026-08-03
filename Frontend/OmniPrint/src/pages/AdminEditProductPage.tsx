import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Plus, Trash2, UploadCloud, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
 
// Update this to match your Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = "du91zlnae";
const CLOUDINARY_UPLOAD_PRESET = "product_uploads"; 

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [basicInfo, setBasicInfo] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    basePrice: 0,
  });

  // Image States (Separate existing URLs from new File uploads)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const [categories, setCategories] = useState([
    { id: "", name: "", slug: "", description: "", imageUrl: "" }
  ]);
  const [filters, setFilters] = useState([{ label: "", optionsString: "" }]);
  const [discountTiers, setDiscountTiers] = useState([
    { minQuantity: 1, maxQuantity: "" as number | string, discountPercentage: 0 }
  ]);

  // --- Fetch Existing Product Data ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use your public endpoint (or admin endpoint) to fetch the product
        // Note: If you only have getBySlug, and id == slug, this will work. 
        // Adjust the URL if your GET endpoint path is different.
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        
        const data = await response.json();
        
        setBasicInfo({
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          basePrice: data.basePrice,
        });

        if (data.images) setExistingImages(data.images);
        if (data.categories?.length) setCategories(data.categories);
        
        if (data.filters?.length) {
          setFilters(data.filters.map((f: any) => ({
            label: f.label,
            optionsString: f.options.join(", ")
          })));
        }

        if (data.discountTiers?.length) {
          setDiscountTiers(data.discountTiers.map((t: any) => ({
            minQuantity: t.minQuantity,
            maxQuantity: t.maxQuantity === null ? "" : t.maxQuantity,
            discountPercentage: t.discountPercentage
          })));
        }
      } catch (error) {
        console.error(error);
        alert("Error loading product data.");
        navigate("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, navigate]);

  // --- Array Handlers ---
  const addCategory = () => setCategories([...categories, { id: "", name: "", slug: "", description: "", imageUrl: "" }]);
  const removeCategory = (index: number) => setCategories(categories.filter((_, i) => i !== index));

  const addFilter = () => setFilters([...filters, { label: "", optionsString: "" }]);
  const removeFilter = (index: number) => setFilters(filters.filter((_, i) => i !== index));

  const addTier = () => setDiscountTiers([...discountTiers, { minQuantity: 1, maxQuantity: "", discountPercentage: 0 }]);
  const removeTier = (index: number) => setDiscountTiers(discountTiers.filter((_, i) => i !== index));

  const removeExistingImage = (index: number) => setExistingImages(existingImages.filter((_, i) => i !== index));

  // --- Image Upload to Cloudinary ---
  const uploadNewImagesToCloudinary = async (): Promise<string[]> => {
    if (newImageFiles.length === 0) return [];
    
    const urls: string[] = [];
    for (const file of newImageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to upload an image to Cloudinary");
      const data = await res.json();
      urls.push(data.secure_url);
    }
    return urls;
  };

  // --- Form Submission (PUT Request) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload any NEW images
      const newlyUploadedUrls = await uploadNewImagesToCloudinary();
      
      // 2. Combine existing (undeleted) images with the newly uploaded ones
      const finalImageUrls = [...existingImages, ...newlyUploadedUrls];

      // 3. Format Payload
      const payload = {
        id: basicInfo.id,
        name: basicInfo.name,
        slug: basicInfo.slug,
        description: basicInfo.description,
        basePrice: basicInfo.basePrice,
        images: finalImageUrls,
        categories: categories,
        filters: filters.map(f => ({
          label: f.label,
          options: f.optionsString.split(",").map(opt => opt.trim()).filter(Boolean)
        })),
        discountTiers: discountTiers.map(t => ({
          minQuantity: Number(t.minQuantity),
          maxQuantity: t.maxQuantity === "" ? null : Number(t.maxQuantity),
          discountPercentage: Number(t.discountPercentage)
        }))
      };

      // 4. Send PUT request to API Gateway
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update product");

      alert("Product successfully updated!");
      navigate("/admin/products"); // Go back to list

    } catch (error) {
      console.error(error);
      alert("Error updating product. Please check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif">Edit Product</h1>
          <p className="text-muted-foreground">Updating: {basicInfo.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* --- 1. Basic Info --- */}
        <section className="space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm">
          <h2 className="text-xl font-medium border-b border-border pb-2">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product ID (Cannot be changed)</Label>
              <input disabled type="text" className="w-full p-2 border rounded-md bg-secondary cursor-not-allowed" value={basicInfo.id} />
            </div>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <input required type="text" className="w-full p-2 border rounded-md" value={basicInfo.name} onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Base Price ($)</Label>
              <input required type="number" step="0.01" className="w-full p-2 border rounded-md" value={basicInfo.basePrice} onChange={(e) => setBasicInfo({...basicInfo, basePrice: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <textarea required className="w-full p-2 border rounded-md h-24" value={basicInfo.description} onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})} />
            </div>
          </div>
        </section>

        {/* --- 2. Images --- */}
        <section className="space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm">
          <h2 className="text-xl font-medium border-b border-border pb-2">Product Images</h2>
          
          {/* Show Existing Images */}
          {existingImages.length > 0 && (
            <div className="flex gap-4 flex-wrap mb-4">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                  <img src={img} alt="product" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload New Images */}
          <div className="flex flex-col gap-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 hover:bg-secondary/50 cursor-pointer transition">
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium">Click to add more images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && setNewImageFiles(Array.from(e.target.files))} />
            </label>
            {newImageFiles.length > 0 && (
              <div className="text-sm text-muted-foreground">{newImageFiles.length} new file(s) ready to upload</div>
            )}
          </div>
        </section>

        {/* --- 3. Categories --- */}
        <section className="space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-xl font-medium">Categories</h2>
            <Button type="button" variant="outline" size="sm" onClick={addCategory}><Plus className="h-4 w-4 mr-2"/> Add Category</Button>
          </div>
          {categories.map((cat, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-lg relative">
              {index > 0 && (
                <button type="button" onClick={() => removeCategory(index)} className="absolute top-2 right-2 text-red-500"><Trash2 className="h-4 w-4"/></button>
              )}
              <div className="space-y-2">
                <Label>Category ID / Slug</Label>
                <input required type="text" className="w-full p-2 border rounded-md" value={cat.id} onChange={(e) => {
                  const newCats = [...categories]; newCats[index].id = e.target.value; newCats[index].slug = e.target.value; setCategories(newCats);
                }}/>
              </div>
              <div className="space-y-2">
                <Label>Category Name</Label>
                <input required type="text" className="w-full p-2 border rounded-md" value={cat.name} onChange={(e) => {
                  const newCats = [...categories]; newCats[index].name = e.target.value; setCategories(newCats);
                }}/>
              </div>
            </div>
          ))}
        </section>

        {/* --- 4. Filters --- */}
        <section className="space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-xl font-medium">Filters & Variations</h2>
            <Button type="button" variant="outline" size="sm" onClick={addFilter}><Plus className="h-4 w-4 mr-2"/> Add Filter</Button>
          </div>
          {filters.map((filter, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label>Filter Label</Label>
                <input required type="text" className="w-full p-2 border rounded-md" value={filter.label} onChange={(e) => {
                  const newF = [...filters]; newF[index].label = e.target.value; setFilters(newF);
                }}/>
              </div>
              <div className="space-y-2 flex-2 w-1/2">
                <Label>Options (Comma separated)</Label>
                <input required type="text" className="w-full p-2 border rounded-md" value={filter.optionsString} onChange={(e) => {
                  const newF = [...filters]; newF[index].optionsString = e.target.value; setFilters(newF);
                }}/>
              </div>
              <Button type="button" variant="ghost" className="text-red-500 mb-1" onClick={() => removeFilter(index)}><Trash2 className="h-4 w-4"/></Button>
            </div>
          ))}
        </section>

        {/* --- 5. Discount Tiers --- */}
        <section className="space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-xl font-medium">Volume Discount Tiers</h2>
            <Button type="button" variant="outline" size="sm" onClick={addTier}><Plus className="h-4 w-4 mr-2"/> Add Tier</Button>
          </div>
          {discountTiers.map((tier, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="space-y-2 w-1/3">
                <Label>Min Quantity</Label>
                <input required type="number" min="1" className="w-full p-2 border rounded-md" value={tier.minQuantity} onChange={(e) => {
                  const newT = [...discountTiers]; newT[index].minQuantity = Number(e.target.value); setDiscountTiers(newT);
                }}/>
              </div>
              <div className="space-y-2 w-1/3">
                <Label>Max Quantity (Empty = Infinity)</Label>
                <input type="number" className="w-full p-2 border rounded-md" value={tier.maxQuantity} onChange={(e) => {
                  const newT = [...discountTiers]; newT[index].maxQuantity = e.target.value; setDiscountTiers(newT);
                }}/>
              </div>
              <div className="space-y-2 w-1/3">
                <Label>Discount %</Label>
                <input required type="number" step="0.1" className="w-full p-2 border rounded-md" value={tier.discountPercentage} onChange={(e) => {
                  const newT = [...discountTiers]; newT[index].discountPercentage = Number(e.target.value); setDiscountTiers(newT);
                }}/>
              </div>
              <Button type="button" variant="ghost" className="text-red-500 mb-1" onClick={() => removeTier(index)}><Trash2 className="h-4 w-4"/></Button>
            </div>
          ))}
        </section>

        {/* --- Submit Button --- */}
        <Button type="submit" size="lg" className="w-full py-6 text-lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Updating Product...</> : "Save Changes"}
        </Button>

      </form>
    </main>
  );
}