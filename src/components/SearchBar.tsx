import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { searchCustomers } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "@/lib/types";

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            className="pl-10"
            placeholder="Search by name or license plate..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">Search</Button>
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
                  Tire Size: {customer.tireSize}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}