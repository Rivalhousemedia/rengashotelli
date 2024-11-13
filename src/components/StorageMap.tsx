import { Card } from "@/components/ui/card";
import type { StorageLocation, Customer } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomersWithLocations, assignStorageLocation } from "@/lib/supabase";
import { toast } from "sonner";

export default function StorageMap({ selectedCustomer }: { selectedCustomer?: Customer }) {
  const hotels = [1, 2];
  const sections = ["A", "B", "C"];
  const shelves = [1, 2, 3, 4];
  const queryClient = useQueryClient();

  const { data: customers } = useQuery({
    queryKey: ['customers-locations'],
    queryFn: getCustomersWithLocations
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

  const getCustomerAtLocation = (hotel: number, section: string, shelf: number) => {
    return customers?.find(customer => 
      customer.storageLocation?.hotel === hotel &&
      customer.storageLocation?.section === section &&
      customer.storageLocation?.shelf === shelf.toString()
    );
  };

  const formatLocationCode = (hotel: number, section: string, shelf: number) => {
    return `H${hotel}-${section}-${shelf}`;
  };

  const handleLocationClick = (hotel: number, section: string, shelf: number) => {
    if (!selectedCustomer) return;
    
    const existingCustomer = getCustomerAtLocation(hotel, section, shelf);
    if (existingCustomer) {
      toast.error('This location is already occupied');
      return;
    }

    assignLocation.mutate({
      customerId: selectedCustomer.id,
      location: {
        hotel,
        section,
        shelf: shelf.toString(),
        level: 1,
        position: 1
      }
    });
  };
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {hotels.map((hotel) => (
        <Card key={hotel} className="p-4">
          <h3 className="text-lg font-semibold mb-4">Hotel {hotel}</h3>
          <div className="grid grid-cols-3 gap-4">
            {sections.map((section) => (
              <div key={section} className="space-y-2">
                <h4 className="font-medium">Section {section}</h4>
                {shelves.map((shelf) => {
                  const customer = getCustomerAtLocation(hotel, section, shelf);
                  const isSelected = selectedCustomer?.id === customer?.id;
                  const locationCode = formatLocationCode(hotel, section, shelf);
                  return (
                    <div
                      key={shelf}
                      onClick={() => handleLocationClick(hotel, section, shelf)}
                      className={`p-2 border rounded cursor-pointer ${
                        isSelected
                          ? "bg-blue-100 border-blue-500"
                          : customer
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm">
                        <div>{locationCode}</div>
                        {customer ? (
                          <div className="font-medium text-blue-600">{customer.licensePlate}</div>
                        ) : (
                          <div className="text-gray-400">Empty</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}