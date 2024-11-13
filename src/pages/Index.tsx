import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerForm from "@/components/CustomerForm";
import SearchBar from "@/components/SearchBar";
import StorageMap from "@/components/StorageMap";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navigation />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="new" className="space-y-8">
          <TabsList className="bg-gray-800/50 p-1 rounded-lg">
            <TabsTrigger 
              value="new" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-6 py-2"
            >
              New Customer
            </TabsTrigger>
            <TabsTrigger 
              value="search"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-6 py-2"
            >
              Search
            </TabsTrigger>
            <TabsTrigger 
              value="storage"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-6 py-2"
            >
              Storage Map
            </TabsTrigger>
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