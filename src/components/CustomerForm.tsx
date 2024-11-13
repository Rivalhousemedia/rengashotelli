import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCustomer } from "@/lib/supabase";
import type { Customer } from "@/lib/supabase-types";

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    license_plate: "",
    tire_size: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await createCustomer(formData);
      toast.success("Customer information saved!");
      setFormData({ name: "", license_plate: "", tire_size: "" });
    } catch (error) {
      toast.error("Failed to save customer information");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        <Label htmlFor="tireSize">Tire Size</Label>
        <Input
          id="tireSize"
          value={formData.tire_size}
          onChange={(e) => setFormData({ ...formData, tire_size: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Generate QR Code"}
      </Button>
    </form>
  );
}