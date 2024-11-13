import { StorageLocation } from "@/lib/types";
import StorageShelf from "./StorageShelf";
import type { Customer } from "@/lib/types";

interface StorageSectionProps {
  hotel: number;
  section: string;
  shelves: number[];
  selectedCustomer?: Customer;
  onLocationSelect?: (hotel: number, section: string, shelf: number) => void;
  getCustomerAtLocation: (hotel: number, section: string, shelf: number) => Customer | undefined;
  handleRemoveCustomer: (customerId: string) => void;
  handlePrintQRCode: (hotel: number, section: string, shelf: number) => void;
}

export default function StorageSection({
  hotel,
  section,
  shelves,
  selectedCustomer,
  onLocationSelect,
  getCustomerAtLocation,
  handleRemoveCustomer,
  handlePrintQRCode
}: StorageSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Section {section}</h4>
      <div className="space-y-2">
        {shelves.map((shelf) => (
          <StorageShelf
            key={shelf}
            hotel={hotel}
            section={section}
            shelf={shelf}
            selectedCustomer={selectedCustomer}
            onLocationSelect={onLocationSelect}
            customer={getCustomerAtLocation(hotel, section, shelf)}
            onRemoveCustomer={handleRemoveCustomer}
            onPrintQRCode={handlePrintQRCode}
          />
        ))}
      </div>
    </div>
  );
}