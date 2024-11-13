import CustomerForm from "@/components/CustomerForm";
import SearchBar from "@/components/SearchBar";
import StorageMap from "@/components/StorageMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tire Storage Management</h1>
        </header>

        <Tabs defaultValue="new" className="space-y-6">
          <TabsList>
            <TabsTrigger value="new">New Customer</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="storage">Storage Map</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6">
            <CustomerForm />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <SearchBar />
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <StorageMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}