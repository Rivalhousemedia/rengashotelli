import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCustomer } from "@/lib/supabase";
import QRCode from "./QRCode";
import { Customer } from "@/lib/types";
import StorageMap from "./StorageMap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Generate tire sizes from 16 to 24 inches
const tireSizes = Array.from({ length: 9 }, (_, i) => `${i + 16}"`);

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
    setIsLoading(true);
    
    try {
      const customer = await createCustomer(formData);
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
          <Select
            value={formData.summerTireSize}
            onValueChange={(value) => setFormData({ ...formData, summerTireSize: value })}
            required
          >
            <SelectTrigger className="bg-gray-800/30 border-gray-700 focus:bg-gray-800/30 hover:bg-gray-800/50 text-gray-300">
              <SelectValue placeholder="Select tire size" />
            </SelectTrigger>
            <SelectContent>
              {tireSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="winterTireSize">Winter Tire Size</Label>
          <Select
            value={formData.winterTireSize}
            onValueChange={(value) => setFormData({ ...formData, winterTireSize: value })}
            required
          >
            <SelectTrigger className="bg-gray-800/30 border-gray-700 focus:bg-gray-800/30 hover:bg-gray-800/50 text-gray-300">
              <SelectValue placeholder="Select tire size" />
            </SelectTrigger>
            <SelectContent>
              {tireSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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