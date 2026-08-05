import { Link } from "react-router";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { useAllProducts } from "@/hooks/useCatalog";
import { Button } from "@/components/ui/button";
import { api } from '@/api/api';

export default function AdminProductsListPage() {
  const { data: products, isLoading, refetch } = useAllProducts();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.admin.deleteProduct(id);
      alert("Product deleted!");
      refetch(); // Refresh the list
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  if (isLoading) return <div className="flex justify-center pt-32"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif">Manage Products</h1>
          <p className="text-muted-foreground">View, update, and delete your catalog.</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <img 
                      src={product.images?.[0] || "https://placehold.co/100x100"} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.id}</p>
                  </td>
                  <td className="p-4">₹{product.basePrice}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">Active</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        {/* Route this to your AddProduct page, but modified to fetch/prefill data for updating */}
                        <Link to={`/admin/products/edit/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No products found. Start by adding one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}