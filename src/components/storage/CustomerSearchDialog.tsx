import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Customer } from "@/lib/types";
import { searchCustomers } from "@/lib/api/customerApi";
import CustomerForm from "../CustomerForm";

interface CustomerSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerSelect: (customer: Customer) => void;
  preselectedLocation?: string;
}

export default function CustomerSearchDialog({
  isOpen,
  onClose,
  onCustomerSelect,
  preselectedLocation
}: CustomerSearchDialogProps) {
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    console.log("=== Search Debug Start ===");
    console.log("Search triggered with query:", query);
    console.log("Current search mode:", isSearchMode);
    console.log("Dialog open state:", isOpen);
    
    if (query.length < 1) {
      console.log("Query too short, clearing results");
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      console.log("Calling searchCustomers API with query:", query);
      const results = await searchCustomers(query);
      console.log("Raw API results:", results);
      
      // Debug each result's storage location
      results.forEach((customer, index) => {
        console.log(`Customer ${index + 1} (${customer.name}):`, {
          id: customer.id,
          hasStorageLocation: !!customer.storageLocation,
          storageLocation: customer.storageLocation,
          rawCustomer: customer
        });
      });
      
      // Filter out customers that have an active storage location
      const availableCustomers = results.filter(customer => {
        const hasNoLocation = !customer.storageLocation;
        console.log(`Filtering ${customer.name}:`, {
          hasNoLocation,
          storageLocationValue: customer.storageLocation,
          willBeIncluded: hasNoLocation
        });
        return hasNoLocation;
      });
      
      console.log("Final filtered customers:", availableCustomers);
      console.log("Setting search results to:", availableCustomers);
      setSearchResults(availableCustomers);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Asiakkaiden haku epäonnistui");
    } finally {
      setIsSearching(false);
      console.log("=== Search Debug End ===");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      setIsSearchMode(true);
      setSearchResults([]);
    }}>
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
                  onChange={(e) => {
                    console.log("Input value changed:", e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
              </div>
            </div>

            {isSearching ? (
              <div className="text-center text-gray-500">Haetaan asiakkaita...</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-gray-500">Ei tuloksia</div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((customer) => (
                  <Card 
                    key={customer.id} 
                    className="hover:bg-gray-100/5 transition-colors cursor-pointer" 
                    onClick={() => onCustomerSelect(customer)}
                  >
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
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setIsSearchMode(false)}>
                Lisää uusi asiakas
              </Button>
            </div>
          </div>
        ) : (
          <CustomerForm 
            preselectedLocation={preselectedLocation}
            onSuccess={() => {
              onClose();
              toast.success("Asiakas lisätty onnistuneesti!");
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}