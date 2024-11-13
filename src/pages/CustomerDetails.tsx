import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCustomerById, updateCustomer } from "@/lib/api/customerApi";
import { useState } from "react";
import type { Customer } from "@/lib/types";
import StorageMap from "@/components/StorageMap";
import CustomerQRSection from "@/components/customer/CustomerQRSection";
import CustomerEditForm from "@/components/customer/CustomerEditForm";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id as string),
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Customer>) => updateCustomer(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      toast.success("Asiakkaan tiedot päivitetty onnistuneesti");
    },
    onError: () => {
      toast.error("Asiakkaan tietojen päivitys epäonnistui");
    }
  });

  const handleLocationSelect = (hotel: number, section: string, shelf: number) => {
    setSelectedLocation(`H${hotel}-${section}-${shelf}`);
  };

  const handlePrintQR = () => {
    if (!customer) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Asiakkaan QR-koodi</title>
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

  if (isLoading) return <div>Ladataan...</div>;
  if (!customer) return <div>Asiakasta ei löytynyt</div>;

  const locationCode = customer.storageLocation ? 
    `H${customer.storageLocation.hotel}-${customer.storageLocation.section}-${customer.storageLocation.shelf}` : 
    selectedLocation;

  return (
    <div className="container mx-auto p-4">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Takaisin
      </Button>
      
      <div className="space-y-6 max-w-2xl mx-auto">
        <CustomerEditForm 
          customer={customer}
          onSubmit={updateMutation.mutate}
          isLoading={updateMutation.isPending}
        />

        <div className="space-y-6">
          <CustomerQRSection 
            customer={customer}
            locationCode={locationCode}
            onPrintQR={handlePrintQR}
          />
          
          <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow">
            <h2 className="text-lg font-semibold mb-4">Määritä varastopaikka</h2>
            <p className="text-sm text-gray-300 mb-4">Klikkaa tyhjää varastopaikkaa määrittääksesi asiakkaan sijainnin.</p>
            <StorageMap 
              selectedCustomer={customer} 
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}