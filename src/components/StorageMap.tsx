import type { StorageLocation, Customer } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomersWithLocations, assignStorageLocation } from "@/lib/api/storageApi";
import { toast } from "sonner";
import StorageHotel from "./storage/StorageHotel";
import { useState } from "react";
import CustomerSearchDialog from "./storage/CustomerSearchDialog";

interface StorageMapProps {
  selectedCustomer?: Customer;
  onLocationSelect?: (hotel: number, section: string, shelf: number) => void;
}

export default function StorageMap({ selectedCustomer, onLocationSelect }: StorageMapProps) {
  const hotels = [1, 2, 3, 4];
  const sections = ["A", "B", "C"];
  const shelves = [1, 2, 3, 4, 5, 6];
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    hotel: number;
    section: string;
    shelf: number;
  } | null>(null);

  const { data: customers = [] } = useQuery({
    queryKey: ['customers-locations'],
    queryFn: getCustomersWithLocations,
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const assignLocation = useMutation({
    mutationFn: ({ customerId, location }: { customerId: string, location: Omit<StorageLocation, 'id' | 'created_at'> }) => {
      console.log("Assigning location:", { customerId, location });
      return assignStorageLocation(customerId, location);
    },
    onSuccess: (data) => {
      console.log("Assignment successful, response:", data);
      queryClient.invalidateQueries({ queryKey: ['customers-locations'] });
      toast.success('Varastopaikka määritetty onnistuneesti');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Assignment failed:", error);
      toast.error('Varastopaikan määritys epäonnistui');
    }
  });

  const removeFromLocation = useMutation({
    mutationFn: (customerId: string) => 
      assignStorageLocation(customerId, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-locations'] });
      toast.success('Asiakas poistettu varastopaikasta');
    },
    onError: () => {
      toast.error('Asiakkaan poisto varastopaikasta epäonnistui');
    }
  });

  const getCustomerAtLocation = (hotel: number, section: string, shelf: number) => {
    const customer = customers?.find(customer => 
      customer.storageLocation?.hotel === hotel &&
      customer.storageLocation?.section === section &&
      customer.storageLocation?.shelf === shelf.toString()
    );
    console.log("Customer at location:", { hotel, section, shelf, customer });
    return customer;
  };

  const handleLocationClick = async (hotel: number, section: string, shelf: number) => {
    console.log("Location clicked:", { hotel, section, shelf });
    if (selectedCustomer) {
      console.log("Selected customer:", selectedCustomer);
      const existingCustomer = getCustomerAtLocation(hotel, section, shelf);
      if (existingCustomer) {
        toast.error('Tämä paikka on jo varattu');
        return;
      }

      await assignLocation.mutateAsync({
        customerId: selectedCustomer.id,
        location: {
          hotel,
          section,
          shelf: shelf.toString(),
          level: 1,
          position: 1
        }
      });

      if (onLocationSelect) {
        onLocationSelect(hotel, section, shelf);
      }
    } else {
      setSelectedLocation({ hotel, section, shelf });
      setIsDialogOpen(true);
    }
  };

  const handleAssignExistingCustomer = async (customer: Customer) => {
    console.log("Assigning existing customer:", { customer, selectedLocation });
    if (!selectedLocation) return;

    await assignLocation.mutateAsync({
      customerId: customer.id,
      location: {
        hotel: selectedLocation.hotel,
        section: selectedLocation.section,
        shelf: selectedLocation.shelf.toString(),
        level: 1,
        position: 1
      }
    });
  };

  const handlePrintQRCode = (hotel: number, section: string, shelf: number) => {
    console.log("Print QR code for location:", hotel, section, shelf);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <StorageHotel
            key={hotel}
            hotel={hotel}
            sections={sections}
            shelves={shelves}
            selectedCustomer={selectedCustomer}
            onLocationSelect={handleLocationClick}
            getCustomerAtLocation={getCustomerAtLocation}
            handleRemoveCustomer={removeFromLocation.mutate}
            handlePrintQRCode={handlePrintQRCode}
          />
        ))}
      </div>

      <CustomerSearchDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCustomerSelect={handleAssignExistingCustomer}
        preselectedLocation={selectedLocation ? 
          `H${selectedLocation.hotel}-${selectedLocation.section}-${selectedLocation.shelf}` 
          : undefined
        }
      />
    </>
  );
}