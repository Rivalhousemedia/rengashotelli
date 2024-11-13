import { QRCodeSVG } from "qrcode.react";
import type { Customer } from "@/lib/types";

export default function QRCode({ customer }: { customer: Customer }) {
  const qrData = JSON.stringify({
    id: customer.id,
    name: customer.name,
    licensePlate: customer.licensePlate,
    summerTireSize: customer.summerTireSize,
    winterTireSize: customer.winterTireSize,
  });

  const formatLocationCode = (customer: Customer) => {
    if (!customer.storageLocation) return 'Not assigned';
    const { hotel, section, shelf } = customer.storageLocation;
    return `H${hotel}-${section}-${shelf}`;
  };

  return (
    <div className="p-4 bg-white rounded-3xl shadow print:shadow-none w-[400px]">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold text-2xl text-black">{customer.name}</p>
          <p className="text-lg text-gray-600">{customer.licensePlate}</p>
          <p className="text-sm text-gray-600">{formatLocationCode(customer)}</p>
        </div>
        <QRCodeSVG value={qrData} size={100} />
      </div>
    </div>
  );
}