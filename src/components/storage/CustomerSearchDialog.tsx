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

  const handleSearch = async (query: string) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await searchCustomers(query);
      const availableCustomers = results.filter(customer => !customer.storageLocation);
      setSearchResults(availableCustomers);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Asiakkaiden haku epäonnistui");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      setIsSearchMode(true);
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
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              {searchResults.map((customer) => (
                <Card key={customer.id} className="hover:bg-gray-100/5 transition-colors cursor-pointer" onClick={() => onCustomerSelect(customer)}>
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