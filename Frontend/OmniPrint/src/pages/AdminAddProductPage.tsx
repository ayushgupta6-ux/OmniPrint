import { useState } from "react";
import { Plus, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from '@/api/api';


export default function AdminAddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    basePrice: 0,
  });

  // 2. Images State (File objects for preview and upload)
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // 3. Category State (Supporting at least one category)
  const [categories, setCategories] = useState([
    { id: "", name: "", slug: "", description: "", imageUrl: "" }
  ]);

  // 4. Filters State (Options kept as comma-separated string for easy input)
  const [filters, setFilters] = useState([{ label: "", optionsString: "" }]);

 

  // --- Handlers for Dynamic Arrays ---
  const addCategory = () => setCategories([...categories, { id: "", name: "", slug: "", description: "", imageUrl: "" }]);
  const removeCategory = (index: number) => setCategories(categories.filter((_, i) => i !== index));

  const addFilter = () => setFilters([...filters, { label: "", optionsString: "" }]);
  const removeFilter = (index: number) => setFilters(filters.filter((_, i) => i !== index));

 
  // --- Image Upload to Cloudinary ---
  const uploadImagesToCloudinary = async (): Promise<string[]> => {
    return api.cloudinary.uploadImages(imageFiles);
  };

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload Images First
      const uploadedImageUrls = await uploadImagesToCloudinary();

      // 2. Format Payload for Spring Boot
      const payload = {
        id: basicInfo.id,
        name: basicInfo.name,
        slug: basicInfo.slug,
        description: basicInfo.description,
        basePrice: basicInfo.basePrice,
        images: uploadedImageUrls,
        categories: categories,
        
        // Convert comma-separated string into string array
        filters: filters.map(f => ({
          label: f.label,
          options: f.optionsString.split(",").map(opt => opt.trim()).filter(Boolean)
        })),
        
        
      };

      // 3. Send to API Gateway (Admin Route)
      await api.admin.createProduct(payload);

      alert("Product successfully created!");
      window.location.reload(); // Reset form

    } catch (error) {
      console.error(error);
      alert("Error creating product. Please check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif">Add New Product</h1>
        <p className="text-muted-foreground">Admin & Vendor Control Panel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* --- 1. Basic Info --- */}
        <section className="space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm">
          <h2 className="text-xl font-medium border-b border-border pb-2">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product ID</Label>
              <input required type="text" className="w-full p-2 border rounded-md" value={basicInfo.id} onChange={(e) => setBasicInfo({...basicInfo, id: e.target.value, slug: e.target.value})} placeholder="e.g., standard-flex-banner" />
            </div>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <input required type="text" className="w-full p-2 border rounded-md" value={basicInfo.name} onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})} placeholder="e.g., Standard Flex Banner" />
            </div>
            <div className="space-y-2">
              <Label>Base Price </Label>
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
          <div className="flex flex-col gap-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 hover:bg-secondary/50 cursor-pointer transition">
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium">Click to upload images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && setImageFiles(Array.from(e.target.files))} />
            </label>
            {imageFiles.length > 0 && (
              <div className="text-sm text-muted-foreground">{imageFiles.length} file(s) selected</div>
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
                  const newCats = [...categories];
                  newCats[index].id = e.target.value;
                  newCats[index].slug = e.target.value;
                  setCategories(newCats);
                }} placeholder="e.g., outdoor-signage"/>
              </div>
              <div className="space-y-2">
                <Label>Category Name</Label>
                <input required type="text" className="w-full p-2 border rounded-md" value={cat.name} onChange={(e) => {
                  const newCats = [...categories];
                  newCats[index].name = e.target.value;
                  setCategories(newCats);
                }} placeholder="e.g., Outdoor Signage"/>
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
                }} placeholder="e.g., Size"/>
              </div>
              <div className="space-y-2 flex-2 w-1/2">
                <Label>Options (Comma separated)</Label>
                <input required type="text" className="w-full p-2 border rounded-md" value={filter.optionsString} onChange={(e) => {
                  const newF = [...filters]; newF[index].optionsString = e.target.value; setFilters(newF);
                }} placeholder="e.g., Small, Medium, Large"/>
              </div>
              <Button type="button" variant="ghost" className="text-red-500 mb-1" onClick={() => removeFilter(index)}><Trash2 className="h-4 w-4"/></Button>
            </div>
          ))}
        </section>

    

        {/* --- Submit Button --- */}
        <Button type="submit" size="lg" className="w-full py-6 text-lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Uploading & Saving...</> : "Publish Product"}
        </Button>

      </form>
    </main>
  );
}