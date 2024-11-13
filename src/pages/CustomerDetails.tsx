import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCustomerById, updateCustomer } from "@/lib/api/customerApi";
import { useState } from "react";
import type { Customer } from "@/lib/types";
import { QrCode } from "lucide-react";
import QRCode from "@/components/QRCode";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id as string),
    enabled: !!id
  });

  const [formData, setFormData] = useState<Partial<Customer>>({});

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Customer>) => updateCustomer(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      toast.success("Customer information updated successfully");
    },
    onError: () => {
      toast.error("Failed to update customer information");
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handlePrintQR = () => {
    if (!customer) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Customer QR Code</title>
            <style>
              @media print {
                body { margin: 0; }
                .print-content { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="print-content"></div>
          </body>
        </html>
      `);
      
      const content = document.createElement('div');
      content.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
          ${document.getElementById('customer-qr-details')?.innerHTML || ''}
        </div>
      `;
      
      const printContent = printWindow.document.querySelector('.print-content');
      if (printContent) {
        printContent.appendChild(content);
      }
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back
      </Button>
      
      {customer && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                defaultValue={customer.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800/30 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                defaultValue={customer.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="bg-gray-800/30 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summerTireSize">Summer Tire Size</Label>
              <Input
                id="summerTireSize"
                defaultValue={customer.summerTireSize}
                onChange={(e) => setFormData({ ...formData, summerTireSize: e.target.value })}
                className="bg-gray-800/30 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="winterTireSize">Winter Tire Size</Label>
              <Input
                id="winterTireSize"
                defaultValue={customer.winterTireSize}
                onChange={(e) => setFormData({ ...formData, winterTireSize: e.target.value })}
                className="bg-gray-800/30 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                defaultValue={customer.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-gray-800/30 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={customer.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-800/30 border-gray-700"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Customer"}
            </Button>
          </form>

          <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow">
            <div id="customer-qr-details" className="mb-4">
              <QRCode customer={customer} selectedLocation={customer.storageLocation ? 
                `H${customer.storageLocation.hotel}-${customer.storageLocation.section}-${customer.storageLocation.shelf}` : 
                null} 
              />
            </div>
            <Button 
              onClick={handlePrintQR}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Print Customer QR
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
