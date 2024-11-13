import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCustomer } from "@/lib/supabase";
import QRCode from "./QRCode";

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    license_plate: "",
    summer_tire_size: "",
    winter_tire_size: "",
    phone: "",
    email: "",
    status: "active",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const customer = await createCustomer(formData);
      toast.success("Customer information saved!");
      setSavedCustomer(customer);
      setFormData({
        name: "",
        license_plate: "",
        summer_tire_size: "",
        winter_tire_size: "",
        phone: "",
        email: "",
        status: "active"
      });
    } catch (error) {
      toast.error("Failed to save customer information");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow">
        <div className="space-y-2">
          <Label htmlFor="name">Customer Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="licensePlate">License Plate</Label>
          <Input
            id="licensePlate"
            value={formData.license_plate}
            onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="summerTireSize">Summer Tire Size</Label>
          <Input
            id="summerTireSize"
            value={formData.summer_tire_size}
            onChange={(e) => setFormData({ ...formData, summer_tire_size: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="winterTireSize">Winter Tire Size</Label>
          <Input
            id="winterTireSize"
            value={formData.winter_tire_size}
            onChange={(e) => setFormData({ ...formData, winter_tire_size: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Generate QR Code"}
        </Button>
      </form>

      {savedCustomer && (
        <div className="p-6 bg-white rounded-lg shadow">
          <QRCode customer={savedCustomer} />
          <Button 
            onClick={() => window.print()} 
            className="mt-4 w-full"
          >
            Print Label
          </Button>
        </div>
      )}
    </div>
  );
}