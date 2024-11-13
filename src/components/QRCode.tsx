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

  return (
    <div className="p-4 bg-white rounded-lg shadow print:shadow-none">
      <QRCodeSVG value={qrData} size={200} />
      <div className="mt-4 text-center space-y-1">
        <p className="font-medium">{customer.name}</p>
        <p className="text-sm text-gray-600">{customer.licensePlate}</p>
        <p className="text-xs text-gray-600">
          Summer: {customer.summerTireSize} | Winter: {customer.winterTireSize}
        </p>
      </div>
    </div>
  );
}