import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { Loader2, Package, ShieldCheck, Wrench, Layers, Receipt, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { api } from '@/api/api';

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker missing in React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map clicks
function MapClickHandler({ coordinates, setCoordinates, fetchNearestVendorQuote }: any) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
      fetchNearestVendorQuote(lat, lng);
    },
  });
  return coordinates ? <Marker position={[coordinates.lat, coordinates.lng]} /> : null;
}

// Helper component to smoothly recenter the map on search or GPS detect
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState(""); // Added Phone State
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  
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
          fetchNearestVendorQuote(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error(error);
          alert("Could not detect location.");
        }
      );
    }
  };

  const handleSearchAddress = async () => {
    if (!deliveryAddress) return alert("Please type an address first.");
    
    try {
      // Free geocoding API from OpenStreetMap
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(deliveryAddress)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoordinates({ lat, lng });
        fetchNearestVendorQuote(lat, lng);
      } else {
        alert("Could not find coordinates for this address. Try typing a broader area, or click the map directly!");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const fetchNearestVendorQuote = async (lat: number, lng: number) => {
    setIsFetchingQuote(true);
    try {
      const payload = {
        productId: orderData.productId,
        quantity: orderData.quantity,
        lat: lat,
        lng: lng,
        selectedFilters: orderData.selections,         
        needsInstallation: orderData.needsInstallation 
      };

      const data = await api.vendor.getNearestVendorQuote(payload);
      setQuoteData(data);
    } catch (error) {
      alert("Sorry, no vendors are currently available for this product in your area.");
      setCoordinates(null);
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim() || !deliveryPhone.trim()) {
      alert("Please provide both a delivery address and a contact phone number.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const payload = {
        productId: orderData.productId,
        quantity: orderData.quantity,
        deliveryLat: coordinates?.lat,
        deliveryLng: coordinates?.lng,
        deliveryAddress: deliveryAddress,
        customerPhone: deliveryPhone, // Passing Phone to backend
        selectedFilters: orderData.selections,         
        needsInstallation: orderData.needsInstallation,
        designPath: orderData.designPath               
      };

      await api.orders.placeOrder(payload);
      setOrderSuccess(true);
    } catch (error) {
      alert("Error placing order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center min-h-[70vh]">
        <ShieldCheck className="h-16 w-16 text-green-600 mb-4" />
        <h1 className="text-4xl font-serif mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">Your local print agency has received your request and will begin processing shortly.</p>
        <Button onClick={() => navigate("/")} size="lg">Return to Home</Button>
      </main>
    );
  }

  // Calculate detailed breakdown values if quote exists
  const subtotal = quoteData ? (quoteData.baseUnitPrice * quoteData.quantity).toFixed(2) : 0;
  const savings = quoteData ? ((quoteData.baseUnitPrice - quoteData.finalUnitPrice) * quoteData.quantity).toFixed(2) : 0;

  return (
    <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-serif mb-8">Secure Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- LEFT COLUMN: Details & Location --- */}
        <section className="space-y-6">
          <Card className="p-6 space-y-4 shadow-sm border-border">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> Your Configuration
            </h2>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-sm px-3 py-1 bg-secondary text-foreground border rounded-md font-medium">
                Product: {orderData.productId}
              </span>
              <span className="text-sm px-3 py-1 bg-secondary text-foreground border rounded-md font-medium">
                Qty: {orderData.quantity} Units
              </span>
              {Object.entries(orderData.selections || {}).map(([key, value]) => (
                <span key={key} className="text-sm px-3 py-1 bg-background border rounded-md">
                  <span className="text-muted-foreground mr-1">{key}:</span> {value as string}
                </span>
              ))}
              {orderData.needsInstallation && (
                <span className="text-sm px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-md flex items-center gap-1">
                  <Wrench className="h-3 w-3" /> Includes Installation
                </span>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-6 shadow-sm border-border">
            <h2 className="text-xl font-medium">Delivery Location</h2>
            <p className="text-sm text-muted-foreground">
              Type your address or click exactly where you are on the map below.
            </p>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 h-12" 
                onClick={handleDetectLocation}
              >
                Auto-Detect Current GPS
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Search Address on Map</Label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  className="flex-1 p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary h-12"
                  placeholder="e.g. Connaught Place, New Delhi"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
                <Button className="h-12 w-12 p-0" onClick={handleSearchAddress}>
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* --- THE REAL MAP --- */}
            <div className="h-[300px] w-full rounded-md overflow-hidden border border-border z-0 relative">
              <MapContainer 
                center={coordinates ? [coordinates.lat, coordinates.lng] : [28.6139, 77.2090]} // Defaults to New Delhi
                zoom={coordinates ? 15 : 10} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Smoothly recenters map on search or GPS auto-detect */}
                {coordinates && <RecenterMap lat={coordinates.lat} lng={coordinates.lng} />}
                
                <MapClickHandler 
                  coordinates={coordinates} 
                  setCoordinates={setCoordinates} 
                  fetchNearestVendorQuote={fetchNearestVendorQuote} 
                />
              </MapContainer>
            </div>
            
            {/* Phone Number Input */}
            <div className="space-y-2 pt-2">
              <Label>Contact Phone Number</Label>
              <input 
                type="tel"
                className="w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary h-12"
                placeholder="+91 98765 43210"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
              />
            </div>
          </Card>
        </section>

        {/* --- RIGHT COLUMN: Detailed Quote Summary --- */}
        <section>
          <Card className="p-6 bg-secondary/30 border-primary/20 shadow-md relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />

            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" /> Detailed Quote
            </h2>
            
            {isFetchingQuote ? (
              <div className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Finding the best local vendor...</p>
              </div>
            ) : quoteData ? (
              <div className="space-y-5 text-sm animate-in fade-in">
                
                {/* Agency Assignment */}
                <div className="p-3 bg-background border border-border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assigned Agency</p>
                    <p className="font-medium text-base">{quoteData.agencyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Distance</p>
                    <p className="font-medium">{quoteData.distanceKm} km away</p>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Base Price <span className="text-xs">(includes selected options)</span>
                    </span>
                    <span className="font-medium">₹{quoteData.baseUnitPrice} / unit</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">x {quoteData.quantity}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border border-dashed">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  
                  {quoteData.discountPercentage > 0 && (
                    <div className="flex justify-between items-center text-green-600 bg-green-500/10 p-2 rounded-md border border-green-500/20">
                      <span className="font-medium flex items-center gap-1">
                        Volume Discount ({quoteData.discountPercentage}%)
                      </span>
                      <span className="font-medium">- ₹{savings}</span>
                    </div>
                  )}

                  {quoteData.installationFee > 0 && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Wrench className="h-3 w-3" /> Professional Installation
                      </span>
                      <span className="font-medium">+ ₹{quoteData.installationFee}</span>
                    </div>
                  )}
                </div>
                
                {/* Grand Total */}
                <div className="flex justify-between items-end mt-6 pt-6 border-t border-border">
                  <div className="space-y-1">
                    <span className="text-lg font-medium block">Total Amount</span>
                    <span className="text-xs text-muted-foreground">Includes taxes & routing fees</span>
                  </div>
                  <span className="text-4xl font-bold text-primary">₹{quoteData.totalAmount}</span>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full mt-6 h-14 text-lg font-semibold shadow-lg transition-transform active:scale-[0.98]" 
                  onClick={handleCheckout} 
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Processing Order...</>
                  ) : (
                    "Confirm & Place Order"
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <MapPin className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm max-w-[250px] mx-auto">
                  Detect your location or click the map to calculate dynamic pricing and assign the nearest vendor.
                </p>
              </div>
            )}
          </Card>
        </section>

      </div>
    </main>
  );
}