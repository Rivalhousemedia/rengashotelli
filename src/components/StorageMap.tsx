import { Card } from "@/components/ui/card";
import type { StorageLocation, Customer } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getCustomersWithLocations } from "@/lib/supabase";

export default function StorageMap({ selectedLocation }: { selectedLocation?: StorageLocation }) {
  const hotels = [1, 2];
  const sections = ["A", "B", "C"];
  const shelves = [1, 2, 3, 4];

  const { data: customers } = useQuery({
    queryKey: ['customers-locations'],
    queryFn: getCustomersWithLocations
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
                  return (
                    <div
                      key={shelf}
                      className={`p-2 border rounded ${
                        selectedLocation?.hotel === hotel &&
                        selectedLocation?.section === section &&
                        selectedLocation?.shelf === shelf.toString()
                          ? "bg-blue-100 border-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm">
                        <div>{formatLocationCode(hotel, section, shelf)}</div>
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