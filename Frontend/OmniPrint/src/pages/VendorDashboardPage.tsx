import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    Package,
    ListOrdered,
    Store,
    Plus,
    Loader2,
    CheckCircle2,
    Clock,
    Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from '@/api/api';

export default function VendorDashboardPage() {
    const [activeTab, setActiveTab] = useState<"orders" | "catalog">("orders");
    const [vendorId, setVendorId] = useState<number | null>(null);

    const [orders, setOrders] = useState<any[]>([]);
    const [catalog, setCatalog] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Decode JWT to get Vendor ID on mount
    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setVendorId(payload.userId); // Ensure this matches your token's ID field
            } catch (e) {
                console.error("Invalid token");
            }
        }
    }, []);

    // 2. Fetch Data based on active tab
    useEffect(() => {
        if (!vendorId) return;

        const fetchData = async () => {
            setIsLoading(true);

            try {
                if (activeTab === "orders") {
                    setOrders(await api.vendor.getVendorOrders());
                } else {
                    setCatalog(await api.vendor.getVendorProducts(vendorId));
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab, vendorId]);

    // 3. Update Order Status
    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            await api.vendor.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert("Failed to update order status.");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PLACED': return <Clock className="h-4 w-4 text-amber-500" />;
            case 'MANUFACTURING': return <Store className="h-4 w-4 text-blue-500" />;
            case 'READY_FOR_DELIVERY': return <Package className="h-4 w-4 text-purple-500" />;
            case 'DELIVERED': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto min-h-[calc(100vh-80px)]">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif">Agency Dashboard</h1>
                    <p className="text-muted-foreground">Manage your production queue and pricing catalog.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex p-1 bg-secondary rounded-lg">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                            activeTab === "orders" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <ListOrdered className="h-4 w-4" /> Live Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("catalog")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                            activeTab === "catalog" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Package className="h-4 w-4" /> My Catalog
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : (
                <>
                    {/* --- TAB 1: ORDERS --- */}
                    {activeTab === "orders" && (
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <Card className="p-12 text-center border-dashed">
                                    <div className="inline-flex h-12 w-12 rounded-full bg-secondary items-center justify-center mb-4">
                                        <ListOrdered className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">No Orders Yet</h3>
                                    <p className="text-muted-foreground">When customers nearby place an order, it will appear here.</p>
                                </Card>
                            ) : (
                                <div className="grid gap-4">
                                    {orders.map((order) => (
                                        <Card key={order.id} className="p-6 border-border shadow-sm flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                                        Order #{order.id}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-sm font-medium capitalize bg-secondary px-2.5 py-1 rounded-md">
                                                        {getStatusIcon(order.status)} {order.status.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{order.productId}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">Quantity: <span className="font-medium text-foreground">{order.quantity} Units</span></p>
                                                </div>
                                                <div className="text-sm p-3 bg-secondary/50 rounded-lg border border-border">
                                                    <span className="font-semibold block mb-1">Delivery Address:</span>
                                                    {order.deliveryAddress}
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between items-start md:items-end gap-4 min-w-[200px]">
                                                <div className="text-left md:text-right w-full">
                                                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                                                    <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                                                </div>

                                                {/* Status Update Actions */}
                                                <div className="w-full">
                                                    {order.status === 'PLACED' && (
                                                        <Button className="w-full" onClick={() => handleUpdateStatus(order.id, 'MANUFACTURING')}>
                                                            Start Manufacturing
                                                        </Button>
                                                    )}
                                                    {order.status === 'MANUFACTURING' && (
                                                        <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleUpdateStatus(order.id, 'READY_FOR_DELIVERY')}>
                                                            Ready for Delivery
                                                        </Button>
                                                    )}
                                                    {order.status === 'READY_FOR_DELIVERY' && (
                                                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}>
                                                            Mark as Delivered
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB 2: CATALOG --- */}
                    {activeTab === "catalog" && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <Button asChild>
                                    <Link to="/vendor/catalog/add">
                                        <Plus className="mr-2 h-4 w-4" /> Add Product to Catalog
                                    </Link>
                                </Button>
                            </div>

                            {catalog.length === 0 ? (
                                <Card className="p-12 text-center border-dashed">
                                    <div className="inline-flex h-12 w-12 rounded-full bg-secondary items-center justify-center mb-4">
                                        <Package className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">Your Catalog is Empty</h3>
                                    <p className="text-muted-foreground mb-4">Add products to your catalog to start receiving local orders.</p>
                                    <Button variant="outline" asChild>
                                        <Link to="/vendor/catalog/add">Add First Product</Link>
                                    </Button>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {catalog.map((item) => (
                                        <Card key={item.id} className="p-5 flex flex-col justify-between border-border">
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">{item.productId}</h3>
                                                <p className="text-3xl font-bold text-primary mb-4">
                                                    ₹{item.vendorPrice} <span className="text-sm font-normal text-muted-foreground">/ base unit</span>
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    <p className="text-sm font-medium border-b border-border pb-1">Volume Discounts Configured:</p>
                                                    {item.discountTiers?.length > 0 ? (
                                                        item.discountTiers.map((tier: any) => (
                                                            <div key={tier.id} className="flex justify-between text-sm">
                                                                <span className="text-muted-foreground">
                                                                    {tier.minQuantity} - {tier.maxQuantity || '∞'} units:
                                                                </span>
                                                                <span className="font-medium text-green-600">-{tier.discountPercentage}%</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground italic">No discounts set.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <Button variant="secondary" className="w-full" asChild>
                                                <Link to={`/vendor/catalog/edit/${item.productId}`}>
                                                    Edit Pricing
                                                </Link>
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    );
}