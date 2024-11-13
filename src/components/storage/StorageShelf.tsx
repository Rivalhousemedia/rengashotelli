import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import LocationQRCode from "../LocationQRCode";
import type { Customer } from "@/lib/types";
import { Link } from "react-router-dom";

interface StorageShelfProps {
  hotel: number;
  section: string;
  shelf: number;
  selectedCustomer?: Customer;
  customer?: Customer;
  onLocationSelect?: (hotel: number, section: string, shelf: number) => void;
  onRemoveCustomer: (customerId: string) => void;
  onPrintQRCode: (hotel: number, section: string, shelf: number) => void;
}

export default function StorageShelf({
  hotel,
  section,
  shelf,
  selectedCustomer,
  customer,
  onLocationSelect,
  onRemoveCustomer,
  onPrintQRCode
}: StorageShelfProps) {
  const isSelected = selectedCustomer?.id === customer?.id;
  const locationCode = `H${hotel}-${section}-${shelf}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          onClick={() => !customer && onLocationSelect?.(hotel, section, shelf)}
          className={`p-2 border rounded cursor-pointer transition-colors ${
            isSelected
              ? "bg-green-600/20 border-green-500 text-green-400"
              : customer
              ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
              : "bg-gray-800/30 border-gray-700 hover:bg-gray-800/50"
          }`}
        >
          <div className="text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{locationCode}</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div id={`location-qr-${hotel}-${section}-${shelf}`}>
                    <LocationQRCode 
                      hotel={hotel} 
                      section={section} 
                      shelf={shelf} 
                    />
                  </div>
                  <Button 
                    className="mt-4 w-full"
                    onClick={() => onPrintQRCode(hotel, section, shelf)}
                  >
                    Print QR Code
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
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
            <div className="space-y-2">
              <Button 
                variant="destructive"
                onClick={() => onRemoveCustomer(customer.id)}
                className="w-full mb-2"
              >
                Remove from Location
              </Button>
              <Link to={`/customer/${customer.id}`}>
                <Button variant="secondary" className="w-full">
                  Edit Customer
                </Button>
              </Link>
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
