import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCustomer } from "@/lib/supabase";
import QRCode from "./QRCode";
import { Customer } from "@/lib/types";
import StorageMap from "./StorageMap";

export default function CustomerForm() {
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'created_at'>>({
    name: "",
    licensePlate: "",
    summerTireSize: "",
    winterTireSize: "",
    phone: "",
    email: "",
    status: "active",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState<Customer | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.summerTireSize && !formData.winterTireSize) {
      toast.error("Please fill in either summer or winter tire size");
      return;
    }
    setIsLoading(true);
    
    try {
      const customer = await createCustomer(formData);
      console.log("Saved customer data:", customer); // Debug log
      toast.success("Customer information saved!");
      setSavedCustomer(customer);
      setFormData({
        name: "",
        licensePlate: "",
        summerTireSize: "",
        winterTireSize: "",
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

  const handleLocationSelect = (hotel: number, section: string, shelf: number) => {
    setSelectedLocation(`H${hotel}-${section}-${shelf}`);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow">
        <div className="space-y-2">
          <Label htmlFor="name">Customer Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-gray-800/30 border-gray-700 focus:bg-gray-800/30 hover:bg-gray-800/50 text-gray-300"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="licensePlate">License Plate</Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
            required
            className="bg-gray-800/30 border-gray-700 focus:bg-gray-800/30 hover:bg-gray-800/50 text-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summerTireSize">Summer Tire Size</Label>
          <Input
            id="summerTireSize"
            value={formData.summerTireSize}
            onChange={(e) => setFormData({ ...formData, summerTireSize: e.target.value })}
            placeholder="e.g., 205/55R16"
            className="bg-gray-800/30 border-gray-700 focus:bg-gray-800/30 hover:bg-gray-800/50 text-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="winterTireSize">Winter Tire Size</Label>
          <Input
            id="winterTireSize"
            value={formData.winterTireSize}
            onChange={(e) => setFormData({ ...formData, winterTireSize: e.target.value })}
            placeholder="e.g., 205/55R16"
            className="bg-gray-800/30 border-gray-700 focus:bg-gray-800/30 hover:bg-gray-800/50 text-gray-300"
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
            className="bg-gray-800/30 border-gray-700 focus:bg-gray-800/30 hover:bg-gray-800/50 text-gray-300"
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
            className="bg-gray-800/30 border-gray-700 focus:bg-gray-800/30 hover:bg-gray-800/50 text-gray-300"
          />
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Customer"}
        </Button>
      </form>

      {savedCustomer && (
        <div className="space-y-6">
          <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow">
            {selectedLocation && (
              <div className="mb-4 text-center">
                <h3 className="text-lg text-gray-400 mb-2">Selected Location:</h3>
                <p className="text-3xl font-bold text-green-500">{selectedLocation}</p>
              </div>
            )}
            <QRCode customer={savedCustomer} selectedLocation={selectedLocation} />
            <Button 
              onClick={() => window.print()} 
              className="mt-4 w-full bg-green-600 hover:bg-green-700"
            >
              Print Label
            </Button>
          </div>
          
          <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow">
            <h2 className="text-lg font-semibold mb-4">Assign Storage Location</h2>
            <p className="text-sm text-gray-300 mb-4">Click on an empty storage location to assign this customer.</p>
            <StorageMap 
              selectedCustomer={savedCustomer} 
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
