import { useState } from "react";
import { useNavigate } from "react-router";
import { Store, MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { api } from '@/api/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) {
      alert("Please detect your physical location first so clients can find you!");
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

          <div className="space-y-4 p-4 border rounded-xl bg-secondary/30">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Physical Location
            </h3>
            <p className="text-sm text-muted-foreground">
              We use your exact coordinates to route nearby orders to your shop.
            </p>
            
            <Button 
              type="button" 
              variant={coordinates ? "outline" : "default"} 
              className="w-full gap-2" 
              onClick={handleDetectLocation}
            >
              {isDetecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              {coordinates ? "Location Locked" : "Detect My Location"}
            </Button>
          </div>

          {coordinates && (
            <div className="space-y-2">
              <Label htmlFor="address">Full Shop Address</Label>
              <textarea 
                id="address"
                required
                className="w-full p-3 bg-background border border-border rounded-md min-h-[100px] text-sm"
                placeholder="Shop No, Building, Street Name..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}

          <Button type="submit" size="lg" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Complete Setup
          </Button>
        </form>
      </Card>
    </main>
  );
}