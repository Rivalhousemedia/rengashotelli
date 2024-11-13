import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Printer, QrCode } from "lucide-react";
import LocationQRCode from "../LocationQRCode";
import QRCode from "../QRCode";
import type { Customer } from "@/lib/types";
import { Link } from "react-router-dom";

interface StorageShelfProps {
  hotel: number;
  section: string;
  shelf: number;
  selectedCustomer?: Customer;
  customer?: Customer;
  onLocationSelect?: (hotel: number, section: string, shelf: number) => void;
  onRemoveCustomer: (customerId: string) => void;
  onPrintQRCode: (hotel: number, section: string, shelf: number) => void;
}

export default function StorageShelf({
  hotel,
  section,
  shelf,
  selectedCustomer,
  customer,
  onLocationSelect,
  onRemoveCustomer,
  onPrintQRCode
}: StorageShelfProps) {
  const isSelected = selectedCustomer?.id === customer?.id;
  const locationCode = `H${hotel}-${section}-${shelf}`;

  const handlePrintCustomerQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && customer) {
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
          ${document.getElementById(`customer-qr-${customer.id}`)?.innerHTML || ''}
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
    <Popover>
      <PopoverTrigger asChild>
        <div
          onClick={() => !customer && onLocationSelect?.(hotel, section, shelf)}
          className={`p-2 border rounded cursor-pointer transition-colors ${
            isSelected
              ? "bg-green-600/20 border-green-500 text-green-400"
              : customer
              ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
              : "bg-gray-800/30 border-gray-700 hover:bg-gray-800/50"
          }`}
        >
          <div className="text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{locationCode}</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div id={`location-qr-${hotel}-${section}-${shelf}`}>
                    <LocationQRCode 
                      hotel={hotel} 
                      section={section} 
                      shelf={shelf} 
                    />
                  </div>
                  <Button 
                    className="mt-4 w-full"
                    onClick={() => onPrintQRCode(hotel, section, shelf)}
                  >
                    Tulosta sijainnin QR-koodi
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            {customer ? (
              <div className="font-medium text-green-400">{customer.licensePlate}</div>
            ) : (
              <div className="text-gray-500">Tyhjä</div>
            )}
          </div>
        </div>
      </PopoverTrigger>
      {customer && (
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Asiakkaan tiedot</h4>
            <div className="space-y-2">
              <div>
                <Label>Nimi</Label>
                <div>{customer.name}</div>
              </div>
              <div>
                <Label>Rekisterinumero</Label>
                <div>{customer.licensePlate}</div>
              </div>
              <div>
                <Label>Kesärenkaiden koko</Label>
                <div>{customer.summerTireSize}</div>
              </div>
              <div>
                <Label>Talvirenkaiden koko</Label>
                <div>{customer.winterTireSize}</div>
              </div>
              <div>
                <Label>Puhelin</Label>
                <div>{customer.phone}</div>
              </div>
              <div>
                <Label>Sähköposti</Label>
                <div>{customer.email}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                variant="destructive"
                onClick={() => onRemoveCustomer(customer.id)}
                className="w-full mb-2"
              >
                Poista sijainnista
              </Button>
              <Link to={`/customer/${customer.id}`}>
                <Button variant="secondary" className="w-full">
                  Muokkaa asiakasta
                </Button>
              </Link>
              <div id={`customer-qr-${customer.id}`} className="hidden">
                <QRCode customer={customer} selectedLocation={locationCode} />
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handlePrintCustomerQR}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Tulosta asiakkaan QR
              </Button>
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}