import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { MapPin, Navigation, Loader2, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  
  // New States for the dynamic quote
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!orderData) return <Navigate to="/" replace />;

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Immediately fetch the quote once we have coordinates
          fetchNearestVendorQuote(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error(error);
          alert("Could not detect location.");
        }
      );
    }
  };

  const fetchNearestVendorQuote = async (lat: number, lng: number) => {
    setIsFetchingQuote(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const url = `http://localhost:8080/api/vendors/nearest?productId=${orderData.productId}&lat=${lat}&lng=${lng}&quantity=${orderData.quantity}`;
      
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("No nearby vendors found");
      
      const data = await response.json();
      setQuoteData(data);
    } catch (error) {
      alert("Sorry, no vendors are currently available for this product in your area.");
      setCoordinates(null);
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      alert("Please provide a complete delivery address.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const payload = {
        productId: orderData.productId,
        quantity: orderData.quantity,
        deliveryLat: coordinates?.lat,
        deliveryLng: coordinates?.lng,
        deliveryAddress: deliveryAddress
      };

      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to place order");
      setOrderSuccess(true);
    } catch (error) {
      alert("Error placing order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center">
        <ShieldCheck className="h-16 w-16 text-green-600 mb-4" />
        <h1 className="text-4xl font-serif mb-4">Order Placed Successfully!</h1>
        <Button onClick={() => navigate("/")} size="lg">Return to Home</Button>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Secure Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <section className="space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-medium">Delivery Location</h2>
            <Button 
              variant={coordinates ? "outline" : "default"} 
              className="w-full" 
              onClick={handleDetectLocation}
            >
              {coordinates ? "Location Detected" : "Auto-Detect Location for Pricing"}
            </Button>

            {coordinates && (
              <div className="space-y-2">
                <Label>Full Delivery Address</Label>
                <textarea 
                  className="w-full p-3 bg-secondary/50 border rounded-md min-h-[100px]"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
            )}
          </Card>
        </section>

        <section>
          <Card className="p-6 bg-secondary/20 border-primary/20">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Order Summary
            </h2>
            
            {isFetchingQuote ? (
              <div className="py-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>
            ) : quoteData ? (
              <div className="space-y-4 text-sm mb-6 border-b pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Agency</span>
                  <span className="font-medium">{quoteData.agencyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{quoteData.quantity} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit Price (Base)</span>
                  <span className="font-medium">₹{quoteData.baseUnitPrice}</span>
                </div>
                
                {quoteData.discountPercentage > 0 && (
                  <div className="flex justify-between text-green-600 font-medium bg-green-500/10 px-2 py-1 rounded">
                    <span>Volume Discount</span>
                    <span>-{quoteData.discountPercentage}% (₹{quoteData.finalUnitPrice}/unit)</span>
                  </div>
                )}
                
                <div className="flex justify-between items-end mt-6">
                  <span className="text-lg font-medium">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">₹{quoteData.totalAmount}</span>
                </div>
                
                <Button size="lg" className="w-full mt-4" onClick={handleCheckout} disabled={isPlacingOrder}>
                  {isPlacingOrder ? "Processing..." : "Confirm & Place Order"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Detect your location to calculate dynamic pricing and find the nearest vendor.
              </div>
            )}
          </Card>
        </section>

      </div>
    </main>
  );
}