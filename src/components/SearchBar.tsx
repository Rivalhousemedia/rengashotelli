import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Camera } from "lucide-react";
import { useState } from "react";
import { searchCustomers } from "@/lib/api/customerApi";
import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "@/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QrReader } from "react-qr-reader";
import { toast } from "sonner";

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchCustomers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Failed to search customers");
    } finally {
      setIsSearching(false);
    }
  };

  const handleQrScan = (data: string | null) => {
    if (data) {
      try {
        const scannedData = JSON.parse(data);
        if (scannedData.hotel && scannedData.section && scannedData.shelf) {
          const locationCode = `H${scannedData.hotel}-${scannedData.section}-${scannedData.shelf}`;
          handleSearch(locationCode);
          setIsScanning(false);
          toast.success("QR code scanned successfully");
        }
      } catch (error) {
        console.error('QR scan error:', error);
        toast.error("Invalid QR code");
      }
    }
  };

  const formatLocationCode = (customer: Customer) => {
    if (!customer.storageLocation) return 'Not assigned';
    const { hotel, section, shelf } = customer.storageLocation;
    const hotelStr = hotel?.toString();
    const sectionStr = section?.toString();
    const shelfStr = shelf?.toString();
    
    if (!hotelStr || !sectionStr || !shelfStr) return 'Not assigned';
    return `H${hotelStr}-${sectionStr}-${shelfStr}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            className="pl-10"
            placeholder="Search by name, license plate, or location code (e.g. H1-A-1)..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Dialog open={isScanning} onOpenChange={setIsScanning}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Scan QR
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="w-full max-w-sm mx-auto">
              <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={(result) => result && handleQrScan(result.getText())}
                className="w-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isSearching && <p>Searching...</p>}
      
      <div className="grid gap-4">
        {searchResults.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="pt-6">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{customer.name}</span>
                  <span className="text-muted-foreground">{customer.licensePlate}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Summer Tire Size: {customer.summerTireSize}
                  <br />
                  Winter Tire Size: {customer.winterTireSize}
                  <br />
                  Location: {formatLocationCode(customer)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}