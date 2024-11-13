import { QRCodeSVG } from "qrcode.react";
import type { Customer } from "@/lib/types";

export default function QRCode({ customer, selectedLocation }: { customer: Customer, selectedLocation?: string | null }) {
  const qrData = JSON.stringify({
    id: customer.id,
    name: customer.name,
    licensePlate: customer.licensePlate,
    summerTireSize: customer.summerTireSize,
    winterTireSize: customer.winterTireSize,
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

  return (
    <div className="p-4 bg-white rounded-3xl shadow print:shadow-none w-[400px]">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold text-2xl text-black">{customer.name}</p>
          <p className="text-lg text-gray-600">{customer.licensePlate}</p>
          <p className="text-xl font-bold text-gray-600">{selectedLocation || 'Not assigned'}</p>
          <p className="text-lg text-gray-600">{getTireInfo()}</p>
        </div>
        <QRCodeSVG value={qrData} size={100} />
      </div>
    </div>
  );
}