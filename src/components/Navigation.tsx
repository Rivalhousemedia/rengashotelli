import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="https://artonrengaspalvelu.fi/wp-content/uploads/2024/01/artonrengaslogo.png" 
              alt="Rengaspalvelu" 
              className="h-8"
            />
            {/* Removed the text "Tire Storage" */}
          </div>
        </div>
      </div>
    </nav>
  );
}