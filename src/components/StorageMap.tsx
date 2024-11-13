import type { StorageLocation, Customer } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomersWithLocations, assignStorageLocation } from "@/lib/api/storageApi";
import { searchCustomers } from "@/lib/api/customerApi";
import { toast } from "sonner";
import StorageHotel from "./storage/StorageHotel";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import CustomerForm from "./CustomerForm";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Search } from "lucide-react";

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
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
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
      toast.success('Varastopaikka määritetty onnistuneesti');
      setIsDialogOpen(false);
    },
    onError: () => {
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
      setIsSearchMode(true); // Start in search mode
    }
  };

  const handleRemoveCustomer = (customerId: string) => {
    removeFromLocation.mutate(customerId);
  };

  const handleSearch = async (query: string) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await searchCustomers(query);
      // Filter to show only customers without a storage location
      const availableCustomers = results.filter(customer => !customer.storageLocation);
      setSearchResults(availableCustomers);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Asiakkaiden haku epäonnistui");
    }
  };

  const handleAssignExistingCustomer = async (customer: Customer) => {
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
          <DialogTitle>
            {isSearchMode ? "Etsi olemassa oleva asiakas" : "Lisää uusi asiakas"}
          </DialogTitle>
          <DialogDescription>
            {isSearchMode ? 
              "Hae asiakasta nimellä tai rekisterinumerolla" : 
              "Täytä uuden asiakkaan tiedot"
            }
          </DialogDescription>

          {isSearchMode ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    className="pl-10"
                    placeholder="Hae nimellä tai rekisterinumerolla..."
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {searchResults.map((customer) => (
                  <Card key={customer.id} className="hover:bg-gray-100/5 transition-colors cursor-pointer" onClick={() => handleAssignExistingCustomer(customer)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{customer.name}</div>
                          <div className="text-sm text-gray-400">{customer.licensePlate}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Valitse
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setIsSearchMode(false)}>
                  Lisää uusi asiakas
                </Button>
              </div>
            </div>
          ) : (
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}