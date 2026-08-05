import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, Clock, Store, CheckCircle2, Truck, Wrench, Layers, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/api/api";

// Define the order interface based on your backend entity
interface Order {
  id: number;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: 'PLACED' | 'MANUFACTURING' | 'READY_FOR_DELIVERY' | 'DELIVERED';
  createdAt: string;
  deliveryAddress: string;
  needsInstallation: boolean;
  designPath: string;
  selectedFilters: Record<string, string>;
}

const STATUS_STEPS = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock },
  { key: 'MANUFACTURING', label: 'Printing', icon: Store },
  { key: 'READY_FOR_DELIVERY', label: 'Ready', icon: Package },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
];

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        // Fetch orders from the Order Service via api.ts
        const data = await api.orders.getClientOrders();

        // Sort by newest first
        const sortedData = data.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper to determine active steps in the progress bar
const getStepStatus = (currentStatus: string, stepKey: string) => {
    // FIX: If the order is completely finished, every step (including the last one) is 'completed'
    if (currentStatus === 'DELIVERED') return 'completed';

    const currentIndex = STATUS_STEPS.findIndex(s => s.key === currentStatus);
    const stepIndex = STATUS_STEPS.findIndex(s => s.key === stepKey);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (isLoading) {
    return (
      <main className="pt-32 pb-16 px-4 min-h-screen flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-serif">My Orders</h1>
        <p className="text-muted-foreground mt-2">Track the status of your print jobs and view your order history.</p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 flex flex-col items-center">
          <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">When you place an order, it will appear here for tracking.</p>
          <Button asChild>
            <Link to="/">Start Exploring Products</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-border shadow-sm">
              
              {/* Card Header */}
              <div className="bg-secondary/40 p-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">Order #{order.id}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg text-primary">{order.productId}</h3>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-muted-foreground mb-0.5">Total Amount</p>
                  <p className="font-bold text-xl">₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Configuration Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Order Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{order.quantity} Units</span>
                    </div>
                    {Object.entries(order.selectedFilters || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{value as string}</span>
                      </div>
                    ))}
                    {order.needsInstallation && (
                      <div className="flex justify-between items-center text-amber-600 bg-amber-50 p-2 rounded-md mt-2">
                        <span className="flex items-center gap-1.5"><Wrench className="h-4 w-4"/> Installation Requested</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery & Status Tracker */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <Truck className="h-4 w-4" /> Delivery Address
                    </h4>
                    <p className="text-sm p-3 bg-secondary/30 rounded-md border border-border">
                      {order.deliveryAddress}
                    </p>
                  </div>

               {/* Status Stepper */}
                  <div className="pt-4">
                    <div className="flex justify-between relative">
                      {/* Background Inactive Line */}
                      <div className="absolute top-4 left-4 right-4 h-[3px] bg-secondary -z-10 rounded-full" />
                      
                      {/* Active Progress Line */}
                      <div 
                        className="absolute top-4 left-4 h-[3px] bg-primary -z-10 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${(Math.max(0, STATUS_STEPS.findIndex(s => s.key === order.status)) / (STATUS_STEPS.length - 1)) * 100}%` 
                        }} 
                      />
                      
                      {STATUS_STEPS.map((step) => {
                        const status = getStepStatus(order.status, step.key);
                        const Icon = step.icon;
                        
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              status === 'completed' 
                                ? 'bg-green-600 border-green-600 text-white shadow-md' // Green check for done
                              : status === 'current' 
                                ? 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 scale-110' // Highlight current
                              : 'bg-background border-muted-foreground/30 text-muted-foreground/50' // Faded for upcoming
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className={`text-[10px] md:text-xs font-semibold text-center max-w-[70px] ${
                              status === 'completed' ? 'text-green-700' 
                              : status === 'current' ? 'text-primary' 
                              : 'text-muted-foreground/60'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </Card>
          ))}
        </div>
      )}
    </main>
  );
}