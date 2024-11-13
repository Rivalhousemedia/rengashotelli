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
import StorageMap from "@/components/StorageMap";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

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
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Päivitetään..." : "Päivitä asiakas"}
          </Button>
        </form>

        <div className="space-y-6">
          <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow">
            {locationCode && (
              <div className="mb-4 text-center">
                <h3 className="text-lg text-gray-400 mb-2">Valittu sijainti:</h3>
                <p className="text-3xl font-bold text-green-500">{locationCode}</p>
              </div>
            )}
            <div id="customer-qr-details">
              <QRCode customer={customer} selectedLocation={locationCode} />
            </div>
            <Button 
              onClick={handlePrintQR} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Tulosta asiakkaan QR
            </Button>
          </div>
          
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
