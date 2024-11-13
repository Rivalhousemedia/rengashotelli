import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import QRCode from "@/components/QRCode";
import type { Customer } from "@/lib/types";

interface CustomerQRSectionProps {
  customer: Customer;
  locationCode: string | null;
  onPrintQR: () => void;
}

export default function CustomerQRSection({ customer, locationCode, onPrintQR }: CustomerQRSectionProps) {
  return (
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
        onClick={onPrintQR} 
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
      >
        <QrCode className="w-4 h-4 mr-2" />
        Tulosta asiakkaan QR
      </Button>
    </div>
  );
}