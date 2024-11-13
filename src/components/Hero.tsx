import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Professional
            <span className="text-green-500"> Tire Storage</span>
            <br />
            Management
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Secure and efficient tire storage solutions for your vehicles.
            Professional service with easy tracking and management.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
              Get Started
            </Button>
            <Button variant="outline" className="text-white border-gray-600 px-8 py-6 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.green.100),theme(colors.gray.900))] opacity-20" />
    </div>
  );
}