import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          className="pl-10"
          placeholder="Search by name or license plate..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button variant="outline">Search</Button>
    </div>
  );
}