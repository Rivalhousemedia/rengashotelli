import type { StorageLocation, Customer } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomersWithLocations, assignStorageLocation } from "@/lib/api/storageApi";
import { toast } from "sonner";
import StorageHotel from "./storage/StorageHotel";
import { Dialog, DialogContent } from "./ui/dialog";
import CustomerForm from "./CustomerForm";
import { useState } from "react";

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
    mutationFn: ({ customerId, location }: { customerId: string, location: Omit<StorageLocation, 'id' | 'created_at'> }) => 
      assignStorageLocation(customerId, location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-locations'] });
      toast.success('Storage location assigned successfully');
    },
    onError: () => {
      toast.error('Failed to assign storage location');
    }
  });

  const removeFromLocation = useMutation({
    mutationFn: (customerId: string) => 
      assignStorageLocation(customerId, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-locations'] });
      toast.success('Customer removed from location');
    },
    onError: () => {
      toast.error('Failed to remove customer from location');
    }
  });

  const getCustomerAtLocation = (hotel: number, section: string, shelf: number) => {
    return customers?.find(customer => 
      customer.storageLocation?.hotel === hotel &&
      customer.storageLocation?.section === section &&
      customer.storageLocation?.shelf === shelf.toString()
    );
  };

  const handleLocationClick = async (hotel: number, section: string, shelf: number) => {
    if (selectedCustomer) {
      const existingCustomer = getCustomerAtLocation(hotel, section, shelf);
      if (existingCustomer) {
        toast.error('This location is already occupied');
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
      // Open dialog for new customer creation
      setSelectedLocation({ hotel, section, shelf });
      setIsDialogOpen(true);
    }
  };

  const handleRemoveCustomer = (customerId: string) => {
    removeFromLocation.mutate(customerId);
  };

  const handlePrintQRCode = (hotel: number, section: string, shelf: number) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Location QR Code</title>
          </head>
          <body>
            <div id="print-content"></div>
          </body>
        </html>
      `);
      
      const content = document.createElement('div');
      content.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
          ${document.getElementById(`location-qr-${hotel}-${section}-${shelf}`)?.innerHTML}
        </div>
      `;
      
      printWindow.document.getElementById('print-content')?.appendChild(content);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
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
            handleRemoveCustomer={handleRemoveCustomer}
            handlePrintQRCode={handlePrintQRCode}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <CustomerForm 
            preselectedLocation={selectedLocation ? 
              `H${selectedLocation.hotel}-${selectedLocation.section}-${selectedLocation.shelf}` 
              : undefined
            }
            onSuccess={() => {
              setIsDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['customers-locations'] });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}