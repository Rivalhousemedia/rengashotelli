import { Card } from "@/components/ui/card";
import StorageSection from "./StorageSection";
import { Customer } from "@/lib/types";

interface StorageHotelProps {
  hotel: number;
  sections: string[];
  shelves: number[];
  selectedCustomer?: Customer;
  onLocationSelect?: (hotel: number, section: string, shelf: number) => void;
  getCustomerAtLocation: (hotel: number, section: string, shelf: number) => Customer | undefined;
  handleRemoveCustomer: (customerId: string) => void;
  handlePrintQRCode: (hotel: number, section: string, shelf: number) => void;
}

export default function StorageHotel({
  hotel,
  sections,
  shelves,
  selectedCustomer,
  onLocationSelect,
  getCustomerAtLocation,
  handleRemoveCustomer,
  handlePrintQRCode
}: StorageHotelProps) {
  return (
    <Card className="p-4 bg-gray-900/50 border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Hotel {hotel}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <StorageSection
            key={section}
            hotel={hotel}
            section={section}
            shelves={shelves}
            selectedCustomer={selectedCustomer}
            onLocationSelect={onLocationSelect}
            getCustomerAtLocation={getCustomerAtLocation}
            handleRemoveCustomer={handleRemoveCustomer}
            handlePrintQRCode={handlePrintQRCode}
          />
        ))}
      </div>
    </Card>
  );
}