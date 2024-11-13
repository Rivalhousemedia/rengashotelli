import { Card } from "@/components/ui/card";
import type { StorageLocation } from "@/lib/types";

export default function StorageMap({ selectedLocation }: { selectedLocation?: StorageLocation }) {
  const hotels = [1, 2];
  const sections = ["A", "B", "C"];
  const shelves = [1, 2, 3, 4];
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {hotels.map((hotel) => (
        <Card key={hotel} className="p-4">
          <h3 className="text-lg font-semibold mb-4">Hotel {hotel}</h3>
          <div className="grid grid-cols-3 gap-4">
            {sections.map((section) => (
              <div key={section} className="space-y-2">
                <h4 className="font-medium">Section {section}</h4>
                {shelves.map((shelf) => (
                  <div
                    key={shelf}
                    className={`p-2 border rounded ${
                      selectedLocation?.hotel === hotel &&
                      selectedLocation?.section === section &&
                      selectedLocation?.shelf === shelf
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    Shelf {shelf}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}