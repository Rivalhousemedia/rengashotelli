import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Tire Storage
            </Link>
          </div>
          <div className="flex items-center">
            <img 
              src="/rengaspalvelu-logo.png" 
              alt="Rengaspalvelu" 
              className="h-8 mr-4"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}