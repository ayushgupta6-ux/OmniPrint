import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Store, MapPin, Navigation, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Helper component to handle map clicks for Vendor Onboarding
function MapClickHandler({ coordinates, setCoordinates }: any) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
    },
  });
  return coordinates ? <Marker position={[coordinates.lat, coordinates.lng]} /> : null;
}

// Helper component to smoothly recenter the map
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export default function VendorOnboardingPage() {
  const navigate = useNavigate();
  
  const [agencyName, setAgencyName] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsDetecting(false);
        },
        () => {
          alert("Could not detect location. Please ensure location services are enabled.");
          setIsDetecting(false);
        }
      );
    }
  };

  const handleSearchAddress = async () => {
    if (!address) return alert("Please type your shop address first.");
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoordinates({ lat, lng });
      } else {
        alert("Could not find coordinates for this address. Try typing a broader area, or click the map directly to place your pin!");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) {
      alert("Please detect your physical location or place a pin on the map first so clients can find you!");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.vendor.createProfile({
        agencyName,
        address,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });

      alert("Profile created successfully!");
      navigate("/vendor/dashboard"); // Redirect to their future dashboard
    } catch (error) {
      console.error(error);
      alert("Error setting up your agency. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 max-w-2xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
          <Store className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-serif">Welcome to OmniPrint!</h1>
        <p className="text-muted-foreground mt-2">Let's set up your agency profile so local customers can route orders to you.</p>
      </div>

      <Card className="p-8 border-border shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agencyName">Agency Name</Label>
            <Input 
              id="agencyName" 
              placeholder="e.g., FastPrint Noida" 
              required
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
            />
          </div>

          <div className="space-y-4 p-5 border rounded-xl bg-secondary/30">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Shop Location
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Search for your address, auto-detect your GPS, or click exactly where your shop is located on the map.
            </p>
            
            <div className="flex gap-2 mb-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2 h-12" 
                onClick={handleDetectLocation}
              >
                {isDetecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                Auto-Detect GPS
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Search & Confirm Address</Label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  required
                  className="flex-1 p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary h-12 text-sm"
                  placeholder="Shop No, Building, Street Name, City..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button type="button" className="h-12 w-12 p-0" onClick={handleSearchAddress}>
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* --- THE REAL MAP --- */}
            <div className="h-[300px] w-full rounded-md overflow-hidden border border-border z-0 relative mt-4">
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
                />
              </MapContainer>
            </div>
            {coordinates && (
              <p className="text-xs text-green-600 font-medium text-center mt-2">
                ✓ Shop location pinned successfully!
              </p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full h-14 text-lg font-medium shadow-md transition-transform active:scale-[0.98]" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Complete Setup
          </Button>
        </form>
      </Card>
    </main>
  );
}