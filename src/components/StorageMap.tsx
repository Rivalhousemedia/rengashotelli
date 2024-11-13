import { Card } from "@/components/ui/card";
import type { StorageLocation, Customer } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomersWithLocations, assignStorageLocation } from "@/lib/api/storageApi";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StorageMapProps {
  selectedCustomer?: Customer;
  onLocationSelect?: (hotel: number, section: string, shelf: number) => void;
}

export default function StorageMap({ selectedCustomer, onLocationSelect }: StorageMapProps) {
  const hotels = [1, 2, 3, 4];
  const sections = ["A", "B", "C"];
  const shelves = [1, 2, 3, 4, 5, 6];
  const queryClient = useQueryClient();

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

  const formatLocationCode = (hotel: number, section: string, shelf: number) => {
    return `H${hotel}-${section}-${shelf}`;
  };

  const handleLocationClick = async (hotel: number, section: string, shelf: number) => {
    if (!selectedCustomer) return;
    
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
  };

  const handleRemoveCustomer = (customerId: string) => {
    removeFromLocation.mutate(customerId);
  };
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {hotels.map((hotel) => (
        <Card key={hotel} className="p-4 bg-gray-900/50 border-gray-800">
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
                    <Popover key={shelf}>
                      <PopoverTrigger asChild>
                        <div
                          onClick={() => !customer && handleLocationClick(hotel, section, shelf)}
                          className={`p-2 border rounded cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-green-600/20 border-green-500 text-green-400"
                              : customer
                              ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                              : "bg-gray-800/30 border-gray-700 hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="text-sm">
                            <div className="text-gray-300">{locationCode}</div>
                            {customer ? (
                              <div className="font-medium text-green-400">{customer.licensePlate}</div>
                            ) : (
                              <div className="text-gray-500">Empty</div>
                            )}
                          </div>
                        </div>
                      </PopoverTrigger>
                      {customer && (
                        <PopoverContent className="w-80">
                          <div className="space-y-4">
                            <h4 className="font-medium">Customer Details</h4>
                            <div className="space-y-2">
                              <div>
                                <Label>Name</Label>
                                <div>{customer.name}</div>
                              </div>
                              <div>
                                <Label>License Plate</Label>
                                <div>{customer.licensePlate}</div>
                              </div>
                              <div>
                                <Label>Summer Tire Size</Label>
                                <div>{customer.summerTireSize}</div>
                              </div>
                              <div>
                                <Label>Winter Tire Size</Label>
                                <div>{customer.winterTireSize}</div>
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <div>{customer.phone}</div>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <div>{customer.email}</div>
                              </div>
                            </div>
                            <Button 
                              variant="destructive"
                              onClick={() => handleRemoveCustomer(customer.id)}
                              className="w-full"
                            >
                              Remove from Location
                            </Button>
                          </div>
                        </PopoverContent>
                      )}
                    </Popover>
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
