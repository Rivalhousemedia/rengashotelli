import { QRCodeSVG } from "qrcode.react";

interface LocationQRCodeProps {
  hotel: number;
  section: string;
  shelf: number | string;
}

export default function LocationQRCode({ hotel, section, shelf }: LocationQRCodeProps) {
  // Ensure all values are defined and valid before creating the location code
  if (!hotel || !section || !shelf || 
      typeof hotel !== 'number' || 
      typeof section !== 'string') {
    console.error("LocationQRCode - Invalid or missing props:", { hotel, section, shelf });
    return null;
  }

  const locationCode = `H${hotel}-${section}-${shelf}`;
  const qrData = JSON.stringify({ hotel, section, shelf });

  console.log("LocationQRCode - Generated code:", locationCode);

  return (
    <div className="p-4 bg-white rounded-3xl shadow print:shadow-none w-[200px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <QRCodeSVG value={qrData} size={150} />
        <p className="text-xl font-bold text-black">{locationCode}</p>
      </div>
    </div>
  );
}