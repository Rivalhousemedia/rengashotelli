import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/lib/types";
import { useState } from "react";

interface CustomerEditFormProps {
  customer: Customer;
  onSubmit: (data: Partial<Customer>) => void;
  isLoading: boolean;
}

export default function CustomerEditForm({ customer, onSubmit, isLoading }: CustomerEditFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: customer.name,
    licensePlate: customer.licensePlate,
    summerTireSize: customer.summerTireSize,
    winterTireSize: customer.winterTireSize,
    phone: customer.phone,
    email: customer.email
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Asiakkaan nimi</Label>
        <Input
          id="name"
          defaultValue={customer.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-gray-800/30 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="licensePlate">Rekisterinumero</Label>
        <Input
          id="licensePlate"
          defaultValue={customer.licensePlate}
          onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
          className="bg-gray-800/30 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summerTireSize">Kesärenkaiden koko</Label>
        <Input
          id="summerTireSize"
          defaultValue={customer.summerTireSize}
          onChange={(e) => setFormData({ ...formData, summerTireSize: e.target.value })}
          className="bg-gray-800/30 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="winterTireSize">Talvirenkaiden koko</Label>
        <Input
          id="winterTireSize"
          defaultValue={customer.winterTireSize}
          onChange={(e) => setFormData({ ...formData, winterTireSize: e.target.value })}
          className="bg-gray-800/30 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Puhelin</Label>
        <Input
          id="phone"
          defaultValue={customer.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="bg-gray-800/30 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Sähköposti</Label>
        <Input
          id="email"
          defaultValue={customer.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-gray-800/30 border-gray-700"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Päivitetään..." : "Päivitä asiakas"}
      </Button>
    </form>
  );
}