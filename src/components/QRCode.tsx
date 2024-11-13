import { QRCodeSVG } from "qrcode.react";
import type { Customer } from "@/lib/types";

export default function QRCode({ customer, selectedLocation }: { customer: Customer, selectedLocation?: string | null }) {
  console.log("QRCode component - Received props:", {
    customerName: customer?.name,
    selectedLocation,
    hasStorageLocation: customer?.storageLocation ? 'yes' : 'no',
    storageLocationDetails: customer?.storageLocation
  });

  // Only create location code if we have all required values
  const locationFromStorage = customer.storageLocation ? 
    (customer.storageLocation.hotel && customer.storageLocation.section && customer.storageLocation.shelf) ?
      `H${customer.storageLocation.hotel}-${customer.storageLocation.section}-${customer.storageLocation.shelf}` :
      null :
    null;

  console.log("QRCode - Location from storage:", locationFromStorage);

  const qrData = JSON.stringify({
    id: customer.id,
    name: customer.name,
    licensePlate: customer.licensePlate,
    location: selectedLocation || locationFromStorage
  });

  const getTireInfo = () => {
    if (customer.summerTireSize && customer.summerTireSize.length > 0) {
      return `Summer tires ${customer.summerTireSize}`;
    }
    if (customer.winterTireSize && customer.winterTireSize.length > 0) {
      return `Winter tires ${customer.winterTireSize}`;
    }
    return '';
  };

  // Determine the location display text with proper validation
  const locationDisplay = selectedLocation || locationFromStorage || 'Not assigned';

  console.log("QRCode component - Final location display:", locationDisplay);

  return (
    <div className="p-4 bg-white rounded-3xl shadow print:shadow-none w-[400px]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="font-bold text-2xl text-black truncate">{customer.name}</p>
          <p className="text-lg text-gray-600 truncate">{customer.licensePlate}</p>
          <p className="text-xl font-bold text-gray-600 break-words">{locationDisplay}</p>
          <p className="text-lg text-gray-600 break-words">{getTireInfo()}</p>
        </div>
        <QRCodeSVG value={qrData} size={100} className="flex-shrink-0" />
      </div>
    </div>
  );
}