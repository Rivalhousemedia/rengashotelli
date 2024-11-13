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
  console.log("CustomerQRSection - Props received:", {
    customer,
    locationCode,
    hasStorageLocation: customer?.storageLocation ? 'yes' : 'no',
    storageLocationDetails: customer?.storageLocation
  });

  // Generate location code from storage location if not provided
  const displayLocationCode = locationCode || (customer?.storageLocation ? 
    `H${customer.storageLocation.hotel}-${customer.storageLocation.section}-${customer.storageLocation.shelf}` : 
    null
  );

  console.log("CustomerQRSection - Computed location code:", {
    providedLocationCode: locationCode,
    computedFromStorage: displayLocationCode,
  });

  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow">
      {displayLocationCode && (
        <div className="mb-4 text-center">
          <h3 className="text-lg text-gray-400 mb-2">Valittu sijainti:</h3>
          <p className="text-3xl font-bold text-green-500">{displayLocationCode}</p>
        </div>
      )}
      <div id="customer-qr-details">
        <QRCode customer={customer} selectedLocation={displayLocationCode} />
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