import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Customer } from "@/lib/types";

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    licensePlate: "",
    tireSize: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    toast.success("Customer information saved!");
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
          value={formData.licensePlate}
          onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tireSize">Tire Size</Label>
        <Input
          id="tireSize"
          value={formData.tireSize}
          onChange={(e) => setFormData({ ...formData, tireSize: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Generate QR Code
      </Button>
    </form>
  );
}